import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgTransformFn, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../assets/wotr-assets.service";
import { WotrCharacter, WotrCharacterId } from "../character/wotr-character.models";
import { WotrFellowship } from "../fellowship/wotr-fellowhip.models";
import { WotrValidRegionUnits } from "../game/wotr-game-ui.store";
import { WotrArmyUnitType, WotrNation, WotrNationId } from "../nation/wotr-nation.models";
import { WotrUnits } from "../unit/wotr-unit.models";
import { WotrRegion } from "./wotr-region.models";

export interface WotrRegionDialogData {
  region: WotrRegion;
  nationById: Record<WotrNationId, WotrNation>;
  characterById: Record<WotrCharacterId, WotrCharacter>;
  fellowship: WotrFellowship;
  selectable: boolean;
  selectableUnits: WotrValidRegionUnits | null;
}

interface UnitNode {
  id: string;
  type: WotrArmyUnitType | null;
  nationId: WotrNationId | null;
  source: string;
  label: string;
  width: number;
  height: number;
  selected: boolean;
  selectable: boolean;
  disabled: boolean;
}

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
            selected: unitNode.selected
          }"
          [src]="unitNode.source"
          [width]="unitNode.width"
          [height]="unitNode.height"
          [matTooltip]="unitNode.label"
          (click)="onUnitClick(unitNode)" />
      }
    </div>
    @if (data.selectable || data.selectableUnits) {
      <button
        [disabled]="data.selectableUnits && nSelectedUnits !== data.selectableUnits.nArmyUnits"
        (click)="onSelect()">
        Select
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
  private dialogRef = inject(MatDialogRef<WotrRegionDialogComponent, true | WotrUnits | undefined>);

  protected unitNodes!: UnitNode[];
  protected nSelectedUnits = 0;

  ngOnInit() {
    const region = this.data.region;
    const selectableUnits = this.data.selectableUnits;
    this.unitNodes = this.unitsToUnitNodes(
      region.army,
      selectableUnits ? (selectableUnits.underSiege ? 0 : selectableUnits.nArmyUnits) : 0
    );
    this.unitNodes = this.unitNodes.concat(
      this.unitsToUnitNodes(
        region.underSiegeArmy,
        selectableUnits?.underSiege ? selectableUnits.nArmyUnits : 0
      )
    );
    this.unitNodes = this.unitNodes.concat(this.unitsToUnitNodes(region.freeUnits, 0));
    if (this.data.region.fellowship) {
      const image = this.assets.getFellowshipImage(this.data.fellowship.status === "revealed");
      this.unitNodes.push({
        id: "fellowship",
        type: null,
        nationId: null,
        label: "Fellowship",
        selectable: false,
        disabled: false,
        selected: false,
        ...this.scale(image)
      });
    }
  }

  private unitsToUnitNodes(units: WotrUnits | undefined, nSelectableArmyUnits: number): UnitNode[] {
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
          selectable: nSelectableArmyUnits > 0,
          disabled: false,
          selected: false,
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
          selectable: nSelectableArmyUnits > 0,
          disabled: false,
          selected: false,
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
          selectable: false,
          disabled: false,
          selected: false,
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
          selectable: false,
          disabled: false,
          selected: false,
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
        selected: false,
        ...this.scale(image)
      });
    });
    return unitNodes;
  }

  private scale(image: WotrUnitImage): WotrUnitImage {
    return { source: image.source, width: image.width * 1.5, height: image.height * 1.5 };
  }

  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range(n);

  onSelect() {
    if (this.data.selectableUnits) {
      if (this.data.selectableUnits.nArmyUnits === this.nSelectedUnits) {
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
      }
    } else if (this.data.selectable) {
      this.dialogRef.close(true);
    } else {
      this.dialogRef.close(undefined);
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
