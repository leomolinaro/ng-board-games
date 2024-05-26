import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgTransformFn, BgTransformPipe, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../assets/wotr-assets.service";
import { WotrCompanion, WotrCompanionId } from "../companion/wotr-companion.models";
import { WotrMinion, WotrMinionId } from "../minion/wotr-minion.models";
import { WotrNation, WotrNationId } from "../nation/wotr-nation.models";
import { WotrRegion } from "./wotr-region.models";

export interface WotrRegionDialogData {
  region: WotrRegion;
  nationById: Record<WotrNationId, WotrNation>;
  companionById: Record<WotrCompanionId, WotrCompanion>;
  minionById: Record<WotrMinionId, WotrMinion>;
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
  standalone: true,
  imports: [BgTransformPipe, NgClass, MatTooltipModule],
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
  `,
  styles: [`
    @import "wotr-variables";

    :host {
      background-color: #151515;
      color: white;
      display: flex;
      flex-direction: column;
      @include golden-padding(1vmin);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrRegionDialogComponent implements OnInit {
  
  protected data = inject<WotrRegionDialogData> (MAT_DIALOG_DATA);
  private assets = inject (WotrAssetsService);

  protected unitNodes: UnitNode[] = [];

  ngOnInit () {
    const d = this.data;
    const units = d.region.units;
    units.armyUnits?.forEach (armyUnit => {
      const image = this.assets.getArmyUnitImage (armyUnit.type, armyUnit.nation);
      this.unitNodes.push ({
        id: armyUnit.nation + "_" + armyUnit.type,
        label: armyUnit.type === "regular"
          ? d.nationById[armyUnit.nation].regularLabel
          : d.nationById[armyUnit.nation].eliteLabel,
        quantity: armyUnit.quantity,
        ...this.scale (image)
      });
    });
    units.leaders?.forEach (leader => {
      const image = this.assets.getLeaderImage (leader.nation);
      this.unitNodes.push ({
        id: leader.nation + "_leader",
        label: d.nationById[leader.nation].leaderLabel!,
        quantity: leader.quantity,
        ...this.scale (image)
      });
    });
    if (units.nNazgul) {
      const image = this.assets.getNazgulImage ();
      this.unitNodes.push ({ id: "nazgul", label: "Nazgul", quantity: units.nNazgul, ...this.scale (image) });
    }
    units.companions?.forEach (companion => {
      const image = this.assets.getCompanionImage (companion);
      this.unitNodes.push ({ id: companion, label: d.companionById[companion].name, quantity: 1, ...this.scale (image) });
    });
    units.minions?.forEach (minion => {
      const image = this.assets.getMinionImage (minion);
      this.unitNodes.push ({ id: minion, label: d.minionById[minion].name, quantity: 1, ...this.scale (image) });
    });
    if (d.region.fellowship) {
      const image = this.assets.getFellowshipImage ();
      this.unitNodes.push ({ id: "fellowship", label: "Fellowship", quantity: 1, ...this.scale (image) });
    }
  }

  private scale (image: WotrUnitImage): WotrUnitImage {
    return { source: image.source, width: image.width * 1.5, height: image.height * 1.5 };
  }

  protected range: BgTransformFn<number, number[]> = n => arrayUtil.range (n);

}
