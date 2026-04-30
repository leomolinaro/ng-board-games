import { Component, computed, inject } from "@angular/core";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { KomeSovereign, KomeSovereignId } from "../character/wotr-character-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameStore } from "../game/wotr-game-store";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrHuntTileId } from "./wotr-hunt-models";

@Component({
  selector: "kome-corruption-board",
  imports: [BgTransformPipe],
  template: `
    @let selection = sovereignSelectionMap();
    <div class="corruption-grid">
      @for (sovereign of sovereigns(); track sovereign.id) {
        <div
          class="ruler-cell"
          [class]="{
            selectable: selection && selection[sovereign.id],
            disabled: selection && !selection[sovereign.id]
          }">
          <img
            [src]="sovereign | bgTransform: sovereignImage"
            (click)="selectSovereign(sovereign.id)" />
          @if (sovereign.sovereignStatus === "corrupted") {
            <div class="corrupted-overlay"></div>
          }
        </div>
        <div class="resistance-cell">
          {{ sovereign.shadowResistance }}
        </div>

        <div class="corruption-cell">
          @for (tile of sovereign.corruptionTiles; track $index) {
            <img
              class="hunt-tile"
              [src]="tile | bgTransform: huntTileImage : { currentFront: currentFront() }" />
          }
        </div>
      }
    </div>
  `,
  styles: `
    @use "wotr-variables" as wotr;

    .corruption-grid {
      padding: 0.5rem;
      display: grid;
      grid-auto-flow: column;
      grid-template-columns: repeat(1fr, auto);
      grid-template-rows: 50px 10px 1fr;
      gap: 0.5rem;
    }
    .ruler-cell,
    .resistance-cell {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .corruption-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hunt-tile {
      margin-right: 0.25rem;
    }
    .ruler-cell {
      display: flex;
      position: relative;
      &.selectable > * {
        cursor: pointer;
      }
      &.disabled > * {
        opacity: 0.5;
      }
      .corrupted-overlay {
        background-color: wotr.$red;
        opacity: 0.5;
        width: 50px;
        height: 50px;
        border-radius: 50px;
        position: absolute;
      }
    }
  `
})
export class KomeCorruptionBoard {
  private gameStore = inject(WotrGameStore);
  private characters = inject(WotrCharacterStore);
  private assets = inject(WotrAssetsStore);
  private ui = inject(WotrGameUi);

  protected sovereigns = this.characters.sovereigns;
  private visibleCorruptionTiles = this.gameStore.visibleCorruptionTiles;

  protected currentFront = this.ui.currentPlayerId;

  protected sovereignSelectionMap = computed<Record<KomeSovereignId, boolean> | null>(() => {
    const selection = this.ui.sovereignSelection();
    if (!selection) return null;
    const map: Record<KomeSovereignId, boolean> = {
      brand: false,
      dain: false,
      denethor: false,
      theoden: false,
      thranduil: false
    };
    for (const sovereign of selection) {
      map[sovereign] = true;
    }
    return map;
  });

  protected sovereignImage: BgTransformFn<KomeSovereign, string> = (sovereign: KomeSovereign) =>
    this.assets.sovereignAvatar(sovereign.id);

  protected huntTileImage: BgTransformFn<
    WotrHuntTileId,
    string,
    { currentFront: WotrFrontId | null }
  > = (tileId: WotrHuntTileId, params) =>
    this.visibleCorruptionTiles() || params.currentFront === "shadow"
      ? this.assets.huntTileImage(tileId)
      : this.assets.huntTileBack();

  selectSovereign(sovereignId: KomeSovereignId) {
    if (!this.sovereignSelectionMap()?.[sovereignId]) return;
    this.ui.sovereign.emit(sovereignId);
  }
}
