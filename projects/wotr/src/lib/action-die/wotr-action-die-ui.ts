import { inject, Injectable } from "@angular/core";
import { WotrCardUi } from "../card/wotr-card-ui";
import { WotrCharacterUi } from "../character/wotr-character-ui";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { WotrDieStory, WotrGameStory } from "../game/wotr-story-models";
import { advanceNation } from "../nation/wotr-nation-actions";
import { WotrNationUi } from "../nation/wotr-nation-ui";
import { WotrUnitUi } from "../unit/wotr-unit-ui";
import { rollActionDice, skipActionDie } from "./wotr-action-die-actions";
import { WotrActionDie, WotrActionToken } from "./wotr-action-die-models";
import { WotrActionDieModifiers } from "./wotr-action-die-modifiers";
import { WotrActionDieRules } from "./wotr-action-die-rules";

@Injectable({
  providedIn: "root"
})
export class WotrActionDieUi {
  private actionDieRules = inject(WotrActionDieRules);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private ui = inject(WotrGameUi);
  private characterUi = inject(WotrCharacterUi);
  private unitUi = inject(WotrUnitUi);
  private cardUi = inject(WotrCardUi);
  private nationUi = inject(WotrNationUi);
  private fellowshipUi = inject(WotrFellowshipUi);

  async rollActionDice(frontId: WotrFrontId): Promise<WotrAction> {
    const nActionDice = this.actionDieRules.rollableActionDice(frontId);
    await this.ui.askContinue(`Roll ${nActionDice} action dice`);
    const actionDice: WotrActionDie[] = [];
    for (let i = 0; i < nActionDice; i++) {
      actionDice.push(this.actionDieRules.rollActionDie(frontId));
    }
    return rollActionDice(...actionDice);
  }

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
    return this.resolveArmyResult("army", frontId);
  }

  async resolveArmyResult(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrDieStory> {
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the army die",
      [
        this.unitUi.moveArmiesChoice,
        this.unitUi.attackArmyChoice,
        this.cardUi.playEventCardChoice(["army"]),
        ...this.actionDieModifiers.getActionDieChoices("army", frontId),
        this.skipDieChoice("event")
      ],
      frontId
    );
  }

  private async resolveCharacterDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return this.resolveCharacterResult("character", frontId);
  }

  async resolveCharacterResult(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrDieStory> {
    const choices: WotrUiChoice[] = [
      this.unitUi.leaderArmyMoveChoice,
      this.unitUi.leaderArmyAttackChoice,
      this.cardUi.playEventCardChoice(["character"])
    ];
    if (frontId === "free-peoples") {
      choices.push(
        this.fellowshipUi.progressChoice,
        this.fellowshipUi.hideFellowshipChoice,
        this.fellowshipUi.separateCompanionsChoice,
        this.characterUi.moveCompanionsChoice
      );
    } else {
      choices.push(this.characterUi.moveMinionsChoice);
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices("character", frontId));
    choices.push(this.skipDieChoice("character"));
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the character die",
      choices,
      frontId
    );
  }

  private async resolveMusterDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return this.resolveMusterResult("muster", frontId);
  }

  async resolveMusterResult(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrDieStory> {
    const choices: WotrUiChoice[] = [
      this.nationUi.diplomaticActionChoice,
      this.cardUi.playEventCardChoice(["muster"]),
      this.unitUi.recruitReinforcementsChoice
    ];
    if (frontId === "shadow") {
      choices.push(this.characterUi.bringCharacterIntoPlayChoice("muster"));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices("muster", frontId));
    choices.push(this.skipDieChoice("muster"));
    return this.ui.askDieStoryChoice(die, "Choose an action for the muster die", choices, frontId);
  }

  private async resolveMusterArmyDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    const choices: WotrUiChoice[] = [
      this.nationUi.diplomaticActionChoice,
      this.unitUi.moveArmiesChoice,
      this.unitUi.attackArmyChoice,
      this.cardUi.playEventCardChoice(["muster", "army"]),
      this.unitUi.recruitReinforcementsChoice
    ];
    if (frontId === "shadow") {
      choices.push(this.characterUi.bringCharacterIntoPlayChoice("muster"));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices("muster-army", frontId));
    choices.push(this.skipDieChoice("muster-army"));
    return this.ui.askDieStoryChoice(
      "muster-army",
      "Choose an action for the muster-army die",
      choices,
      frontId
    );
  }

  private async resolveWillOfTheWestDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    const choices: WotrUiChoice[] = [
      this.changeCharacterDieChoice,
      this.changeArmyDieChoice,
      this.changeMusterDieChoice,
      this.changeEventDieChoice
    ];
    if (frontId === "free-peoples") {
      choices.push(this.characterUi.bringCharacterIntoPlayChoice("will-of-the-west"));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices("will-of-the-west", frontId));
    choices.push(this.skipDieChoice("will-of-the-west"));
    return this.ui.askDieStoryChoice(
      "will-of-the-west",
      "Choose an action for the Will of the West die",
      choices,
      frontId
    );
  }

  private changeCharacterDieChoice: WotrUiChoice = {
    label: () => "Character result",
    actions: async (frontId: WotrFrontId) =>
      (await this.resolveCharacterResult("will-of-the-west", frontId)).actions
  };

  private changeArmyDieChoice: WotrUiChoice = {
    label: () => "Army result",
    actions: async (frontId: WotrFrontId) =>
      (await this.resolveArmyResult("will-of-the-west", frontId)).actions
  };

  private changeMusterDieChoice: WotrUiChoice = {
    label: () => "Muster result",
    actions: async (frontId: WotrFrontId) =>
      (await this.resolveMusterResult("will-of-the-west", frontId)).actions
  };

  private changeEventDieChoice: WotrUiChoice = {
    label: () => "Event result",
    actions: async (frontId: WotrFrontId) =>
      (await this.resolveEventResult("will-of-the-west", frontId)).actions
  };

  private skipDieChoice(die: WotrActionDie): WotrUiChoice {
    return {
      label: () => "Skip the action die",
      actions: async () => [skipActionDie(die)]
    };
  }

  private async resolveEventDie(frontId: WotrFrontId): Promise<WotrGameStory> {
    return this.resolveEventResult("event", frontId);
  }

  async resolveEventResult(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrDieStory> {
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the event die",
      [
        this.cardUi.drawEventCardChoice,
        this.cardUi.playEventCardChoice("any"),
        ...this.actionDieModifiers.getActionDieChoices("event", frontId),
        this.skipDieChoice("event")
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
    const actions = await this.cardUi.drawCard(frontId);
    return {
      type: "token",
      token: "draw-card",
      actions
    };
  }

  private async resolvePoliticalAdvanceToken(frontId: WotrFrontId): Promise<WotrGameStory> {
    const nation = await this.nationUi.politicalAdvance(frontId);
    return {
      type: "token",
      token: "political-advance",
      actions: [advanceNation(nation, 1)]
    };
  }

  private async resolveMoveNazgulMinionsToken(frontId: WotrFrontId): Promise<WotrGameStory> {
    const nazgulMovements = await this.unitUi.moveNazgulMinions(frontId);
    return {
      type: "token",
      token: "move-nazgul-minions",
      actions: nazgulMovements
    };
  }
}
