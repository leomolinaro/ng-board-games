import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { BritAssetsService } from "../brit-assets.service";
import { BritNation, BritNationId } from "../brit-models";

@Component({
  selector: 'brit-nation-card-sheet',
  template: `
    <img [src]="nationCardImageSource">
    <button mat-icon-button (click)="onCloseClick ()">
      <mat-icon>close</mat-icon>
    </button>
  `,
  styles: [`
    :host {
      display: contents;
      img {
        max-width: 500px;
        min-width: 30vw;
        height: auto;
      }
      button {
        position: absolute;
        right: 5px;
        top: 5px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritNationCardSheetComponent implements OnInit {

  constructor (
    private bottomSheetRef: MatBottomSheetRef<BritNationCardSheetComponent, BritNation>,
    @Inject (MAT_BOTTOM_SHEET_DATA) public data: BritNation,
    private assetsService: BritAssetsService,
    private cd: ChangeDetectorRef
  ) { }

  nationCardImageSource!: string;

  ngOnInit() {
    this.refresh (this.data.id);
  } // ngOnInit

  setNation (nationId: BritNationId) {
    this.refresh (nationId);
    this.cd.markForCheck ();
  } // setNation

  private refresh (nationId: BritNationId) {
    this.nationCardImageSource = this.assetsService.getNationCardImageSource (nationId);
  } // refresh

  onCloseClick () {
    this.bottomSheetRef.dismiss ();
  } // onCloseClick

} // BritNationCardSheetComponent
