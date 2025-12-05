import { immutableUtil } from "../../../../../commons/utils/src";
import { WotrCharacterId } from "../../character/wotr-character-models";
import { WotrCharacterStore } from "../../character/wotr-character-store";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrNationId } from "../../nation/wotr-nation-models";
import {
  unitTypeMatchLabel,
  WotrRegionUnitTypeMatch,
  WotrUnits
} from "../../unit/wotr-unit-models";
import { WotrUnitModifiers } from "../../unit/wotr-unit-modifiers";
import { WotrRegion, WotrRegionId } from "../wotr-region-models";
import { UnitNode } from "./wotr-region-unit-node";

export type WotrRegionUnitSelection =
  | WotrMovingArmyUnitSelection
  | WotrAttackingUnitSelection
  | WotrDisbandingUnitSelection
  | WotrChooseCasualtiesUnitSelection
  | WotrMovingCharactersUnitSelection
  | WotrMovingNazgulUnitSelection
  | WotrDowngradingUnitSelection
  | WotrEliminateUnitSelection
  | WotrForfeitLeadershipSelection;

interface AWotrRegionUnitSelection {
  type: string;
  regionIds: WotrRegionId[];
}

export interface WotrMovingCharactersUnitSelection extends AWotrRegionUnitSelection {
  type: "moveCharacters";
  characters: WotrCharacterId[];
}

export interface WotrMovingNazgulUnitSelection extends AWotrRegionUnitSelection {
  type: "moveNazgul";
}

export interface WotrMovingArmyUnitSelection extends AWotrRegionUnitSelection {
  type: "moveArmy";
  withLeaders: boolean;
  retroguard: WotrUnits | null;
  required: boolean;
}

export interface WotrAttackingUnitSelection extends AWotrRegionUnitSelection {
  type: "attack";
  withLeaders: boolean;
  frontId: WotrFrontId;
}

export interface WotrDisbandingUnitSelection extends AWotrRegionUnitSelection {
  type: "disband";
  nArmyUnits: number;
  underSiege: boolean;
}

export interface WotrChooseCasualtiesUnitSelection extends AWotrRegionUnitSelection {
  type: "chooseCasualties";
  hitPoints: number | "full";
  underSiege: boolean;
  retroguard: WotrUnits | null;
}

export interface WotrDowngradingUnitSelection extends AWotrRegionUnitSelection {
  type: "downgradeUnit";
  nEliteUnits: 1;
}

export interface WotrEliminateUnitSelection extends AWotrRegionUnitSelection {
  type: "eliminateUnit";
  unitType: WotrRegionUnitTypeMatch;
  nationId: WotrNationId;
}

export interface WotrForfeitLeadershipSelection extends AWotrRegionUnitSelection {
  type: "forfeitLeadership";
  frontId: WotrFrontId;
  minPoints: number;
  onlyNazgul?: boolean;
  message: string;
}

interface WotrRegionUnitSelectionMode {
  initialize(unitNodes: UnitNode[], region: WotrRegion): void;
  canConfirm(selectedNodes: UnitNode[], region: WotrRegion): true | string;
}

export function selectionModeFactory(
  unitSelection: WotrRegionUnitSelection,
  characterStore: WotrCharacterStore,
  unitModifiers: WotrUnitModifiers
): WotrRegionUnitSelectionMode {
  switch (unitSelection.type) {
    case "moveArmy":
      return new MoveArmySelectionMode(unitSelection, characterStore, unitModifiers);
    case "attack":
      return new AttackSelectionMode(
        unitSelection.withLeaders,
        unitSelection.frontId,
        unitModifiers
      );
    case "disband":
      return new DisbandSelectionMode(unitSelection.nArmyUnits, unitSelection.underSiege);
    case "moveCharacters":
      return new MoveCharactersSelectionMode(unitSelection.characters);
    case "moveNazgul":
      return new MoveNazgulSelectionMode(unitSelection);
    case "chooseCasualties":
      return new ChooseCasualtiesSelectionMode(unitSelection);
    case "downgradeUnit":
      return new DowngradeUnitSelectionMode(unitSelection.nEliteUnits);
    case "eliminateUnit":
      return new EliminateUnitSelectionMode(unitSelection.unitType, unitSelection.nationId);
    case "forfeitLeadership":
      return new ForfeitLeadershipSelectionMode(unitSelection);
    default:
      throw new Error(`Unknown selection mode type: ${unitSelection}`);
  }
}

class DisbandSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private nArmyUnits: number,
    private underSiege: boolean
  ) {}

  initialize(unitNodes: UnitNode[]) {
    const group = this.underSiege ? "underSiege" : "army";
    for (const unitNode of unitNodes) {
      if (unitNode.group === group && (unitNode.type === "regular" || unitNode.type === "elite")) {
        unitNode.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const armyUnits = selectedNodes.filter(
      node => node.type === "regular" || node.type === "elite"
    );
    if (armyUnits.length !== this.nArmyUnits) {
      return `Select at least ${this.nArmyUnits} army units to disband.`;
    }
    return true;
  }
}

export class MoveArmySelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private unitSelection: WotrMovingArmyUnitSelection,
    private characterStore: WotrCharacterStore,
    private unitModifiers: WotrUnitModifiers
  ) {}

  initialize(unitNodes: UnitNode[]) {
    if (this.unitSelection.retroguard) {
      unitNodes = removeRetroguardUnits(unitNodes, this.unitSelection.retroguard);
    }
    for (const unitNode of unitNodes) {
      if (unitNode.group !== "army") continue;
      if (
        unitNode.type === "character" &&
        this.characterStore.character(unitNode.id as WotrCharacterId).level === 0
      ) {
        continue;
      }
      unitNode.selectable = true;
      unitNode.selected = true;
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 0 && !this.unitSelection.required) return true;
    const someArmyUnits = selectedNodes.some(node => {
      if (node.type === "regular") return true;
      if (node.type === "elite") return true;
      return false;
    });
    if (!someArmyUnits) return "Select at least one regular or elite unit to move.";
    if (!this.unitSelection.required) return true;
    if (this.unitSelection.withLeaders) {
      const someLeaders = hasLeaders(selectedNodes, this.unitModifiers);
      if (!someLeaders) return "Select at least one leader to move.";
    }
    return true;
  }
}

function removeRetroguardUnits(nodes: UnitNode[], retroguard: WotrUnits): UnitNode[] {
  retroguard.regulars?.forEach(unit => {
    for (let i = 0; i < unit.quantity; i++) {
      nodes = immutableUtil.listRemoveFirst(
        node => node.type === "regular" && node.nationId === unit.nation,
        nodes
      );
    }
  });
  retroguard.elites?.forEach(unit => {
    for (let i = 0; i < unit.quantity; i++) {
      nodes = immutableUtil.listRemoveFirst(
        node => node.type === "elite" && node.nationId === unit.nation,
        nodes
      );
    }
  });
  retroguard.leaders?.forEach(unit => {
    for (let i = 0; i < unit.quantity; i++) {
      nodes = immutableUtil.listRemoveFirst(
        node => node.type === "leader" && node.nationId === unit.nation,
        nodes
      );
    }
  });
  if (retroguard.nNazgul) {
    for (let i = 0; i < retroguard.nNazgul; i++) {
      nodes = immutableUtil.listRemoveFirst(node => node.type === "nazgul", nodes);
    }
  }
  retroguard.characters?.forEach(unit => {
    nodes = immutableUtil.listRemoveFirst(
      node => node.type === "character" && node.id === unit,
      nodes
    );
  });
  return nodes;
}

function hasLeaders(selectedNodes: UnitNode[], unitModifiers: WotrUnitModifiers): boolean {
  return selectedNodes.some(node => {
    if (node.type === "character") return true;
    if (node.type === "nazgul") return true;
    if (node.type === "leader") return true;
    if (node.type === "regular" || node.type === "elite") {
      if (node.nationId && unitModifiers.isLeader(node.type, node.nationId)) return true;
    }
    return false;
  });
}

export class AttackSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private withLeaders: boolean,
    private frontId: WotrFrontId,
    private unitModifiers: WotrUnitModifiers
  ) {}

  initialize(unitNodes: UnitNode[], region: WotrRegion) {
    const isUnderSiegeArmy = region.underSiegeArmy?.front === this.frontId;
    for (const unitNode of unitNodes) {
      if (unitNode.group !== "army" && unitNode.group !== "underSiege") continue;
      if (isUnderSiegeArmy) {
        if (unitNode.group !== "underSiege") continue;
      } else {
        if (unitNode.group !== "army") continue;
      }
      unitNode.selectable = true;
      unitNode.selected = true;
    }
  }

  canConfirm(selectedNodes: UnitNode[], region: WotrRegion): true | string {
    const someArmyUnits = selectedNodes.some(node => {
      if (node.type === "regular") return true;
      if (node.type === "elite") return true;
      return false;
    });
    if (!someArmyUnits) return "Select at least one regular or elite unit to attack.";
    if (this.withLeaders) {
      const someLeaders = hasLeaders(selectedNodes, this.unitModifiers);
      if (!someLeaders) return "Select at least one leader to attack.";
    }
    return true;
  }
}

export class MoveCharactersSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private characters: WotrCharacterId[]) {}

  initialize(unitNodes: UnitNode[]) {
    for (const unitNode of unitNodes) {
      if (
        unitNode.type === "character" &&
        this.characters.includes(unitNode.id as WotrCharacterId)
      ) {
        unitNode.selectable = true;
        unitNode.selected = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 0) {
      return "Select at least one character to move.";
    }
    return true;
  }
}

export class MoveNazgulSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrMovingNazgulUnitSelection) {}

  initialize(unitNodes: UnitNode[]) {
    for (const unitNode of unitNodes) {
      if (
        unitNode.type === "nazgul" ||
        (unitNode.type === "character" && unitNode.id === "the-witch-king")
      ) {
        unitNode.selectable = true;
        unitNode.selected = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length === 0) {
      return "Select at least one Nazgul to move.";
    }
    return true;
  }
}

export class ChooseCasualtiesSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrChooseCasualtiesUnitSelection) {}

  initialize(unitNodes: UnitNode[]) {
    if (this.unitSelection.retroguard) {
      unitNodes = removeRetroguardUnits(unitNodes, this.unitSelection.retroguard);
    }
    const group = this.unitSelection.underSiege ? "underSiege" : "army";
    if (this.unitSelection.hitPoints === "full") {
      for (const node of unitNodes) {
        if (node.group === group) {
          node.removing = true;
        }
      }
    } else {
      for (const node of unitNodes) {
        if (node.group === group && (node.type === "regular" || node.type === "elite")) {
          node.selectable = true;
        }
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const group = this.unitSelection.underSiege ? "underSiege" : "army";
    const nodes = selectedNodes.filter(node => node.group === group);
    if (this.unitSelection.hitPoints === "full") {
      if (nodes.every(node => node.removing)) {
        return true;
      } else {
        return "Remove all the units.";
      }
    } else {
      let selectedHitPoints = 0;
      for (const node of nodes) {
        switch (node.type) {
          case "regular":
            if (node.removing) {
              selectedHitPoints += 1;
            }
            break;
          case "elite":
            if (node.downgrading) {
              selectedHitPoints += 1;
            } else if (node.removing) {
              selectedHitPoints += 2;
            }
            break;
        }
      }
      if (selectedHitPoints !== this.unitSelection.hitPoints) {
        return `Select casualties with ${this.unitSelection.hitPoints} hit points.`;
      }
      return true;
    }
  }
}

export class DowngradeUnitSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private nEliteUnits: 1) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (node.type === "elite" && node.group === "army") {
        node.selectable = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const eliteUnits = selectedNodes.filter(node => node.type === "elite");
    if (eliteUnits.length !== this.nEliteUnits) {
      return `Select ${this.nEliteUnits} elite unit${this.nEliteUnits > 1 ? "s" : ""} to downgrade.`;
    }
    return true;
  }
}

export class EliminateUnitSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private unitType: WotrRegionUnitTypeMatch,
    private nationId: WotrNationId
  ) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      node.selectable = this.isSelectable(this.unitType, node);
    }
  }

  private isSelectable(type: WotrRegionUnitTypeMatch, node: UnitNode): boolean {
    if (node.nationId !== this.nationId) return false;
    switch (type) {
      case "regular":
        return node.type === "regular";
      case "elite":
        return node.type === "elite";
      case "leader":
        return node.type === "leader";
      case "nazgul":
        return node.type === "nazgul";
      case "army":
        return node.type === "regular" || node.type === "elite";
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    if (selectedNodes.length !== 1) {
      return `Select one ${unitTypeMatchLabel(this.unitType)} to eliminate.`;
    }
    return true;
  }
}

export class ForfeitLeadershipSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private params: WotrForfeitLeadershipSelection) {}

  initialize(unitNodes: UnitNode[]): void {
    for (const node of unitNodes) {
      if (this.isSelectable(node)) {
        node.selectable = true;
      }
    }
  }

  private isSelectable(node: UnitNode): boolean {
    if (node.frontId !== this.params.frontId) return false;
    if (node.type === "leader" && !this.params.onlyNazgul) return true;
    if (node.type === "nazgul") return true;
    if (node.type === "character") return !this.params.onlyNazgul || node.id === "the-witch-king";
    return false;
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    let totalPoints = 0;
    for (const node of selectedNodes) {
      switch (node.type) {
        case "leader":
          totalPoints += 1;
          break;
        case "nazgul":
          totalPoints += 1;
          break;
        case "character":
          totalPoints += node.character.leadership;
          break;
      }
    }
    if (totalPoints >= this.params.minPoints) return true;
    return this.params.message;
  }
}
