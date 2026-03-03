import { inject, Injectable } from "@angular/core";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntStore } from "./wotr-hunt-store";

@Injectable()
export class KomeCorruptionFlow {
  private shadow = inject(WotrShadowPlayer);
  private huntStore = inject(WotrHuntStore);

  async startAttempt(tile: WotrHuntTileId) {
    const nRemainingEyes = this.huntStore.nHuntDice();
  }

  async continueAttempt(tile: WotrHuntTileId) {}

  async stopAttempt() {}
}
