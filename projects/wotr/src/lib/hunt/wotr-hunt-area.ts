import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntState } from "./wotr-hunt-store";

@Component({
  selector: "wotr-hunt-area",
  imports: [MatTabsModule, BgTransformPipe],
  template: `
    <mat-tab-group>
      <mat-tab label="Pool">
        <div class="tiles">
          @for (tile of hunt().huntPool; track $index) {
            <img
              class="tile-image"
              [src]="tile | bgTransform: tileImage" />
          }
          @for (tile of hunt().huntReady; track $index) {
            <img
              class="tile-image disabled"
              [src]="tile | bgTransform: tileImage" />
          }
        </div>
      </mat-tab>
      <mat-tab label="Drawn">
        <div class="tiles">
          @for (tile of hunt().huntDrawn; track $index) {
            <img
              class="tile-image"
              [src]="tile | bgTransform: tileImage" />
          }
        </div>
      </mat-tab>
      <mat-tab label="Removed">
        <div class="tiles">
          @for (tile of hunt().huntRemoved; track $index) {
            <img
              class="tile-image"
              [src]="tile | bgTransform: tileImage" />
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
      }
      .tiles {
        margin-top: 5px;
        .tile-image {
          &:not(:last-child) {
            margin-right: 5px;
          }
          &.disabled {
            opacity: 50%;
          }
        }
      }

      mat-tab-group {
        overflow: auto;
        ::ng-deep {
          .mat-mdc-tab-header {
            --mdc-secondary-navigation-tab-container-height: 25px;
          }
          .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
          }
          .mat-mdc-tab .mdc-tab-indicator__content--underline {
            display: none;
          }
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrHuntArea {
  protected assets = inject(WotrAssetsStore);

  hunt = input.required<WotrHuntState>();

  protected tileImage: BgTransformFn<WotrHuntTileId, string> = huntTile =>
    this.assets.huntTileImage(huntTile);
}
