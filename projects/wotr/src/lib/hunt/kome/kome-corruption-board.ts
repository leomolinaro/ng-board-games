import { Component, inject } from "@angular/core";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsStore } from "../../assets/wotr-assets-store";
import { KomeSovereign } from "../../character/wotr-character-models";
import { WotrCharacterStore } from "../../character/wotr-character-store";
import { WotrGameStore } from "../../game/wotr-game-store";
import { WotrHuntTileId } from "../wotr-hunt-models";

@Component({
  selector: "kome-corruption-board",
  imports: [BgTransformPipe],
  template: ` <div class="corruption-grid">
    @for (sovereign of sovereigns(); track sovereign.id) {
      <div class="ruler-cell">
        <img [src]="sovereign | bgTransform: sovereignImage" />
      </div>
      <div class="resistance-cell">
        {{ sovereign.shadowResistance }}
      </div>

      <div class="corruption-cell">
        @for (tile of sovereign.corruptionTiles; track $index) {
          <img
            class="hunt-tile"
            [src]="tile | bgTransform: huntTileImage" />
        }
      </div>
    }
  </div>`,
  styles: `
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
  `
})
export class KomeCorruptionBoard {
  private gameStore = inject(WotrGameStore);
  private characters = inject(WotrCharacterStore);
  private assets = inject(WotrAssetsStore);

  protected sovereigns = this.characters.sovereigns;
  private visibleCorruptionTiles = this.gameStore.visibleCorruptionTiles;

  protected sovereignImage: BgTransformFn<KomeSovereign, string> = (sovereign: KomeSovereign) =>
    this.assets.sovereignAvatar(sovereign.id);

  protected huntTileImage: BgTransformFn<WotrHuntTileId, string> = (tileId: WotrHuntTileId) =>
    this.visibleCorruptionTiles() ? this.assets.huntTileImage(tileId) : this.assets.huntTileBack();
}
