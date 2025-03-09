import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from "@angular/material/bottom-sheet";
import { BritAssetsService } from "../brit-assets.service";
import { BritAreaUnit } from "../brit-game-state.models";
import { BritUnitsSelectorComponent } from "../brit-units-selector/brit-units-selector.component";

export interface BritUnitsSelectorSheetInput {
  unit: BritAreaUnit;
  quantity: number;
  maxQuantity: number;
} // BritUnitsSelectorSheetInput

@Component ({
  selector: "brit-unit-number-selection-sheet",
  template: `
    <brit-units-selector
      [imageSource]="imageSource"
      [(number)]="quantity"
      [max]="data.maxQuantity"
      min="0"
      (confirm)="onConfirm()"
    >
    </brit-units-selector>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BritUnitsSelectorComponent]
})
export class BritUnitsSelectorSheetComponent implements OnInit {
  
  private bottomSheetRef = inject<MatBottomSheetRef<BritUnitsSelectorSheetComponent, number>> (MatBottomSheetRef);
  data = inject<BritUnitsSelectorSheetInput> (MAT_BOTTOM_SHEET_DATA);
  private assetsService = inject (BritAssetsService);

  imageSource!: string;
  quantity!: number;

  ngOnInit () {
    this.quantity = this.data.quantity;
    this.imageSource = this.assetsService.getUnitImageSourceByType (
      this.data.unit.type,
      this.data.unit.nationId
    );
  } // ngOnInit

  onCloseClick () {
    this.bottomSheetRef.dismiss ();
  } // onCloseClick

  onConfirm () {
    this.bottomSheetRef.dismiss (this.quantity);
  } // onConfirm
} // BritUnitsSelectorSheetComponent
