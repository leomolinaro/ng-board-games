import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { BritAssetsService } from "../brit-assets.service";
import { BritNation, BritNationId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritNationState } from "../brit-game-state.models";

interface BritUnitNode {
  imageSource: string;
  available: number;
  total: number;
} // BritUnitNode

@Component({
  selector: 'brit-nation-card-sheet',
  template: `
    <img class="brit-nation-card" [src]="nationCardImageSource">
    <button mat-icon-button class="brit-nation-card-close-button" (click)="onCloseClick ()">
      <mat-icon>close</mat-icon>
    </button>
    <div class="brit-nation-units">
      <div *ngFor="let unitNode of unitNodes" class="brit-nation-unit">
        <img class="brit-nation-unit-image" [src]="unitNode.imageSource">
        <span class="brit-nation-unit-quantity">{{unitNode.available}} / {{unitNode.total}}</span>
      </div>
    </div>
  `,
  styles: [`
    @import "bg-variables";
    :host {
      display: flex;
      flex-direction: column;  
      .brit-nation-card {
        max-width: 500px;
        min-width: 30vw;
        height: auto;
      }
      .brit-nation-card-close-button {
        position: absolute;
        right: 5px;
        top: 5px;
      }
      .brit-nation-units {
        @include golden-padding(10px);
        display: flex;
        justify-content: space-evenly;
        height: 75px;
        overflow: hidden;
        .brit-nation-unit {
          position: relative;
          .brit-nation-unit-image {
            height: 100%;
          }
          .brit-nation-unit-quantity {
            position: absolute;
            bottom: 0;
            right: 0;
          }
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritNationCardSheetComponent implements OnInit {

  constructor (
    private bottomSheetRef: MatBottomSheetRef<BritNationCardSheetComponent, BritNation>,
    @Inject (MAT_BOTTOM_SHEET_DATA) public data: [BritNationId, BritNationState],
    private assetsService: BritAssetsService,
    private components: BritComponentsService,
    private cd: ChangeDetectorRef,
  ) { }

  nationCardImageSource!: string;
  unitNodes!: BritUnitNode[];

  ngOnInit() {
    this.refresh (this.data[0], this.data[1]);
  } // ngOnInit

  setNation (nationId: BritNationId, nationState: BritNationState) {
    this.refresh (nationId, nationState);
    this.cd.markForCheck ();
  } // setNation

  private refresh (nationId: BritNationId, nationState: BritNationState) {
    const nation = this.components.NATION[nationId];
    this.nationCardImageSource = this.assetsService.getNationCardImageSource (nation.id);
    this.unitNodes = [];
    if (nation.infantryIds.length) {
      this.unitNodes.push ({
        imageSource: this.assetsService.getUnitImageSourceByType ("infantry", nation.id),
        total: nation.infantryIds.length,
        available: nationState.infantryIds.length
      });
    } // if
    if (nation.cavalryIds.length) {
      this.unitNodes.push ({
        imageSource: this.assetsService.getUnitImageSourceByType ("cavalry", nation.id),
        total: nation.cavalryIds.length,
        available: nationState.cavalryIds.length
      });
    } // if
    if (nation.buildingIds.length) {
      this.unitNodes.push ({
        imageSource: this.assetsService.getUnitImageSourceByType (nation.id === "romans" ? "roman-fort" : "saxon-buhr", nation.id),
        total: nation.buildingIds.length,
        available: nationState.buildingIds.length
      });
    } // if
    for (const leader of nation.leaderIds) {
      this.unitNodes.push ({
        imageSource: this.assetsService.getUnitImageSourceByType ("leader", nation.id, leader),
        total: 1,
        available: 1
      });
    } // if
  } // refresh

  onCloseClick () {
    this.bottomSheetRef.dismiss ();
  } // onCloseClick

} // BritNationCardSheetComponent
