import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BgTransformFn, BgTransformPipe, arrayUtil } from "@leobg/commons/utils";
import { WotrAssetsService, WotrUnitImage } from "../wotr-assets.service";
import { WotrCompanion, WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrMinion, WotrMinionId } from "../wotr-elements/wotr-minion.models";
import { WotrNation, WotrNationId } from "../wotr-elements/wotr-nation.models";
import { WotrRegion } from "../wotr-elements/wotr-region.models";

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
    d.region.armyUnits.forEach (armyUnit => {
      const image = this.assets.getArmyUnitImage (armyUnit.type, armyUnit.nationId);
      this.unitNodes.push ({
        id: armyUnit.nationId + "_" + armyUnit.type,
        label: armyUnit.type === "regular"
          ? d.nationById[armyUnit.nationId].regularLabel
          : d.nationById[armyUnit.nationId].eliteLabel,
        quantity: armyUnit.quantity,
        ...this.scale (image)
      });
    });
    d.region.leaders.forEach (leader => {
      const image = this.assets.getLeaderImage (leader.nationId);
      this.unitNodes.push ({
        id: leader.nationId + "_leader",
        label: d.nationById[leader.nationId].leaderLabel!,
        quantity: leader.quantity,
        ...this.scale (image)
      });
    });
    if (d.region.nNazgul) {
      const image = this.assets.getNazgulImage ();
      this.unitNodes.push ({ id: "nazgul", label: "Nazgul", quantity: d.region.nNazgul, ...this.scale (image) });
    }
    d.region.companions.forEach (companion => {
      const image = this.assets.getCompanionImage (companion);
      this.unitNodes.push ({ id: companion, label: d.companionById[companion].name, quantity: 1, ...this.scale (image) });
    });
    d.region.minions.forEach (minion => {
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
