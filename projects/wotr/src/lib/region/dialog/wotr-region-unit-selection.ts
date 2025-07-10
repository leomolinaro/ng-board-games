import { WotrGenericUnitType, WotrNationId } from "../../nation/wotr-nation.models";
import { WotrRegionId } from "../wotr-region.models";

export type WotrRegionUnitSelection =
  | WotrMovingArmyUnitSelection
  | WotrAttackingUnitSelection
  | WotrDisbandingUnitSelection;

interface AWotrRegionUnitSelection {
  type: string;
  regionIds: WotrRegionId[];
}

export interface WotrMovingArmyUnitSelection extends AWotrRegionUnitSelection {
  type: "moveArmy";
  withLeaders: boolean;
}

export interface WotrAttackingUnitSelection extends AWotrRegionUnitSelection {
  type: "attack";
  withLeaders: boolean;
  underSiege: boolean;
}

export interface WotrDisbandingUnitSelection extends AWotrRegionUnitSelection {
  type: "disband";
  nArmyUnits: number;
  underSiege: boolean;
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
  disabled?: boolean;
}

interface WotrRegionUnitSelectionMode {
  initialize(unitNodes: UnitNode[]): void;
  canConfirm(selectedNodes: UnitNode[]): true | string;
}

export function selectionModeFactory(
  unitSelection: WotrRegionUnitSelection
): WotrRegionUnitSelectionMode {
  switch (unitSelection.type) {
    case "moveArmy":
      return new MoveArmySelectionMode(unitSelection.withLeaders);
    // case "attack":
    // return new AttackSelectionMode();
    case "disband":
      return new DisbandSelectionMode(unitSelection.nArmyUnits, unitSelection.underSiege);
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
      } else {
        unitNode.disabled = true;
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
  constructor(private withLeaders: boolean) {}
  initialize(unitNodes: UnitNode[]) {
    for (const unitNode of unitNodes) {
      if (unitNode.group === "army") {
        unitNode.selectable = true;
        unitNode.selected = true;
      } else {
        unitNode.disabled = true;
      }
    }
  }

  canConfirm(selectedNodes: UnitNode[]): true | string {
    const someArmyUnits = selectedNodes.some(node => {
      if (node.type === "regular") return true;
      if (node.type === "elite") return true;
      return false;
    });
    if (!someArmyUnits) return "Select at least one regular or elite unit to move.";
    if (this.withLeaders) {
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
