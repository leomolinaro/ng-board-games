import { inject, Injectable } from "@angular/core";
import { randomUtil } from "@leobg/commons/utils";
import { WotrCardDrawUi } from "../card/wotr-card-draw-ui";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCardPlayUi } from "../card/wotr-card-play-ui";
import { WotrCharacterUi } from "../character/wotr-character-ui";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontUi } from "../front/wotr-front-ui";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrActionResolutionSelection, WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import {
  WotrDieCardStory,
  WotrDieStory,
  WotrElvenRingAction,
  WotrPassStory,
  WotrStory,
  WotrTokenStory
} from "../game/wotr-story-models";
import { WotrHuntUi } from "../hunt/wotr-hunt-ui";
import { advanceNation } from "../nation/wotr-nation-actions";
import { WotrNationUi } from "../nation/wotr-nation-ui";
import { WotrUnitUi } from "../unit/wotr-unit-ui";
import { KomeActionDieRules } from "./kome-action-die-rules";
import { discardDice, rollActionDice, skipActionDie } from "./wotr-action-die-actions";
import { WotrActionDieHandler } from "./wotr-action-die-handler";
import { WotrActionDie, WotrActionDieResult, WotrActionToken } from "./wotr-action-die-models";
import { WotrActionDieModifiers } from "./wotr-action-die-modifiers";
import { WotrActionDieRules } from "./wotr-action-die-rules";

@Injectable()
export class WotrActionDieUi {
  private actionDieRules = inject(WotrActionDieRules);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private ui = inject(WotrGameUi);
  private characterUi = inject(WotrCharacterUi);
  private unitUi = inject(WotrUnitUi);
  private cardUi = inject(WotrCardDrawUi);
  private cardPlayUi = inject(WotrCardPlayUi);
  private nationUi = inject(WotrNationUi);
  private huntUi = inject(WotrHuntUi);
  private fellowshipUi = inject(WotrFellowshipUi);
  private q = inject(WotrGameQuery);
  private frontUi = inject(WotrFrontUi);
  private komeRules = inject(KomeActionDieRules);
  private actionDieHandler = inject(WotrActionDieHandler);

  async rollActionDice(frontId: WotrFrontId): Promise<WotrAction> {
    const nActionDice = this.actionDieRules.rollableActionDice(frontId);
    const canRollRulerDie = this.actionDieRules.canRollRulerDie(frontId);
    await this.ui.askContinue(
      `Roll ${nActionDice} action dice${canRollRulerDie ? " and a Ruler die" : ""}`
    );
    const actionDice: WotrActionDie[] = [];
    for (let i = 0; i < nActionDice; i++) {
      actionDice.push(this.rollActionDie(frontId));
    }
    if (canRollRulerDie) actionDice.push({ type: "ruler", result: this.rollActionDie(frontId) });
    return rollActionDice(...actionDice);
  }

  private FREE_PEOPLES_ACTION_DIE_RESULTS: WotrActionDieResult[] = [
    "character",
    "character",
    "muster",
    "event",
    "muster-army",
    "will-of-the-west"
  ];

  private SHADOW_ACTION_DIE_RESULTS: WotrActionDieResult[] = [
    "character",
    "army",
    "event",
    "muster",
    "muster-army",
    "eye"
  ];

  private rollActionDie(frontId: WotrFrontId): WotrActionDieResult {
    switch (frontId) {
      case "free-peoples":
        return randomUtil.getRandomDraws(1, this.FREE_PEOPLES_ACTION_DIE_RESULTS)[0];
      case "shadow":
        return randomUtil.getRandomDraws(1, this.SHADOW_ACTION_DIE_RESULTS)[0];
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
    const params: WotrActionResolutionSelection = {
      frontId,
      tokens: playableTokens,
      elvenRings: availableRings,
      specialDice: ["ruler"]
    };
    if (this.q.kome() && this.komeRules.canInitiateCorruptionAttempt(frontId)) params.eyes = true;
    const actionChoice = await this.ui.askActionResolution(
      "Choose an action die to resolve",
      params
    );
    switch (actionChoice.type) {
      case "die": {
        this.actionDieHandler.setCurrentActionDie(actionChoice.die, frontId);
        const dieStory = await this.resolveActionDie(actionChoice.die, frontId);
        if (elvenRing) dieStory.elvenRing = elvenRing;
        return dieStory;
      }
      case "token": {
        this.actionDieHandler.setCurrentActionToken(actionChoice.token, frontId);
        const tokenStory = await this.resolveActionToken(actionChoice.token, frontId);
        if (elvenRing) tokenStory.elvenRing = elvenRing;
        return tokenStory;
      }
      case "elvenRing": {
        const elvenRingAction = await this.frontUi.useElvenRing(actionChoice.ring, frontId);
        return this.askAndResolveActionDie(frontId, elvenRingAction);
      }
      case "eye":
        return this.resolveEyeDie(frontId);
    }
  }

  private resolveActionDie(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const result: WotrActionDieResult = typeof die === "string" ? die : die.result;
    switch (result) {
      case "event":
        return this.resolveEventDie(die, frontId);
      case "army":
        return this.resolveArmyDie(die, frontId);
      case "character":
        return this.resolveCharacterDie(die, frontId);
      case "muster":
        return this.resolveMusterDie(die, frontId);
      case "muster-army":
        return this.resolveMusterArmyDie(die, frontId);
      case "will-of-the-west":
        return this.resolveWillOfTheWestDie(die, frontId);
      case "eye":
        throw new Error("Eye die resolution is unexpected.");
    }
  }

  private async resolveArmyDie(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveArmyResult(die, frontId);
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
        ...this.actionDieModifiers.getActionDieChoices(die, frontId),
        this.skipDieChoice("event")
      ],
      frontId
    );
  }

  private async resolveCharacterDie(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveCharacterResult(die, frontId);
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
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice(die));
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the character die",
      choices,
      frontId
    );
  }

  private async resolveMusterDie(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveMusterResult(die, frontId);
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
    } else {
      if (this.q.kome()) choices.push(this.characterUi.awakeSovereignChoice("muster"));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice("muster"));
    return this.ui.askDieStoryChoice(die, "Choose an action for the muster die", choices, frontId);
  }

  private async resolveMusterArmyDie(
    die: WotrActionDie,
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
    } else {
      if (this.q.kome()) choices.push(this.characterUi.awakeSovereignChoice("muster"));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice("muster-army"));
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the muster-army die",
      choices,
      frontId
    );
  }

  private async resolveWillOfTheWestDie(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.changeCharacterDieChoice(die),
      this.changeArmyDieChoice(die),
      this.changeMusterDieChoice(die),
      this.changeEventDieChoice(die)
    ];
    if (frontId === "free-peoples") {
      choices.push(this.characterUi.bringCharacterIntoPlayChoice("will-of-the-west"));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice(die));
    return this.ui.askDieStoryChoice(
      die,
      "Choose an action for the Will of the West die",
      choices,
      frontId
    );
  }

  private changeCharacterDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Character result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveCharacterResult(die, frontId);
        if (story.type === "die-card") chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId
    };
  }

  private changeArmyDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Army result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveArmyResult(die, frontId);
        if (story.type === "die-card") chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId
    };
  }

  private changeMusterDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Muster result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveMusterResult(die, frontId);
        if (story.type === "die-card") chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId
    };
  }

  private changeEventDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => "Event result",
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveEventResult(die, frontId);
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

  private async resolveEventDie(
    die: WotrActionDie,
    frontId: WotrFrontId
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveEventResult(die, frontId);
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
        ...this.actionDieModifiers.getActionDieChoices(die, frontId),
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
    const nazgulMovements = await this.characterUi.moveNazgulAndMinions();
    return {
      type: "token",
      token: "move-nazgul-minions",
      actions: nazgulMovements
    };
  }

  private async resolveEyeDie(frontId: WotrFrontId): Promise<WotrStory> {
    return this.ui.askDieStoryChoice(
      "eye",
      "Choose an action for the eye die",
      [this.huntUi.corruptionAttemptChoice],
      frontId
    );
  }

  async makeRulerDieChoice(frontId: WotrFrontId): Promise<WotrAction> {
    const die = await this.ui.askActionDie("Choose a die to discard", {
      frontId,
      specialDice: ["ruler"]
    });
    return discardDice(frontId, die);
  }
}
