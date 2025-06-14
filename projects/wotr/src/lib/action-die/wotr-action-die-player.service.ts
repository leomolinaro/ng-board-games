import { inject, Injectable } from "@angular/core";
import { WotrDrawEventCardChoice } from "../card/wotr-card-action-choices";
import { drawCardIds } from "../card/wotr-card-actions";
import { WotrCardPlayerService } from "../card/wotr-card-player.service";
import {
  WotrBringCharacterIntoPlayChoice,
  WotrMoveCompanionsChoice,
  WotrMoveMinionsChoice,
  WotrSeparateCompanionsChoice
} from "../character/wotr-character-choices";
import { WotrCharactersService } from "../character/wotr-characters.service";
import { WotrAction } from "../commons/wotr-action.models";
import {
  WotrFellowshipProgressChoice,
  WotrHideFellowshipChoice
} from "../fellowship/wotr-fellowship-choices";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrGameStory } from "../game/wotr-story.models";
import { advanceNation } from "../nation/wotr-nation-actions";
import { WotrDiplomaticActionChoice } from "../nation/wotr-nation-choices";
import { WotrNationPlayerService } from "../nation/wotr-nation-player.service";
import { WotrPlayer } from "../player/wotr-player";
import {
  WotrAttackArmyChoice,
  WotrLeaderArmyAttackChoice,
  WotrLeaderArmyMoveChoice,
  WotrMoveArmiesChoice,
  WotrRecruitReinforcementsChoice
} from "../unit/wotr-unit-choices";
import { WotrUnitPlayerService } from "../unit/wotr-unit-player.service";
import {
  WotrActionPlayerChoice,
  WotrChangeArmyDieChoice,
  WotrChangeCharacterDieChoice,
  WotrChangeEventDieChoice,
  WotrChangeMusterDieChoice,
  WotrSkipDieChoice
} from "./wotr-action-die-choices";
import { WotrActionDie, WotrActionToken } from "./wotr-action-die.models";
import { WotrActionDieService } from "./wotr-action-die.service";

@Injectable({
  providedIn: "root"
})
export class WotrActionPlayerService {
  private actionDieService = inject(WotrActionDieService);
  private cardPlayer = inject(WotrCardPlayerService);
  private charactersService = inject(WotrCharactersService);
  private nationPlayer = inject(WotrNationPlayerService);
  private ui = inject(WotrGameUiStore);
  private unitPlayer = inject(WotrUnitPlayerService);
  private recruitReinforcementsChoice = inject(WotrRecruitReinforcementsChoice);
  private attackArmyChoice = inject(WotrAttackArmyChoice);
  private moveArmiesChoice = inject(WotrMoveArmiesChoice);
  private leaderArmyAttackChoice = inject(WotrLeaderArmyAttackChoice);
  private leaderArmyMoveChoice = inject(WotrLeaderArmyMoveChoice);
  private fellowshipProgressChoice = inject(WotrFellowshipProgressChoice);
  private hideFellowshiptChoice = inject(WotrHideFellowshipChoice);
  private separateCompanionsChoice = inject(WotrSeparateCompanionsChoice);
  private moveCompanionsChoice = inject(WotrMoveCompanionsChoice);
  private moveMinionsChoice = inject(WotrMoveMinionsChoice);
  private diplomaticActionChoice = inject(WotrDiplomaticActionChoice);
  private drawEventCardChoice = inject(WotrDrawEventCardChoice);

  async actionResolution(player: WotrPlayer): Promise<WotrGameStory> {
    const canPass = this.actionDieService.canPassAction(player.frontId);
    if (canPass) {
      const pass = await this.ui.askConfirm("Do you want to pass?");
      if (pass) {
        return { type: "die-pass" };
      }
    }
    const playableTokens = this.actionDieService.playableTokens(player.frontId);
    const actionChoice = await this.ui.askActionDie(
      "Choose an action die to resolve",
      player.frontId,
      playableTokens
    );
    if (actionChoice.type === "die") {
      return this.resolveActionDie(actionChoice.die, player.frontId);
    } else {
      return this.resolveActionToken(actionChoice.token, player.frontId);
    }
  }

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

  private async resolveArmyDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "die",
      die: "army",
      actions: await this.resolveArmyResult(frontId)
    };
  }

  async resolveArmyResult(frontId: WotrFrontId): Promise<WotrAction[]> {
    const choice = await this.askActionChoice(
      "Choose an action for the army die",
      [
        this.moveArmiesChoice,
        this.attackArmyChoice,
        // new WotrPlayEventCardChoice(["army"], frontId, this.frontStore, this.ui, this.cardPlayer),
        new WotrSkipDieChoice("event")
      ],
      frontId
    );
    return choice.resolve(frontId);
  }

  private async resolveCharacterDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "die",
      die: "character",
      actions: await this.resolveCharacterResult(frontId)
    };
  }

  async resolveCharacterResult(frontId: WotrFrontId): Promise<WotrAction[]> {
    const choices: WotrActionPlayerChoice[] = [
      this.leaderArmyMoveChoice,
      this.leaderArmyAttackChoice
      // new WotrPlayEventCardChoice(["character"], frontId, this.frontStore, this.ui, this.cardPlayer)
    ];
    if (frontId === "free-peoples") {
      choices.push(
        this.fellowshipProgressChoice,
        this.hideFellowshiptChoice,
        this.separateCompanionsChoice,
        this.moveCompanionsChoice
      );
    } else {
      choices.push(this.moveMinionsChoice);
    }
    choices.push(new WotrSkipDieChoice("character"));

    const choice = await this.askActionChoice(
      "Choose an action for the character die",
      choices,
      frontId
    );
    return choice.resolve(frontId);
  }

  private async resolveMusterDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "die",
      die: "muster",
      actions: await this.resolveMusterResult(frontId)
    };
  }

  async resolveMusterResult(frontId: WotrFrontId): Promise<WotrAction[]> {
    const choices: WotrActionPlayerChoice[] = [
      this.diplomaticActionChoice,
      // new WotrPlayEventCardChoice(["muster"], frontId, this.frontStore, this.ui, this.cardPlayer),
      this.recruitReinforcementsChoice
    ];
    if (frontId === "shadow") {
      choices.push(new WotrBringCharacterIntoPlayChoice("muster", this.charactersService));
    }
    choices.push(new WotrSkipDieChoice("muster"));
    const choice = await this.askActionChoice(
      "Choose an action for the muster die",
      choices,
      frontId
    );
    return choice.resolve(frontId);
  }

  private async resolveMusterArmyDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    const choices: WotrActionPlayerChoice[] = [
      this.diplomaticActionChoice,
      this.moveArmiesChoice,
      this.attackArmyChoice,
      // new WotrPlayEventCardChoice(["muster", "army"], frontId, this.frontStore, this.ui, this.cardPlayer),
      this.recruitReinforcementsChoice
    ];
    if (frontId === "shadow") {
      choices.push(new WotrBringCharacterIntoPlayChoice("muster", this.charactersService));
    }
    choices.push(new WotrSkipDieChoice("muster-army"));
    const choice = await this.askActionChoice(
      "Choose an action for the muster-army die",
      choices,
      frontId
    );
    return {
      type: "die",
      die: "muster-army",
      actions: await choice.resolve(frontId)
    };
  }

  private async resolveWillOfTheWestDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    const choices: WotrActionPlayerChoice[] = [
      new WotrChangeCharacterDieChoice(frontId, this),
      new WotrChangeArmyDieChoice(frontId, this),
      new WotrChangeMusterDieChoice(frontId, this),
      new WotrChangeEventDieChoice(frontId, this)
    ];
    if (frontId === "free-peoples") {
      choices.push(
        new WotrBringCharacterIntoPlayChoice("will-of-the-west", this.charactersService)
      );
    }
    choices.push(new WotrSkipDieChoice("will-of-the-west"));
    const choice = await this.askActionChoice(
      "Choose an action for the Will of the West die",
      choices,
      frontId
    );
    return {
      type: "die",
      die: "will-of-the-west",
      actions: await choice.resolve(frontId)
    };
  }

  private async resolveEventDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "die",
      die: "event",
      actions: await this.resolveEventResult(frontId)
    };
  }

  async resolveEventResult(frontId: WotrFrontId): Promise<WotrAction[]> {
    const choice = await this.askActionChoice(
      "Choose an action for the event die",
      [
        this.drawEventCardChoice,
        // new WotrPlayEventCardChoice("any", frontId, this.frontStore, this.ui, this.cardPlayer),
        new WotrSkipDieChoice("event")
      ],
      frontId
    );
    return choice.resolve(frontId);
  }

  private async askActionChoice(
    message: string,
    choices: WotrActionPlayerChoice[],
    frontId: WotrFrontId
  ): Promise<WotrActionPlayerChoice> {
    const choice = await this.ui.askOption<WotrActionPlayerChoice>(
      message,
      choices.map(c => ({
        value: c,
        label: c.label(),
        disabled: !c.isAvailable(frontId)
      }))
    );
    return choice;
  }

  async resolveActionToken(token: WotrActionToken, frontId: WotrFrontId): Promise<WotrGameStory> {
    switch (token) {
      case "draw-card":
        return this.resolveDrawCardToken(frontId);
      case "political-advance":
        return this.resolvePoliticalAdvanceToken(frontId);
      case "move-nazgul-minions":
        return this.resolveMoveNazgulMinionsToken(frontId);
    }
  }

  private async resolveDrawCardToken(frontId: WotrFrontId): Promise<WotrGameStory> {
    const cardId = await this.cardPlayer.drawCard(frontId);
    return {
      type: "token",
      token: "draw-card",
      actions: [drawCardIds(cardId)]
    };
  }

  private async resolvePoliticalAdvanceToken(frontId: WotrFrontId): Promise<WotrGameStory> {
    const nation = await this.nationPlayer.politicalAdvance(frontId);
    return {
      type: "token",
      token: "political-advance",
      actions: [advanceNation(nation, 1)]
    };
  }

  private async resolveMoveNazgulMinionsToken(frontId: WotrFrontId): Promise<WotrGameStory> {
    const nazgulMovements = await this.unitPlayer.moveNazgulMinions(frontId);
    return {
      type: "token",
      token: "move-nazgul-minions",
      actions: nazgulMovements
    };
  }
}
