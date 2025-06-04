import { inject, Injectable } from "@angular/core";
import { drawCardIds } from "../card/wotr-card-actions";
import { WotrCardPlayerService } from "../card/wotr-card-player.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { advanceNation } from "../nation/wotr-nation-actions";
import { WotrNationPlayerService } from "../nation/wotr-nation-player.service";
import { WotrActionDie, WotrActionToken } from "./wotr-action.models";

@Injectable()
export class WotrActionPlayerService {
  private cardPlayer = inject(WotrCardPlayerService);
  private nationPlayer = inject(WotrNationPlayerService);

  resolveActionDie(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async resolveActionToken(token: WotrActionToken, frontId: WotrFrontId): Promise<WotrGameStory> {
    switch (token) {
      case "draw-card": {
        const cardId = await this.cardPlayer.drawCard(frontId);
        return {
          type: "token",
          token: "draw-card",
          actions: cardId ? [drawCardIds(cardId)] : []
        };
      }
      case "political-advance": {
        const nation = await this.nationPlayer.politicalAdvance(frontId);
        return {
          type: "token",
          token: "political-advance",
          actions: nation ? [advanceNation(nation, 1)] : []
        };
      }
    }
    throw new Error("Method not implemented.");
  }
}
