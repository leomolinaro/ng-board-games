import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgTransformFn, BgTransformPipe, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../assets/wotr-assets.service";
import { WotrCharacter, WotrCharacterId } from "../character/wotr-character.models";
import { WotrFellowship } from "../fellowship/wotr-fellowhip.models";
import { WotrNation, WotrNationId } from "../nation/wotr-nation.models";
import { WotrUnits } from "../unit/wotr-unit.models";
import { WotrRegion } from "./wotr-region.models";

export interface WotrRegionDialogData {
  region: WotrRegion;
  nationById: Record<WotrNationId, WotrNation>;
  characterById: Record<WotrCharacterId, WotrCharacter>;
  fellowship: WotrFellowship;
  selectable: boolean;
}

interface UnitNode {
  id: string;
  source: string;
  label: string;
  width: number;
  height: number;
  quantity: number;
}

@Component ({
  selector: "wotr-region-dialog",
  imports: [BgTransformPipe, MatTooltipModule],
  template: `
    <h1>{{ data.region.name }}</h1>
    <div>
      @for (unitNode of unitNodes; track unitNode.id) {
        @for (i of (unitNode.quantity | bgTransform:range); track i) {
          <img [src]="unitNode.source"
            [width]="unitNode.width"
            [height]="unitNode.height"
            [matTooltip]="unitNode.label"/>
        }
      }
    </div>
    @if (data.selectable) {
      <button (click)="onSelect ()">Select</button>
    }
  `,
  styles: [`
    @use "wotr-variables" as wotr;

    :host {
      background-color: #151515;
      color: white;
      display: flex;
      flex-direction: column;
      @include wotr.golden-padding(1vmin);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrRegionDialogComponent implements OnInit {
  
  protected data = inject<WotrRegionDialogData> (MAT_DIALOG_DATA);
  private assets = inject (WotrAssetsService);
  private dialogRef = inject (MatDialogRef<WotrRegionDialogComponent, boolean | undefined>);

  protected unitNodes!: UnitNode[];

  ngOnInit () {
    const region = this.data.region;
    this.unitNodes = this.unitsToUnitNodes (region.army);
    this.unitNodes = this.unitNodes.concat (this.unitsToUnitNodes (region.underSiegeArmy));
    this.unitNodes = this.unitNodes.concat (this.unitsToUnitNodes (region.freeUnits));
    if (this.data.region.fellowship) {
      const image = this.assets.getFellowshipImage (this.data.fellowship.status === "revealed");
      this.unitNodes.push ({ id: "fellowship", label: "Fellowship", quantity: 1, ...this.scale (image) });
    }
  }

  private unitsToUnitNodes (units: WotrUnits | undefined): UnitNode[] {
    if (!units) { return []; }
    const d = this.data;
    const unitNodes: UnitNode[] = [];
    units.regulars?.forEach (armyUnit => {
      const image = this.assets.getArmyUnitImage ("regular", armyUnit.nation);
      unitNodes.push ({
        id: armyUnit.nation + "_regular",
        label: d.nationById[armyUnit.nation].regularLabel,
        quantity: armyUnit.quantity,
        ...this.scale (image)
      });
    });
    units.elites?.forEach (armyUnit => {
      const image = this.assets.getArmyUnitImage ("elite", armyUnit.nation);
      unitNodes.push ({
        id: armyUnit.nation + "_elite",
        label: d.nationById[armyUnit.nation].eliteLabel,
        quantity: armyUnit.quantity,
        ...this.scale (image)
      });
    });
    units.leaders?.forEach (leader => {
      const image = this.assets.getLeaderImage (leader.nation);
      unitNodes.push ({
        id: leader.nation + "_leader",
        label: d.nationById[leader.nation].leaderLabel!,
        quantity: leader.quantity,
        ...this.scale (image)
      });
    });
    if (units.nNazgul) {
      const image = this.assets.getNazgulImage ();
      unitNodes.push ({ id: "nazgul", label: "Nazgul", quantity: units.nNazgul, ...this.scale (image) });
    }
    units.characters?.forEach (character => {
      const image = this.assets.getCharacterImage (character);
      unitNodes.push ({ id: character, label: d.characterById[character].name, quantity: 1, ...this.scale (image) });
    });
    return unitNodes;
  }

  private scale (image: WotrUnitImage): WotrUnitImage {
    return { source: image.source, width: image.width * 1.5, height: image.height * 1.5 };
  }

  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range (n);

  onSelect () {
    this.dialogRef.close (true);
  }

}
