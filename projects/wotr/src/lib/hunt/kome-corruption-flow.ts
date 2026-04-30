import { inject, Injectable } from "@angular/core";
import { KomeSovereignId } from "../character/wotr-character-models";
import { findAction } from "../commons/wotr-action-models";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { KomeCorruptionContinueAttempt, KomeCorruptionStopAttempt } from "./wotr-hunt-actions";
import { WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntStore } from "./wotr-hunt-store";

@Injectable()
export class KomeCorruptionFlow {
  private shadow = inject(WotrShadowPlayer);
  private huntStore = inject(WotrHuntStore);

  async corruptionAttempt(sovereign: KomeSovereignId, tile: WotrHuntTileId) {
    let choosenTile: WotrHuntTileId | null = null;
    while (!choosenTile) {
      const story = await this.shadow.chooseCorruptionTile();
      if (!("actions" in story)) throw new Error("Invalid story: no actions found");
      const continueAttempt = findAction<KomeCorruptionContinueAttempt>(
        story.actions,
        "corruption-continue-attempt"
      );
      if (!continueAttempt) {
        const stopAttempt = findAction<KomeCorruptionStopAttempt>(
          story.actions,
          "corruption-stop-attempt"
        );
        if (stopAttempt) {
          choosenTile = stopAttempt.tile;
        } else {
          throw new Error("Invalid story: no continue or stop attempt found");
        }
      }
    }
  }
}
