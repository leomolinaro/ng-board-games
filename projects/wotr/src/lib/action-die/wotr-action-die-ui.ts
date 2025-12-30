import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrCardDrawUi } from "../card/wotr-card-draw-ui";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCardPlayUi } from "../card/wotr-card-play-ui";
import { WotrCharacterUi } from "../character/wotr-character-ui";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontUi } from "../front/wotr-front-ui";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import {
  WotrDieCardStory,
  WotrDieStory,
  WotrElvenRingAction,
  WotrPassStory,
  WotrStory,
  WotrTokenStory
} from "../game/wotr-story-models";
import { advanceNation } from "../nation/wotr-nation-actions";
import { WotrNationUi } from "../nation/wotr-nation-ui";
import { WotrUnitUi } from "../unit/wotr-unit-ui";
import { rollActionDice, skipActionDie } from "./wotr-action-die-actions";
import {
  WotrActionDie,
  WotrActionToken,
  WotrFreePeopleActionDie,
  WotrShadowActionDie
} from "./wotr-action-die-models";
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
  private cardUi = inject(WotrCardDrawUi);
  private cardPlayUi = inject(WotrCardPlayUi);
  private nationUi = inject(WotrNationUi);
  private fellowshipUi = inject(WotrFellowshipUi);
  private q = inject(WotrGameQuery);
  private frontUi = inject(WotrFrontUi);

  async rollActionDice(frontId: WotrFrontId): Promise<WotrAction> {
    const nActionDice = this.actionDieRules.rollableActionDice(frontId);
    await this.ui.askContinue(`Roll ${nActionDice} action dice`);
    const actionDice: WotrActionDie[] = [];
    for (let i = 0; i < nActionDice; i++) {
      actionDice.push(this.rollActionDie(frontId));
    }
    return rollActionDice(...actionDice);
  }

  private FREE_PEOPLES_ACTION_DICE: WotrFreePeopleActionDie[] = [
    "character",
    "character",
    "muster",
    "event",
    "muster-army",
    "will-of-the-west"
  ];

  private SHADOW_ACTION_DICE: WotrShadowActionDie[] = [
    "character",
    "army",
    "event",
    "muster",
    "muster-army",
    "eye"
  ];

  private rollActionDie(frontId: WotrFrontId): WotrActionDie {
    switch (frontId) {
      case "free-peoples":
        return randomUtil.getRandomDraws(1, this.FREE_PEOPLES_ACTION_DICE)[0];
      case "shadow":
        return randomUtil.getRandomDraws(1, this.SHADOW_ACTION_DICE)[0];
    }
  }

  async actionResolution(
    frontId: WotrFrontId,
    elvenRing: WotrElvenRingAction | null
  ): Promise<WotrStory> {
    const canSkipTokens = this.q.front(frontId).canSkipTokens();
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
        const story = await this.askPassDie(frontId, elvenRing);
        if (story) return story;
      }
    }
    return this.askAndResolveActionDie(frontId, elvenRing);
  }

  private async askPassDie(
    frontId: WotrFrontId,
    elvenRing: WotrElvenRingAction | null
  ): Promise<WotrStory | null> {
    const availableRings = this.q.front(frontId).playableElvenRings();
    const pass = await this.ui.askOptionOrElvenRing<"S" | "P">(
      "Do you want to pass?",
      [
        { label: "Pass", value: "S" },
        { label: "Play action die", value: "P" }
      ],
      { frontId, rings: availableRings }
    );
    switch (pass) {
      case "S": {
        const diePass: WotrPassStory = { type: "die-pass" };
        if (elvenRing) diePass.elvenRing = elvenRing;
        return diePass;
      }
      case "P":
        return null;
      default: {
        const elvenRingAction = await this.frontUi.useElvenRing(pass, frontId);
        return this.actionResolution(frontId, elvenRingAction);
      }
    }
  }

  private async askAndResolveActionDie(
    frontId: WotrFrontId,
    elvenRing: WotrElvenRingAction | null
  ): Promise<WotrStory> {
    const playableTokens = this.actionDieRules.playableTokens(frontId);
    const availableRings = this.q.front(frontId).playableElvenRings();
    const actionChoice = await this.ui.askActionDie(
      "Choose an action die to resolve",
      frontId,
      playableTokens,
      { frontId, rings: availableRings }
    );
    switch (actionChoice.type) {
      case "die": {
        const dieStory = await this.resolveActionDie(actionChoice.die, frontId);
        if (elvenRing) dieStory.elvenRing = elvenRing;
        return dieStory;
      }
      case "token": {
        const tokenStory = await this.resolveActionToken(actionChoice.token, frontId);
        if (elvenRing) tokenStory.elvenRing = elvenRing;
        return tokenStory;
      }
      case "elvenRing": {
        const elvenRingAction = await this.frontUi.useElvenRing(actionChoice.ring, frontId);
        return this.askAndResolveActionDie(frontId, elvenRingAction);
      }
    }
  }

  private resolveActionDie(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
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

  private async resolveArmyDie(frontId: WotrFrontId): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveArmyResult("army", frontId);
  }

  async resolveArmyResult(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the army die",
      [
        this.unitUi.moveArmiesChoice,
        this.unitUi.attackArmyChoice,
        this.cardPlayUi.playEventCardChoice(["army"]),
        ...this.actionDieModifiers.getActionDieChoices("army", frontId),
        this.skipDieChoice("event")
      ],
      frontId
    );
  }

  private async resolveCharacterDie(
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveCharacterResult("character", frontId);
  }

  private async resolveCharacterResult(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.unitUi.leaderArmyMoveChoice,
      this.unitUi.leaderArmyAttackChoice,
      this.cardPlayUi.playEventCardChoice(["character"])
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

  private async resolveMusterDie(frontId: WotrFrontId): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveMusterResult("muster", frontId);
  }

  private async resolveMusterResult(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.nationUi.diplomaticActionChoice(die),
      this.cardPlayUi.playEventCardChoice(["muster"]),
      this.unitUi.recruitReinforcementsChoice
    ];
    if (frontId === "shadow") {
      choices.push(this.characterUi.bringCharacterIntoPlayChoice("muster"));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices("muster", frontId));
    choices.push(this.skipDieChoice("muster"));
    return this.ui.askDieStoryChoice(die, "Choose an action for the muster die", choices, frontId);
  }

  private async resolveMusterArmyDie(
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.nationUi.diplomaticActionChoice("muster-army"),
      this.unitUi.moveArmiesChoice,
      this.unitUi.attackArmyChoice,
      this.cardPlayUi.playEventCardChoice(["muster", "army"]),
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

  private async resolveWillOfTheWestDie(
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.changeCharacterDieChoice(),
      this.changeArmyDieChoice(),
      this.changeMusterDieChoice(),
      this.changeEventDieChoice()
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

  private changeCharacterDieChoice(): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Character result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveCharacterResult("will-of-the-west", frontId);
        if (story.type === "die-card") chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId
    };
  }

  private changeArmyDieChoice(): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Army result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveArmyResult("will-of-the-west", frontId);
        if (story.type === "die-card") chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId
    };
  }

  private changeMusterDieChoice(): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Muster result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveMusterResult("will-of-the-west", frontId);
        if (story.type === "die-card") chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId
    };
  }

  private changeEventDieChoice(): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Event result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveEventResult("will-of-the-west", frontId);
        if (story.type === "die-card") chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId
    };
  }

  private skipDieChoice(die: WotrActionDie): WotrUiChoice {
    return {
      label: () => "Skip the action die",
      actions: async () => [skipActionDie(die)]
    };
  }

  private async resolveEventDie(frontId: WotrFrontId): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveEventResult("event", frontId);
  }

  async resolveEventResult(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the event die",
      [
        this.cardUi.drawEventCardChoice,
        this.cardPlayUi.playEventCardChoice("any"),
        ...this.actionDieModifiers.getActionDieChoices("event", frontId),
        this.skipDieChoice("event")
      ],
      frontId
    );
  }

  private async resolveActionToken(
    token: WotrActionToken,
    frontId: WotrFrontId
  ): Promise<WotrTokenStory> {
    switch (token) {
      case "draw-card":
        return this.resolveDrawCardToken(frontId);
      case "political-advance":
        return this.resolvePoliticalAdvanceToken(frontId);
      case "move-nazgul-minions":
        return this.resolveMoveNazgulMinionsToken(frontId);
    }
  }

  private async resolveDrawCardToken(frontId: WotrFrontId): Promise<WotrTokenStory> {
    return {
      type: "token",
      token: "draw-card",
      actions: [await this.cardUi.drawCard(frontId)]
    };
  }

  private async resolvePoliticalAdvanceToken(frontId: WotrFrontId): Promise<WotrTokenStory> {
    const nation = await this.nationUi.politicalAdvance(frontId, "token");
    return {
      type: "token",
      token: "political-advance",
      actions: [advanceNation(nation, 1)]
    };
  }

  private async resolveMoveNazgulMinionsToken(frontId: WotrFrontId): Promise<WotrTokenStory> {
    const nazgulMovements = await this.unitUi.moveNazgulMinions(frontId);
    return {
      type: "token",
      token: "move-nazgul-minions",
      actions: nazgulMovements
    };
  }
}
