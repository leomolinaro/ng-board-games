import { inject, Injectable } from "@angular/core";
import { drawCardIds } from "../card/wotr-card-actions";
import { WotrCardPlayerService } from "../card/wotr-card-player.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrGameStory } from "../game/wotr-story.models";
import { advanceNation } from "../nation/wotr-nation-actions";
import { WotrNationPlayerService } from "../nation/wotr-nation-player.service";
import { WotrUnitPlayerService } from "../unit/wotr-unit-player.service";
import { skipActionDie } from "./wotr-action-die-actions";
import { WotrActionDie, WotrActionToken } from "./wotr-action.models";

// type WotrEventDieChoice = "draw" | "play" | "skip";
// type WotrArmyDieChoice = "move" | "attack" | "play" | "skip";
// type WotrMusterDieChoice = "diplomatic" | "play" | "recruit" | "bring" | "skip";
// type WotrMasterArmyDieChoice = "move" | "attack" | "diplomatic" | "recruit" | "bring" | "skip" | "play";
// type WotrCharacterDieChoice = "play" | "skip";

@Injectable()
export class WotrActionPlayerService {
  private ui = inject(WotrGameUiStore);
  private cardPlayer = inject(WotrCardPlayerService);
  private nationPlayer = inject(WotrNationPlayerService);
  private unitPlayer = inject(WotrUnitPlayerService);

  resolveActionDie(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrGameStory> {
    switch (die) {
      case "event":
        return this.resolveEventDie(frontId);
      case "army":
        return this.resolveArmyDie(frontId);
      case "character":
        return this.resolveCharacterDie(frontId);
      case "muster":
        return this.resolveMusterDie(frontId);
      case "muster-army":
        return this.resolveMusterArmyDie(frontId);
      case "will-of-the-west":
        return this.resolveWillOfTheWestDie(frontId);
      case "eye":
        throw new Error("Eye die resolution is unexpected.");
    }
  }

  private async resolveArmyDie(frontId: string): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  private async resolveCharacterDie(frontId: string): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  private async resolveMusterDie(frontId: string): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  private async resolveMusterArmyDie(frontId: string): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");

    // const action = await this.ui.askOption<"muster" | "army" | "skip">("Choose an action result", [
    //   { value: "muster", label: "Muster result" },
    //   { value: "army", label: "Army result" },
    //   { value: "skip", label: "Skip the die" }
    // ]);
    // switch (action) {
    //   case "muster":
    //     return this.resolveMusterDie(frontId, false);
    //   case "army":
    //     return this.resolveArmyDie(frontId, false);
    //   case "skip":
    //     return this.skipDieStory("muster-army");
    // }
  }

  private async resolveWillOfTheWestDie(frontId: string): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  private async resolveEventDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    const action = await this.ui.askOption<"draw" | "play" | "skip">("Choose an action for the event die", [
      { value: "draw", label: "Draw a card" },
      { value: "play", label: "Play an event card" },
      { value: "skip", label: "Skip the die" }
    ]);
    switch (action) {
      case "draw": {
        const cardId = await this.cardPlayer.drawCard(frontId);
        return {
          type: "die",
          die: "event",
          actions: cardId ? [drawCardIds(cardId)] : []
        };
      }
      case "play": {
        const playableCards = this.cardPlayer.getPlayableEventCards(frontId);
        const cardId = await this.ui.askCard("Select an event card to play", playableCards, frontId);
        if (!cardId) {
          return {
            type: "die",
            die: "event",
            actions: []
          };
        }
        const actions = await this.cardPlayer.playCard(cardId, frontId);
        return {
          type: "die",
          die: "event",
          actions
        };
      }
      case "skip": {
        return this.skipDieStory("event");
      }
    }
  }

  private skipDieStory(die: WotrActionDie): WotrGameStory {
    return {
      type: "die",
      die,
      actions: [skipActionDie(die)]
    };
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
      case "move-nazgul-minions": {
        const nazgulMovements = await this.unitPlayer.moveNazgulMinions(frontId);
        return {
          type: "token",
          token: "move-nazgul-minions",
          actions: nazgulMovements
        };
      }
    }
  }
}
