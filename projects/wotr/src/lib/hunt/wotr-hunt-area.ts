import { Component, computed, inject, input, linkedSignal } from "@angular/core";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { TuiButton, tuiButtonOptionsProvider } from "@taiga-ui/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrGameStore } from "../game/wotr-game-store";
import { KomeCorruptionBoard } from "./kome-corruption-board";
import { WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntState } from "./wotr-hunt-store";

export type HuntTabId = "pool" | "drawn" | "removed" | "kings-corruption";

@Component({
  selector: "wotr-hunt-area",
  imports: [BgTransformPipe, KomeCorruptionBoard, TuiButton],
  providers: [tuiButtonOptionsProvider({ appearance: "flat", size: "xs" })],
  template: `
    <header>
      @if (showPool()) {
        <button
          tuiButton
          [class.is-active]="activeTabId() === 'pool'"
          (click)="activeTabId.set('pool')">
          Pool
        </button>
      }
      <button
        tuiButton
        [class.is-active]="activeTabId() === 'drawn'"
        (click)="activeTabId.set('drawn')">
        Drawn
      </button>
      <button
        tuiButton
        [class.is-active]="activeTabId() === 'removed'"
        (click)="activeTabId.set('removed')">
        Removed
      </button>
      @if (kome()) {
        <button
          tuiButton
          [class.is-active]="activeTabId() === 'kings-corruption'"
          (click)="activeTabId.set('kings-corruption')">
          Kings' Corruption
        </button>
      }
    </header>
    <main>
      @switch (activeTabId()) {
        @case ("pool") {
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
        }
        @case ("drawn") {
          <div class="tiles">
            @for (tile of hunt().huntDrawn; track $index) {
              <img
                class="tile-image"
                [src]="tile | bgTransform: tileImage" />
            }
          </div>
        }
        @case ("removed") {
          <div class="tiles">
            @for (tile of hunt().huntRemoved; track $index) {
              <img
                class="tile-image"
                [src]="tile | bgTransform: tileImage" />
            }
          </div>
        }
        @case ("kings-corruption") {
          <kome-corruption-board></kome-corruption-board>
        }
      }
    </main>
  `,
  styles: [
    `
      $color: var(--wotr-front-color);

      :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }

      header {
        display: flex;
        background-color: transparent;

        button {
          flex: 1;
          border-radius: 0;
          &.is-active {
            color: $color;
          }
        }
      }

      main {
        overflow: auto;
        flex: 1;
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
            --mat-tab-container-height: 25px;
          }
          .mat-mdc-tab.mdc-tab--active .mdc-tab__text-label {
          }
          .mat-mdc-tab .mdc-tab-indicator__content--underline {
            display: none;
          }
        }
      }
    `
  ]
})
export class WotrHuntArea {
  protected assets = inject(WotrAssetsStore);
  private gameStore = inject(WotrGameStore);

  hunt = input.required<WotrHuntState>();
  selectedHuntTabIndex = input<number | undefined>(undefined);

  protected activeTabId = linkedSignal<HuntTabId>(() => (this.showPool() ? "pool" : "drawn"));

  protected kome = this.gameStore.kome;
  private visibleCorruptionTiles = this.gameStore.visibleCorruptionTiles;

  protected showPool = computed(() => !this.kome() || this.visibleCorruptionTiles());

  protected tileImage: BgTransformFn<WotrHuntTileId, string> = huntTile =>
    this.assets.huntTileImage(huntTile);
}
