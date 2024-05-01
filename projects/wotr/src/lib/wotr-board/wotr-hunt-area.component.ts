import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltip } from "@angular/material/tooltip";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsService } from "../wotr-assets.service";
import { WotrHuntTile } from "../wotr-elements/wotr-hunt.models";
import { WotrHuntState } from "../wotr-elements/wotr-hunt.store";
import { WotrLogsComponent } from "./wotr-logs.component";
import { WotrMapComponent } from "./wotr-map/wotr-map.component";

@Component ({
  selector: "wotr-hunt-area",
  standalone: true,
  imports: [NgIf, WotrMapComponent, MatTabsModule, WotrLogsComponent, BgTransformPipe, MatTooltip],
  template: `
    <mat-tab-group>
      <mat-tab label="Pool">
        <div class="tiles">
          @for (tile of hunt ().huntPool; track tile) {
            <img class="tile-image" [src]="tile | bgTransform:tileImage"/>
          }
          @for (tile of hunt ().huntReady; track tile) {
            <img class="tile-image disabled" [src]="tile | bgTransform:tileImage"/>
          }
        </div>
      </mat-tab>
      <mat-tab label="Drawn">
        <div class="tiles">
          @for (tile of hunt ().huntDrawn; track tile) {
            <img class="tile-image" [src]="tile | bgTransform:tileImage"/>
          }
        </div>
      </mat-tab>
      <mat-tab label="Removed">
        <div class="tiles">
          @for (tile of hunt ().huntRemoved; track tile) {
            <img class="tile-image" [src]="tile | bgTransform:tileImage"/>
          }
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }
    .tiles {
      margin-top: 5px;
      .tile-image {
        // cursor: pointer;
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
          // color: var(--wotr-front-color);
        }
        .mat-mdc-tab .mdc-tab-indicator__content--underline {
          display: none
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrHuntAreaComponent {

  protected assets = inject (WotrAssetsService);

  hunt = input.required<WotrHuntState> ();

  protected tileImage: BgTransformFn<WotrHuntTile, string> = huntTile => this.assets.getHuntTileImage (huntTile);

}
