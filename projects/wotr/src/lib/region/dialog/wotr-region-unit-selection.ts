import { WotrCharacterId } from "../../character/wotr-character.models";
import { WotrCharacterStore } from "../../character/wotr-character.store";
import { WotrFrontId } from "../../front/wotr-front.models";
import { WotrGenericUnitType, WotrNationId } from "../../nation/wotr-nation.models";
import { WotrUnits } from "../../unit/wotr-unit.models";
import { WotrRegion, WotrRegionId } from "../wotr-region.models";

export type WotrRegionUnitSelection =
  | WotrMovingArmyUnitSelection
  | WotrAttackingUnitSelection
  | WotrDisbandingUnitSelection
  | WotrChooseCasualtiesUnitSelection
  | WotrMovingCharactersUnitSelection;

interface AWotrRegionUnitSelection {
  type: string;
  regionIds: WotrRegionId[];
}

export interface WotrMovingCharactersUnitSelection extends AWotrRegionUnitSelection {
  type: "moveCharacters";
  characters: WotrCharacterId[];
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

export interface UnitNode {
  id: string;
  type: WotrGenericUnitType | "character" | "fellowship";
  nationId: WotrNationId | null;
  group: "army" | "underSiege" | "freeUnits" | "fellowship";
  source: string;
  label: string;
  width: number;
  height: number;
  selected?: boolean;
  downgrading?: boolean;
  removing?: boolean;
  selectable?: boolean;
}

interface WotrRegionUnitSelectionMode {
  initialize(unitNodes: UnitNode[], region: WotrRegion): void;
  canConfirm(selectedNodes: UnitNode[], region: WotrRegion): true | string;
}

export function selectionModeFactory(
  unitSelection: WotrRegionUnitSelection,
  characterStore: WotrCharacterStore
): WotrRegionUnitSelectionMode {
  switch (unitSelection.type) {
    case "moveArmy":
      return new MoveArmySelectionMode(unitSelection, characterStore);
    case "attack":
      return new AttackSelectionMode(unitSelection.withLeaders, unitSelection.frontId);
    case "disband":
      return new DisbandSelectionMode(unitSelection.nArmyUnits, unitSelection.underSiege);
    case "moveCharacters":
      return new MoveCharactersSelectionMode(unitSelection.characters);
    case "chooseCasualties":
      return new ChooseCasualtiesSelectionMode(unitSelection);
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
    private characterStore: WotrCharacterStore
  ) {}

  initialize(unitNodes: UnitNode[]) {
    if (this.unitSelection.retroguard) throw new Error("Method not implemented.");
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
    if (!this.unitSelection.required) return true;
    const someArmyUnits = selectedNodes.some(node => {
      if (node.type === "regular") return true;
      if (node.type === "elite") return true;
      return false;
    });
    if (!someArmyUnits) return "Select at least one regular or elite unit to move.";
    if (this.unitSelection.withLeaders) {
      const someLeaders = selectedNodes.some(node => {
        if (node.type === "character") return true;
        if (node.type === "nazgul") return true;
        if (node.type === "leader") return true;
        return false;
      });
      if (!someLeaders) return "Select at least one leader to move.";
    }
    return true;
  }
}

export class AttackSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(
    private withLeaders: boolean,
    private frontId: WotrFrontId
  ) {}

  initialize(unitNodes: UnitNode[], region: WotrRegion) {
    const underSiegeArmy = region.underSiegeArmy?.front === this.frontId;
    for (const unitNode of unitNodes) {
      if (unitNode.group !== "army" && unitNode.group !== "underSiege") continue;
      if (underSiegeArmy && unitNode.group === "army") continue;
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
      const someLeaders = selectedNodes.some(node => {
        if (node.type === "character") return true;
        if (node.type === "nazgul") return true;
        if (node.type === "leader") return true;
        return false;
      });
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

export class ChooseCasualtiesSelectionMode implements WotrRegionUnitSelectionMode {
  constructor(private unitSelection: WotrChooseCasualtiesUnitSelection) {}

  initialize(unitNodes: UnitNode[]) {
    if (this.unitSelection.retroguard) throw new Error("Method not implemented.");
    if (this.unitSelection.hitPoints === "full") {
      const group = this.unitSelection.underSiege ? "underSiege" : "army";
      for (const node of unitNodes) {
        if (node.group === group) {
          node.removing = true;
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
      if (selectedHitPoints < this.unitSelection.hitPoints) {
        return `Select casualties with at least ${this.unitSelection.hitPoints} hit points.`;
      }
      return true;
    }
  }
}
