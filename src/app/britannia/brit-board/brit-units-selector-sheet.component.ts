import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { BritAssetsService } from "../brit-assets.service";
import { BritUnitId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";

export interface BritUnitsSelectorSheetInput {
  unitId: BritUnitId;
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
    private assetsService: BritAssetsService,
    private components: BritComponentsService
  ) { }

  imageSource!: string;
  quantity!: number;

  ngOnInit () {
    this.quantity = this.data.quantity;
    const unit = this.components.getUnit (this.data.unitId);
    this.imageSource = this.assetsService.getUnitImageSourceByType (unit.type, unit.nationId)
  } // ngOnInit

  onCloseClick () {
    this.bottomSheetRef.dismiss ();
  } // onCloseClick

  onConfirm () {
    this.bottomSheetRef.dismiss (this.quantity);
  } // onConfirm

} // BritUnitsSelectorSheetComponent
