import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { BritAssetsService } from "../brit-assets.service";
import { BritAreaUnit } from "../brit-game-state.models";

export interface BritUnitsSelectorSheetInput {
  unit: BritAreaUnit;
  quantity: number;
  maxQuantity: number;
} // BritUnitsSelectorSheetInput

@Component ({
  selector: 'brit-unit-number-selection-sheet',
  template: `
    <brit-units-selector
      [imageSource]="imageSource"
      [(number)]="quantity"
      [max]="data.maxQuantity"
      min=0
      (confirm)="onConfirm ()">
    </brit-units-selector>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritUnitsSelectorSheetComponent implements OnInit {

  constructor (
    private bottomSheetRef: MatBottomSheetRef<BritUnitsSelectorSheetComponent, number>,
    @Inject (MAT_BOTTOM_SHEET_DATA) public data: BritUnitsSelectorSheetInput,
    private assetsService: BritAssetsService
  ) { }

  imageSource!: string;
  quantity!: number;

  ngOnInit () {
    this.quantity = this.data.quantity;
    this.imageSource = this.assetsService.getUnitImageSourceByType (this.data.unit.type, this.data.unit.nationId)
  } // ngOnInit

  onCloseClick () {
    this.bottomSheetRef.dismiss ();
  } // onCloseClick

  onConfirm () {
    this.bottomSheetRef.dismiss (this.quantity);
  } // onConfirm

} // BritUnitsSelectorSheetComponent
