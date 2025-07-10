import { NgClass } from "@angular/common";
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
import { WotrAssetsService, WotrUnitImage } from "../../assets/wotr-assets.service";
import { WotrCharacter, WotrCharacterId } from "../../character/wotr-character.models";
import { WotrFellowship } from "../../fellowship/wotr-fellowhip.models";
import { WotrNation, WotrNationId } from "../../nation/wotr-nation.models";
import { WotrUnits } from "../../unit/wotr-unit.models";
import { WotrRegion } from "../wotr-region.models";
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

export type WotrRegionDialogRef = MatDialogRef<WotrRegionDialogComponent, WotrRegionDialogResult>;

@Component({
  selector: "wotr-region-dialog",
  imports: [MatTooltipModule, NgClass],
  template: `
    <h1>{{ data.region.name }}</h1>
    <div>
      @for (unitNode of unitNodes; track unitNode.id) {
        <img
          class="unit"
          [ngClass]="{
            disabled: unitNode.disabled,
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
        [ngClass]="{ disabled: canConfirm() !== true }"
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

      .unit {
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
          cursor: pointer;
        }
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrRegionDialogComponent implements OnInit {
  protected data = inject<WotrRegionDialogData>(MAT_DIALOG_DATA);
  private assets = inject(WotrAssetsService);
  private dialogRef: WotrRegionDialogRef = inject(MatDialogRef);

  protected unitNodes!: UnitNode[];
  private selectedNodes = signal<UnitNode[]>([]);

  protected canConfirm = computed(() => {
    if (this.data.regionSelection) return true;
    if (this.unitSelectionMode) return this.unitSelectionMode.canConfirm(this.selectedNodes());
    return false;
  });

  private unitSelectionMode = this.data.unitSelection
    ? selectionModeFactory(this.data.unitSelection)
    : null;

  ngOnInit() {
    const region = this.data.region;
    this.unitNodes = this.unitsToUnitNodes(region.army, "army");
    this.unitNodes = this.unitNodes.concat(
      this.unitsToUnitNodes(region.underSiegeArmy, "underSiege")
    );
    this.unitNodes = this.unitNodes.concat(this.unitsToUnitNodes(region.freeUnits, "freeUnits"));
    if (this.data.region.fellowship) {
      const image = this.assets.getFellowshipImage(this.data.fellowship.status === "revealed");
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
      this.unitSelectionMode.initialize(this.unitNodes);
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
      const image = this.assets.getArmyUnitImage("regular", armyUnit.nation);
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
      const image = this.assets.getArmyUnitImage("elite", armyUnit.nation);
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
      const image = this.assets.getLeaderImage(leader.nation);
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
      const image = this.assets.getNazgulImage();
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
      const image = this.assets.getCharacterImage(character);
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
      const selectedUnits: WotrUnits = {};
      for (const unitNode of this.unitNodes) {
        if (unitNode.selected) {
          switch (unitNode.type) {
            case "regular": {
              if (!selectedUnits.regulars) selectedUnits.regulars = [];
              const regular = selectedUnits.regulars.find(u => u.nation === unitNode.nationId);
              if (regular) {
                regular.quantity++;
              } else {
                selectedUnits.regulars.push({
                  nation: unitNode.nationId!,
                  quantity: 1
                });
              }
              break;
            }
            case "elite": {
              if (!selectedUnits.elites) selectedUnits.elites = [];
              const elite = selectedUnits.elites.find(u => u.nation === unitNode.nationId);
              if (elite) {
                elite.quantity++;
              } else {
                selectedUnits.elites.push({
                  nation: unitNode.nationId!,
                  quantity: 1
                });
              }
              break;
            }
            case "leader": {
              if (!selectedUnits.leaders) selectedUnits.leaders = [];
              const leader = selectedUnits.leaders.find(u => u.nation === unitNode.nationId);
              if (leader) {
                leader.quantity++;
              } else {
                selectedUnits.leaders.push({
                  nation: unitNode.nationId!,
                  quantity: 1
                });
              }
              break;
            }
            case "nazgul": {
              if (!selectedUnits.nNazgul) selectedUnits.nNazgul = 0;
              selectedUnits.nNazgul++;
              break;
            }
            case "character": {
              if (!selectedUnits.characters) selectedUnits.characters = [];
              selectedUnits.characters.push(unitNode.id as WotrCharacterId);
              break;
            }
          }
        }
      }
      this.dialogRef.close(selectedUnits);
    } else if (this.data.regionSelection) {
      this.dialogRef.close(true);
    }
  }

  onUnitClick(unitNode: UnitNode) {
    if (unitNode.disabled || !unitNode.selectable) return;
    if (unitNode.selected) {
      unitNode.selected = false;
      this.selectedNodes.update(nodes => nodes.filter(n => n.id !== unitNode.id));
    } else {
      unitNode.selected = true;
      this.selectedNodes.update(nodes => [...nodes, unitNode]);
    }
  }
}
