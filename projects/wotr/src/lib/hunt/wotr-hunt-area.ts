import { ChangeDetectionStrategy, Component, computed, inject, input } from "@angular/core";
import { MatTabsModule } from "@angular/material/tabs";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrGameStore } from "../game/wotr-game-store";
import { WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntState } from "./wotr-hunt-store";
import { KomeCorruptionBoard } from "./kome/kome-corruption-board";

@Component({
  selector: "wotr-hunt-area",
  imports: [MatTabsModule, BgTransformPipe, KomeCorruptionBoard],
  template: `
    <mat-tab-group>
      @if (showPool()) {
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
      }
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
      @if (kome()) {
        <mat-tab label="Kings' Corruption">
          <kome-corruption-board></kome-corruption-board>
        </mat-tab>
      }
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
  private gameStore = inject(WotrGameStore);

  hunt = input.required<WotrHuntState>();

  protected kome = this.gameStore.kome;
  private visibleCorruptionTiles = this.gameStore.visibleCorruptionTiles;

  protected showPool = computed(() => !this.kome() || this.visibleCorruptionTiles());

  protected tileImage: BgTransformFn<WotrHuntTileId, string> = huntTile =>
    this.assets.huntTileImage(huntTile);
}
