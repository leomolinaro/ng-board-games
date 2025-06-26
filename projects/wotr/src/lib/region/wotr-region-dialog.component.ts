import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, computed, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgTransformFn, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../assets/wotr-assets.service";
import { WotrCharacter, WotrCharacterId } from "../character/wotr-character.models";
import { WotrFellowship } from "../fellowship/wotr-fellowhip.models";
import { WotrRegionUnitSelection } from "../game/wotr-game-ui.store";
import { WotrArmyUnitType, WotrNation, WotrNationId } from "../nation/wotr-nation.models";
import { WotrUnits } from "../unit/wotr-unit.models";
import { WotrRegion } from "./wotr-region.models";

export interface WotrRegionDialogData {
  region: WotrRegion;
  nationById: Record<WotrNationId, WotrNation>;
  characterById: Record<WotrCharacterId, WotrCharacter>;
  fellowship: WotrFellowship;
  regionSelection: boolean;
  unitSelection: WotrRegionUnitSelection | null;
}

interface UnitNode {
  id: string;
  type: WotrArmyUnitType | null;
  nationId: WotrNationId | null;
  source: string;
  label: string;
  width: number;
  height: number;
  selected?: boolean;
  declassing?: boolean;
  removing?: boolean;
  selectable: boolean;
  disabled: boolean;
}

export type WotrRegionDialogResult =
  | true
  | WotrUnits
  | { removing: WotrUnits; declassing: WotrUnits };

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
            declassing: unitNode.declassing,
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
      <button
        [disabled]="!canConfirm()"
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

      .unit {
        &.selected {
          border: 2px solid white;
        }
        &.removing {
          border: 2px solid red;
        }
        &.declassing {
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
  protected nSelectedUnits = 0;

  protected canConfirm = computed(() => {
    if (this.data.unitSelection) {
      return true;
    }
    if (this.data.regionSelection) {
      return true;
    }
    return false;
  });

  ngOnInit() {
    const region = this.data.region;
    const unitSelection = this.data.unitSelection;
    this.unitNodes = this.unitsToUnitNodes(
      region.army,
      unitSelection ? (unitSelection.underSiege ? false : unitSelection) : null
    );
    this.unitNodes = this.unitNodes.concat(
      this.unitsToUnitNodes(
        region.underSiegeArmy,
        unitSelection ? (unitSelection.underSiege ? unitSelection : false) : null
      )
    );
    this.unitNodes = this.unitNodes.concat(
      this.unitsToUnitNodes(region.freeUnits, unitSelection ? false : null)
    );
    if (this.data.region.fellowship) {
      const image = this.assets.getFellowshipImage(this.data.fellowship.status === "revealed");
      this.unitNodes.push({
        id: "fellowship",
        type: null,
        nationId: null,
        label: "Fellowship",
        selectable: false,
        disabled: false,
        ...this.scale(image)
      });
    }
  }

  private unitsToUnitNodes(
    units: WotrUnits | undefined,
    unitSelection: WotrRegionUnitSelection | false | null
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
          nationId: armyUnit.nation,
          label: d.nationById[armyUnit.nation].regularLabel,
          selectable: !!unitSelection,
          disabled: unitSelection === false,
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
          nationId: armyUnit.nation,
          label: d.nationById[armyUnit.nation].eliteLabel,
          selectable: !!unitSelection,
          disabled: unitSelection === false,
          ...this.scale(image)
        });
      }
    });
    units.leaders?.forEach(leader => {
      const image = this.assets.getLeaderImage(leader.nation);
      for (let i = 0; i < leader.quantity; i++) {
        unitNodes.push({
          id: leader.nation + "_leader_" + i,
          type: null,
          nationId: leader.nation,
          label: d.nationById[leader.nation].leaderLabel!,
          selectable: !!unitSelection,
          disabled: unitSelection === false,
          ...this.scale(image)
        });
      }
    });
    if (units.nNazgul) {
      const image = this.assets.getNazgulImage();
      for (let i = 0; i < units.nNazgul; i++) {
        unitNodes.push({
          id: "nazgul_" + i,
          type: null,
          nationId: "sauron",
          label: "Nazgul",
          selectable: !!unitSelection,
          disabled: unitSelection === false,
          ...this.scale(image)
        });
      }
    }
    units.characters?.forEach(character => {
      const image = this.assets.getCharacterImage(character);
      unitNodes.push({
        id: character,
        type: null,
        nationId: null,
        label: d.characterById[character].name,
        selectable: false,
        disabled: false,
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
      this.unitNodes.forEach(unitNode => {
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
            case "elite":
              {
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
              }
              break;
          }
        }
      });
      this.dialogRef.close(selectedUnits);
    } else if (this.data.regionSelection) {
      this.dialogRef.close(true);
    }
  }

  onUnitClick(unitNode: UnitNode) {
    if (unitNode.disabled || !unitNode.selectable) return;
    if (unitNode.selected) {
      this.nSelectedUnits--;
      unitNode.selected = false;
    } else {
      this.nSelectedUnits++;
      unitNode.selected = true;
    }
  }
}
