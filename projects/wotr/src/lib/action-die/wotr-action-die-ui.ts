import { inject, Injectable } from "@angular/core";
import { WotrDrawEventCardChoice, WotrPlayEventCardChoice } from "../card/wotr-card-action-choices";
import { WotrCardRules } from "../card/wotr-card-rules";
import { WotrCardUi } from "../card/wotr-card-ui";
import {
  WotrBringCharacterIntoPlayChoice,
  WotrMoveCompanionsChoice,
  WotrMoveMinionsChoice
} from "../character/wotr-character-choices";
import { WotrCharacterRules } from "../character/wotr-character-rules";
import { WotrCharacterUi } from "../character/wotr-character-ui";
import { WotrAction } from "../commons/wotr-action-models";
import {
  WotrFellowshipProgressChoice,
  WotrHideFellowshipChoice,
  WotrSeparateCompanionsChoice
} from "../fellowship/wotr-fellowship-choices";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrGameStory } from "../game/wotr-story-models";
import { advanceNation } from "../nation/wotr-nation-actions";
import { WotrDiplomaticActionChoice } from "../nation/wotr-nation-choices";
import { WotrNationUi } from "../nation/wotr-nation-ui";
import {
  WotrAttackArmyChoice,
  WotrLeaderArmyAttackChoice,
  WotrLeaderArmyMoveChoice,
  WotrMoveArmiesChoice,
  WotrRecruitReinforcementsChoice
} from "../unit/wotr-unit-choices";
import { WotrUnitUi } from "../unit/wotr-unit-ui";
import {
  WotrChangeArmyDieChoice,
  WotrChangeCharacterDieChoice,
  WotrChangeEventDieChoice,
  WotrChangeMusterDieChoice,
  WotrSkipDieChoice
} from "./wotr-action-die-choices";
import { WotrActionDie, WotrActionToken } from "./wotr-action-die-models";
import { WotrActionDieRules } from "./wotr-action-die-rules";

@Injectable({
  providedIn: "root"
})
export class WotrActionDieUi {
  private actionDieRules = inject(WotrActionDieRules);
  private cardPlayer = inject(WotrCardUi);
  private characterRules = inject(WotrCharacterRules);
  private characterUi = inject(WotrCharacterUi);
  private nationPlayer = inject(WotrNationUi);
  private ui = inject(WotrGameUi);
  private unitPlayer = inject(WotrUnitUi);
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
  private cardRules = inject(WotrCardRules);

  async actionResolution(frontId: WotrFrontId): Promise<WotrGameStory> {
    const canSkipTokens = this.actionDieRules.canSkipTokens(frontId);
    if (canSkipTokens) {
      const skipTokens = await this.ui.askConfirm(
        "Do you want to skip action tokens?",
        "Skip action tokens",
        "Play action token"
      );
      if (skipTokens) {
        return { type: "token-skip" };
      }
    } else {
      const canPass = this.actionDieRules.canPassAction(frontId);
      if (canPass) {
        const pass = await this.ui.askConfirm("Do you want to pass?", "Pass", "Play action die");
        if (pass) {
          return { type: "die-pass" };
        }
      }
    }
    const playableTokens = this.actionDieRules.playableTokens(frontId);
    const actionChoice = await this.ui.askActionDie(
      "Choose an action die to resolve",
      frontId,
      playableTokens
    );
    if (actionChoice.type === "die") {
      return this.resolveActionDie(actionChoice.die, frontId);
    } else {
      return this.resolveActionToken(actionChoice.token, frontId);
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
    return this.ui.askChoice(
      "Choose an action for the army die",
      [
        this.moveArmiesChoice,
        this.attackArmyChoice,
        new WotrPlayEventCardChoice(["army"], frontId, this.cardRules, this.ui, this.cardPlayer),
        new WotrSkipDieChoice("event")
      ],
      frontId
    );
  }

  private async resolveCharacterDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "die",
      die: "character",
      actions: await this.resolveCharacterResult(frontId)
    };
  }

  async resolveCharacterResult(frontId: WotrFrontId): Promise<WotrAction[]> {
    const choices: WotrPlayerChoice[] = [
      this.leaderArmyMoveChoice,
      this.leaderArmyAttackChoice,
      new WotrPlayEventCardChoice(["character"], frontId, this.cardRules, this.ui, this.cardPlayer)
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
    return this.ui.askChoice("Choose an action for the character die", choices, frontId);
  }

  private async resolveMusterDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return {
      type: "die",
      die: "muster",
      actions: await this.resolveMusterResult(frontId)
    };
  }

  async resolveMusterResult(frontId: WotrFrontId): Promise<WotrAction[]> {
    const choices: WotrPlayerChoice[] = [
      this.diplomaticActionChoice,
      new WotrPlayEventCardChoice(["muster"], frontId, this.cardRules, this.ui, this.cardPlayer),
      this.recruitReinforcementsChoice
    ];
    if (frontId === "shadow") {
      choices.push(
        new WotrBringCharacterIntoPlayChoice("muster", this.characterRules, this.characterUi)
      );
    }
    choices.push(new WotrSkipDieChoice("muster"));
    return this.ui.askChoice("Choose an action for the muster die", choices, frontId);
  }

  private async resolveMusterArmyDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    const choices: WotrPlayerChoice[] = [
      this.diplomaticActionChoice,
      this.moveArmiesChoice,
      this.attackArmyChoice,
      new WotrPlayEventCardChoice(
        ["muster", "army"],
        frontId,
        this.cardRules,
        this.ui,
        this.cardPlayer
      ),
      this.recruitReinforcementsChoice
    ];
    if (frontId === "shadow") {
      choices.push(
        new WotrBringCharacterIntoPlayChoice("muster", this.characterRules, this.characterUi)
      );
    }
    choices.push(new WotrSkipDieChoice("muster-army"));
    const actions = await this.ui.askChoice(
      "Choose an action for the muster-army die",
      choices,
      frontId
    );
    return {
      type: "die",
      die: "muster-army",
      actions
    };
  }

  private async resolveWillOfTheWestDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    const choices: WotrPlayerChoice[] = [
      new WotrChangeCharacterDieChoice(this),
      new WotrChangeArmyDieChoice(this),
      new WotrChangeMusterDieChoice(this),
      new WotrChangeEventDieChoice(this)
    ];
    if (frontId === "free-peoples") {
      choices.push(
        new WotrBringCharacterIntoPlayChoice(
          "will-of-the-west",
          this.characterRules,
          this.characterUi
        )
      );
    }
    choices.push(new WotrSkipDieChoice("will-of-the-west"));
    const actions = await this.ui.askChoice(
      "Choose an action for the Will of the West die",
      choices,
      frontId
    );
    return {
      type: "die",
      die: "will-of-the-west",
      actions
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
    return this.ui.askChoice(
      "Choose an action for the event die",
      [
        this.drawEventCardChoice,
        new WotrPlayEventCardChoice("any", frontId, this.cardRules, this.ui, this.cardPlayer),
        new WotrSkipDieChoice("event")
      ],
      frontId
    );
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
    const actions = await this.cardPlayer.drawCard(frontId);
    return {
      type: "token",
      token: "draw-card",
      actions
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
