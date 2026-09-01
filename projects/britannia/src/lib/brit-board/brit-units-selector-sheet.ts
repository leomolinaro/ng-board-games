import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import type { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { BritAssetsService } from '../brit-assets.service';
import type { BritAreaUnit } from '../brit-game-state.models';
import { BritUnitsSelector } from '../brit-units-selector/brit-units-selector';

export interface BritUnitsSelectorSheetInput {
  unit: BritAreaUnit;
  quantity: number;
  maxQuantity: number;
}

@Component({
  selector: 'brit-unit-number-selection-sheet',
  imports: [BritUnitsSelector],
  template: `
    <brit-units-selector
      [imageSource]="imageSource"
      [(number)]="quantity"
      [max]="data.maxQuantity"
      [min]="0"
      (confirm)="onConfirm()"
    >
    </brit-units-selector>
  `,
  styles: [],
})
export class BritUnitsSelectorSheet implements OnInit {
  private readonly context =
    injectContext<
      TuiDialogContext<number | undefined, BritUnitsSelectorSheetInput>
    >();
  data = this.context.data;
  private assetsService = inject(BritAssetsService);

  imageSource!: string;
  quantity!: number;

  ngOnInit() {
    this.quantity = this.data.quantity;
    this.imageSource = this.assetsService.getUnitImageSourceByType(
      this.data.unit.type,
      this.data.unit.nationId,
    );
  }

  onCloseClick() {
    this.context.completeWith(undefined);
  }

  onConfirm() {
    this.context.completeWith(this.quantity);
  }
}
