import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgTransformFn, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsStore, WotrUnitImage } from "../../assets/wotr-assets-store";
import { WotrCharacter, WotrCharacterId } from "../../character/wotr-character-models";
import { WotrCharacterStore } from "../../character/wotr-character-store";
import { WotrFellowship } from "../../fellowship/wotr-fellowhip-models";
import { WotrNation, WotrNationId } from "../../nation/wotr-nation-models";
import { WotrUnits } from "../../unit/wotr-unit-models";
import { WotrRegion } from "../wotr-region-models";
import {
  UnitNode,
  WotrRegionUnitSelection,
  selectionModeFactory
} from "./wotr-region-unit-selection";

export interface WotrRegionDialogData {
  region: WotrRegion;
  nationById: Record<WotrNationId, WotrNation>;
  characterById: Record<WotrCharacterId, WotrCharacter>;
  fellowship: WotrFellowship;
  regionSelection: boolean;
  unitSelection: WotrRegionUnitSelection | null;
}

export type WotrRegionDialogResult =
  | true
  | WotrUnits
  | { removing: WotrUnits; downgrading: WotrUnits };

export type WotrRegionDialogRef = MatDialogRef<WotrRegionDialog, WotrRegionDialogResult>;

@Component({
  selector: "wotr-region-dialog",
  imports: [MatTooltipModule],
  template: `
    <h1>{{ data.region.name }}</h1>
    <div [class]="{ 'unit-selection-active': data.unitSelection }">
      @for (unitNode of unitNodes; track unitNode.id) {
        <img
          class="unit"
          [class]="{
            selectable: unitNode.selectable,
            selected: unitNode.selected,
            downgrading: unitNode.downgrading,
            removing: unitNode.removing
          }"
          [src]="unitNode.source"
          [width]="unitNode.width"
          [height]="unitNode.height"
          [matTooltip]="unitNode.label"
          (click)="onUnitClick(unitNode)" />
      }
    </div>
    @if (data.regionSelection || data.unitSelection) {
      @if (canConfirm() !== true) {
        <p>
          {{ canConfirm() }}
        </p>
      }
      <button
        class="confirm-button"
        [disabled]="canConfirm() !== true"
        [class]="{ disabled: canConfirm() !== true }"
        (click)="onConfirm()">
        {{ data.regionSelection ? "Select region" : "Confirm units" }}
      </button>
    }
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;

      :host {
        background-color: #151515;
        color: white;
        display: flex;
        flex-direction: column;
        @include wotr.golden-padding(1vmin);
      }

      .confirm-button {
        @include wotr.button;
      }

      .unit-selection-active .unit {
        opacity: 0.5;
        cursor: not-allowed;
        &.selected {
          border: 2px solid white;
        }
        &.removing {
          border: 2px solid red;
        }
        &.downgrading {
          border: 2px solid orange;
        }
        &.selectable {
          opacity: 1;
          cursor: pointer;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrRegionDialog implements OnInit {
  protected data = inject<WotrRegionDialogData>(MAT_DIALOG_DATA);
  private assets = inject(WotrAssetsStore);
  private dialogRef: WotrRegionDialogRef = inject(MatDialogRef);
  private characterStore = inject(WotrCharacterStore);

  protected unitNodes!: UnitNode[];
  private selectedNodes = signal<UnitNode[]>([]);

  private unitSelectionMode = this.data.unitSelection
    ? selectionModeFactory(this.data.unitSelection, this.characterStore)
    : null;

  private casualtiesMode = this.data.unitSelection?.type === "chooseCasualties";

  protected canConfirm = computed(() => {
    if (this.data.regionSelection) return true;
    if (this.unitSelectionMode)
      return this.unitSelectionMode.canConfirm(this.selectedNodes(), this.data.region);
    return false;
  });

  ngOnInit() {
    const region = this.data.region;
    this.unitNodes = this.unitsToUnitNodes(region.army, "army");
    this.unitNodes = this.unitNodes.concat(
      this.unitsToUnitNodes(region.underSiegeArmy, "underSiege")
    );
    this.unitNodes = this.unitNodes.concat(this.unitsToUnitNodes(region.freeUnits, "freeUnits"));
    if (this.data.region.fellowship) {
      const image = this.assets.fellowshipImage(this.data.fellowship.status === "revealed");
      this.unitNodes.push({
        id: "fellowship",
        type: "fellowship",
        group: "fellowship",
        nationId: null,
        label: "Fellowship",
        ...this.scale(image)
      });
    }
    if (this.unitSelectionMode) {
      this.unitSelectionMode.initialize(this.unitNodes, this.data.region);
      for (const unitNode of this.unitNodes) {
        if (unitNode.selected) {
          this.selectedNodes.update(nodes => [...nodes, unitNode]);
        }
      }
    }
  }

  private unitsToUnitNodes(
    units: WotrUnits | undefined,
    group: "army" | "underSiege" | "freeUnits"
  ): UnitNode[] {
    if (!units) return [];
    const d = this.data;
    const unitNodes: UnitNode[] = [];
    units.regulars?.forEach(armyUnit => {
      const image = this.assets.armyUnitImage("regular", armyUnit.nation);
      for (let i = 0; i < armyUnit.quantity; i++) {
        unitNodes.push({
          id: armyUnit.nation + "_regular_" + i,
          type: "regular",
          group,
          nationId: armyUnit.nation,
          label: d.nationById[armyUnit.nation].regularLabel,
          ...this.scale(image)
        });
      }
    });
    units.elites?.forEach(armyUnit => {
      const image = this.assets.armyUnitImage("elite", armyUnit.nation);
      for (let i = 0; i < armyUnit.quantity; i++) {
        unitNodes.push({
          id: armyUnit.nation + "_elite_" + i,
          type: "elite",
          group,
          nationId: armyUnit.nation,
          label: d.nationById[armyUnit.nation].eliteLabel,
          ...this.scale(image)
        });
      }
    });
    units.leaders?.forEach(leader => {
      const image = this.assets.leaderImage(leader.nation);
      for (let i = 0; i < leader.quantity; i++) {
        unitNodes.push({
          id: leader.nation + "_leader_" + i,
          type: "leader",
          group,
          nationId: leader.nation,
          label: d.nationById[leader.nation].leaderLabel!,
          ...this.scale(image)
        });
      }
    });
    if (units.nNazgul) {
      const image = this.assets.nazgulImage();
      for (let i = 0; i < units.nNazgul; i++) {
        unitNodes.push({
          id: "nazgul_" + i,
          type: "nazgul",
          group,
          nationId: "sauron",
          label: "Nazgul",
          ...this.scale(image)
        });
      }
    }
    units.characters?.forEach(character => {
      const image = this.assets.characterImage(character);
      unitNodes.push({
        id: character,
        type: "character",
        group,
        nationId: null,
        label: d.characterById[character].name,
        ...this.scale(image)
      });
    });
    return unitNodes;
  }

  private scale(image: WotrUnitImage): WotrUnitImage {
    return { source: image.source, width: image.width * 1.5, height: image.height * 1.5 };
  }

  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range(n);

  onConfirm() {
    if (!this.canConfirm()) return;
    if (this.data.unitSelection) {
      if (this.casualtiesMode) {
        const downgradedUnits: WotrUnits = {};
        const removedUnits: WotrUnits = {};
        for (const unitNode of this.unitNodes) {
          if (unitNode.downgrading) {
            this.addNodeToUnits(unitNode, downgradedUnits);
          }
          if (unitNode.removing) {
            this.addNodeToUnits(unitNode, removedUnits);
          }
        }
        this.dialogRef.close({ removing: removedUnits, downgrading: downgradedUnits });
      } else {
        const selectedUnits: WotrUnits = {};
        for (const unitNode of this.unitNodes) {
          if (unitNode.selected) {
            this.addNodeToUnits(unitNode, selectedUnits);
          }
        }
        this.dialogRef.close(selectedUnits);
      }
    } else if (this.data.regionSelection) {
      this.dialogRef.close(true);
    }
  }

  private addNodeToUnits(unitNode: UnitNode, units: WotrUnits) {
    switch (unitNode.type) {
      case "regular": {
        if (!units.regulars) units.regulars = [];
        const regular = units.regulars.find(u => u.nation === unitNode.nationId);
        if (regular) {
          regular.quantity++;
        } else {
          units.regulars.push({
            nation: unitNode.nationId!,
            quantity: 1
          });
        }
        break;
      }
      case "elite": {
        if (!units.elites) units.elites = [];
        const elite = units.elites.find(u => u.nation === unitNode.nationId);
        if (elite) {
          elite.quantity++;
        } else {
          units.elites.push({
            nation: unitNode.nationId!,
            quantity: 1
          });
        }
        break;
      }
      case "leader": {
        if (!units.leaders) units.leaders = [];
        const leader = units.leaders.find(u => u.nation === unitNode.nationId);
        if (leader) {
          leader.quantity++;
        } else {
          units.leaders.push({
            nation: unitNode.nationId!,
            quantity: 1
          });
        }
        break;
      }
      case "nazgul": {
        if (!units.nNazgul) units.nNazgul = 0;
        units.nNazgul++;
        break;
      }
      case "character": {
        if (!units.characters) units.characters = [];
        units.characters.push(unitNode.id as WotrCharacterId);
        break;
      }
    }
  }

  onUnitClick(unitNode: UnitNode) {
    if (!unitNode.selectable) return;
    if (this.casualtiesMode) {
      if (unitNode.removing) {
        unitNode.removing = false;
        this.selectedNodes.update(nodes => nodes.filter(n => n.id !== unitNode.id));
      } else if (unitNode.downgrading) {
        unitNode.downgrading = false;
        unitNode.removing = true;
        this.selectedNodes.update(nodes => [...nodes]);
      } else {
        if (unitNode.type === "regular") {
          unitNode.removing = true;
        } else if (unitNode.type === "elite") {
          unitNode.downgrading = true;
        }
        this.selectedNodes.update(nodes => [...nodes, unitNode]);
      }
    } else {
      if (unitNode.selected) {
        unitNode.selected = false;
        this.selectedNodes.update(nodes => nodes.filter(n => n.id !== unitNode.id));
      } else {
        unitNode.selected = true;
        this.selectedNodes.update(nodes => [...nodes, unitNode]);
      }
    }
  }
}
