import { inject, Injectable } from '@angular/core';
import { randomUtil } from '@leobg/commons/utils';
import type { WotrCardId } from '../card/wotr-card-models';
import type { WotrAction } from '../commons/wotr-action-models';
import type { WotrFrontId } from '../front/wotr-front-models';
import { WotrGameQuery } from '../game/wotr-game-query';
import type {
  WotrActionResolutionSelection,
  WotrUiChoice,
} from '../game/wotr-game-ui';
import { WotrGameUiContext } from '../game/wotr-game-ui-context';
import type {
  WotrDieCardStory,
  WotrDieStory,
  WotrElvenRingAction,
  WotrPassStory,
  WotrStory,
  WotrTokenStory,
} from '../game/wotr-story-models';
import { advanceNation } from '../nation/wotr-nation-actions';
import { KomeActionDieRules } from './kome-action-die-rules';
import {
  discardDice,
  rollActionDice,
  skipActionDie,
} from './wotr-action-die-actions';
import { WotrActionDieHandler } from './wotr-action-die-handler';
import type {
  WotrActionDie,
  WotrActionDieResult,
  WotrActionToken,
} from './wotr-action-die-models';
import { WotrActionDieModifiers } from './wotr-action-die-modifiers';
import { WotrActionDieRules } from './wotr-action-die-rules';

@Injectable()
export class WotrActionDieUi {
  private actionDieRules = inject(WotrActionDieRules);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private q = inject(WotrGameQuery);
  private komeRules = inject(KomeActionDieRules);
  private actionDieHandler = inject(WotrActionDieHandler);
  private ui = inject(WotrGameUiContext);

  async rollActionDice(frontId: WotrFrontId): Promise<WotrAction> {
    const nActionDice = this.actionDieRules.rollableActionDice(frontId);
    const canRollRulerDie = this.actionDieRules.canRollRulerDie(frontId);
    await this.ui.askContinue(
      `Roll ${nActionDice} action dice${canRollRulerDie ? ' and a Ruler die' : ''}`,
    );
    const actionDice: WotrActionDie[] = [];
    for (let i = 0; i < nActionDice; i++) {
      actionDice.push(this.rollActionDie(frontId));
    }
    if (canRollRulerDie)
      actionDice.push({ type: 'ruler', result: this.rollActionDie(frontId) });
    return rollActionDice(...actionDice);
  }

  private FREE_PEOPLES_ACTION_DIE_RESULTS: WotrActionDieResult[] = [
    'character',
    'character',
    'muster',
    'event',
    'muster-army',
    'will-of-the-west',
  ];

  private SHADOW_ACTION_DIE_RESULTS: WotrActionDieResult[] = [
    'character',
    'army',
    'event',
    'muster',
    'muster-army',
    'eye',
  ];

  private rollActionDie(frontId: WotrFrontId): WotrActionDieResult {
    switch (frontId) {
      case 'free-peoples':
        return randomUtil.getRandomDraws(
          1,
          this.FREE_PEOPLES_ACTION_DIE_RESULTS,
        )[0];
      case 'shadow':
        return randomUtil.getRandomDraws(1, this.SHADOW_ACTION_DIE_RESULTS)[0];
    }
  }

  async actionResolution(
    frontId: WotrFrontId,
    elvenRing: WotrElvenRingAction | null,
  ): Promise<WotrStory> {
    const canSkipTokens = this.q.front(frontId).canSkipTokens();
    if (canSkipTokens) {
      const skipTokens = await this.ui.askConfirm(
        'Do you want to skip action tokens?',
        'Skip action tokens',
        'Play action token',
      );
      if (skipTokens) {
        return { type: 'token-skip' };
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
    elvenRing: WotrElvenRingAction | null,
  ): Promise<WotrStory | null> {
    const availableRings = this.q.front(frontId).playableElvenRings();
    const pass = await this.ui.askOptionOrElvenRing<'S' | 'P'>(
      'Do you want to pass?',
      [
        { label: 'Pass', value: 'S' },
        { label: 'Play action die', value: 'P' },
      ],
      { frontId, rings: availableRings },
    );
    switch (pass) {
      case 'S': {
        const diePass: WotrPassStory = { type: 'die-pass' };
        if (elvenRing) diePass.elvenRing = elvenRing;
        return diePass;
      }
      case 'P':
        return null;
      default: {
        const elvenRingAction = await this.ui.frontUi.useElvenRing(
          pass,
          frontId,
        );
        return this.actionResolution(frontId, elvenRingAction);
      }
    }
  }

  private async askAndResolveActionDie(
    frontId: WotrFrontId,
    elvenRing: WotrElvenRingAction | null,
  ): Promise<WotrStory> {
    const playableTokens = this.actionDieRules.playableTokens(frontId);
    const availableRings = this.q.front(frontId).playableElvenRings();
    const params: WotrActionResolutionSelection = {
      frontId,
      tokens: playableTokens,
      elvenRings: availableRings,
      specialDice: ['ruler'],
    };
    if (this.q.kome() && this.komeRules.canInitiateCorruptionAttempt(frontId))
      params.eyes = true;
    const actionChoice = await this.ui.askActionResolution(
      'Choose an action die to resolve',
      params,
    );
    switch (actionChoice.type) {
      case 'die': {
        this.actionDieHandler.setCurrentActionDie(actionChoice.die, frontId);
        const dieStory = await this.resolveActionDie(actionChoice.die, frontId);
        if (elvenRing) dieStory.elvenRing = elvenRing;
        return dieStory;
      }
      case 'token': {
        this.actionDieHandler.setCurrentActionToken(
          actionChoice.token,
          frontId,
        );
        const tokenStory = await this.resolveActionToken(
          actionChoice.token,
          frontId,
        );
        if (elvenRing) tokenStory.elvenRing = elvenRing;
        return tokenStory;
      }
      case 'elvenRing': {
        const elvenRingAction = await this.ui.frontUi.useElvenRing(
          actionChoice.ring,
          frontId,
        );
        return this.askAndResolveActionDie(frontId, elvenRingAction);
      }
      case 'eye':
        return this.resolveEyeDie(frontId);
    }
  }

  private resolveActionDie(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const result: WotrActionDieResult =
      typeof die === 'string' ? die : die.result;
    switch (result) {
      case 'event':
        return this.resolveEventDie(die, frontId);
      case 'army':
        return this.resolveArmyDie(die, frontId);
      case 'character':
        return this.resolveCharacterDie(die, frontId);
      case 'muster':
        return this.resolveMusterDie(die, frontId);
      case 'muster-army':
        return this.resolveMusterArmyDie(die, frontId);
      case 'will-of-the-west':
        return this.resolveWillOfTheWestDie(die, frontId);
      case 'eye':
        throw new Error('Eye die resolution is unexpected.');
    }
  }

  private async resolveArmyDie(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveArmyResult(die, frontId);
  }

  async resolveArmyResult(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.ui.askDieStoryChoice(
      die,
      'Choose an action for the army die',
      [
        this.ui.unitUi.moveArmiesChoice,
        this.ui.unitUi.attackArmyChoice,
        this.ui.cardPlayUi.playEventCardChoice(['army']),
        ...this.actionDieModifiers.getActionDieChoices(die, frontId),
        this.skipDieChoice('event'),
      ],
      frontId,
    );
  }

  private async resolveCharacterDie(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveCharacterResult(die, frontId);
  }

  private async resolveCharacterResult(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.ui.unitUi.leaderArmyMoveChoice,
      this.ui.unitUi.leaderArmyAttackChoice,
      this.ui.cardPlayUi.playEventCardChoice(['character']),
    ];
    if (frontId === 'free-peoples') {
      choices.push(
        this.ui.fellowshipUi.progressChoice,
        this.ui.fellowshipUi.hideFellowshipChoice,
        this.ui.fellowshipUi.separateCompanionsChoice,
        this.ui.characterUi.moveCompanionsChoice,
      );
    } else {
      choices.push(this.ui.characterUi.moveMinionsChoice);
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice(die));
    return this.ui.askDieStoryChoice(
      die,
      'Choose an action for the character die',
      choices,
      frontId,
    );
  }

  private async resolveMusterDie(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveMusterResult(die, frontId);
  }

  private async resolveMusterResult(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.ui.nationUi.diplomaticActionChoice(die),
      this.ui.cardPlayUi.playEventCardChoice(['muster']),
      this.ui.unitUi.recruitReinforcementsChoice,
    ];
    if (frontId === 'shadow') {
      choices.push(this.ui.characterUi.bringCharacterIntoPlayChoice('muster'));
    } else {
      if (this.q.kome())
        choices.push(this.ui.characterUi.awakeSovereignChoice('muster'));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice('muster'));
    return this.ui.askDieStoryChoice(
      die,
      'Choose an action for the muster die',
      choices,
      frontId,
    );
  }

  private async resolveMusterArmyDie(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.ui.nationUi.diplomaticActionChoice('muster-army'),
      this.ui.unitUi.moveArmiesChoice,
      this.ui.unitUi.attackArmyChoice,
      this.ui.cardPlayUi.playEventCardChoice(['muster', 'army']),
      this.ui.unitUi.recruitReinforcementsChoice,
    ];
    if (frontId === 'shadow') {
      choices.push(this.ui.characterUi.bringCharacterIntoPlayChoice('muster'));
    } else {
      if (this.q.kome())
        choices.push(this.ui.characterUi.awakeSovereignChoice('muster'));
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice('muster-army'));
    return this.ui.askDieStoryChoice(
      die,
      'Choose an action for the muster-army die',
      choices,
      frontId,
    );
  }

  private async resolveWillOfTheWestDie(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choices: WotrUiChoice[] = [
      this.changeCharacterDieChoice(die),
      this.changeArmyDieChoice(die),
      this.changeMusterDieChoice(die),
      this.changeEventDieChoice(die),
    ];
    if (frontId === 'free-peoples') {
      choices.push(
        this.ui.characterUi.bringCharacterIntoPlayChoice('will-of-the-west'),
      );
    }
    choices.push(...this.actionDieModifiers.getActionDieChoices(die, frontId));
    choices.push(this.skipDieChoice(die));
    return this.ui.askDieStoryChoice(
      die,
      'Choose an action for the Will of the West die',
      choices,
      frontId,
    );
  }

  private changeCharacterDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => 'Character result',
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveCharacterResult(die, frontId);
        if (story.type === 'die-card') chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId,
    };
  }

  private changeArmyDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => 'Army result',
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveArmyResult(die, frontId);
        if (story.type === 'die-card') chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId,
    };
  }

  private changeMusterDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => 'Muster result',
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveMusterResult(die, frontId);
        if (story.type === 'die-card') chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId,
    };
  }

  private changeEventDieChoice(die: WotrActionDie): WotrUiChoice {
    let chosenCardId: WotrCardId | null = null;
    return {
      label: () => 'Event result',
      actions: async (frontId: WotrFrontId) => {
        const story = await this.resolveEventResult(die, frontId);
        if (story.type === 'die-card') chosenCardId = story.card;
        return story.actions;
      },
      card: () => chosenCardId,
    };
  }

  private skipDieChoice(die: WotrActionDie): WotrUiChoice {
    return {
      label: () => 'Skip the action die',
      actions: () => [skipActionDie(die)],
    };
  }

  private async resolveEventDie(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.resolveEventResult(die, frontId);
  }

  async resolveEventResult(
    die: WotrActionDie,
    frontId: WotrFrontId,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    return this.ui.askDieStoryChoice(
      die,
      'Choose an action for the event die',
      [
        this.ui.cardDrawUi.drawEventCardChoice,
        this.ui.cardPlayUi.playEventCardChoice('any'),
        ...this.actionDieModifiers.getActionDieChoices(die, frontId),
        this.skipDieChoice('event'),
      ],
      frontId,
    );
  }

  private async resolveActionToken(
    token: WotrActionToken,
    frontId: WotrFrontId,
  ): Promise<WotrTokenStory> {
    switch (token) {
      case 'draw-card':
        return this.resolveDrawCardToken(frontId);
      case 'political-advance':
        return this.resolvePoliticalAdvanceToken(frontId);
      case 'move-nazgul-minions':
        return this.resolveMoveNazgulMinionsToken();
    }
  }

  private async resolveDrawCardToken(
    frontId: WotrFrontId,
  ): Promise<WotrTokenStory> {
    return {
      type: 'token',
      token: 'draw-card',
      actions: [await this.ui.cardDrawUi.drawCard(frontId)],
    };
  }

  private async resolvePoliticalAdvanceToken(
    frontId: WotrFrontId,
  ): Promise<WotrTokenStory> {
    const nation = await this.ui.nationUi.politicalAdvance(frontId, 'token');
    return {
      type: 'token',
      token: 'political-advance',
      actions: [advanceNation(nation, 1)],
    };
  }

  private async resolveMoveNazgulMinionsToken(): Promise<WotrTokenStory> {
    const nazgulMovements = await this.ui.characterUi.moveNazgulAndMinions();
    return {
      type: 'token',
      token: 'move-nazgul-minions',
      actions: nazgulMovements,
    };
  }

  private async resolveEyeDie(frontId: WotrFrontId): Promise<WotrStory> {
    return this.ui.askDieStoryChoice(
      'eye',
      'Choose an action for the eye die',
      [this.ui.huntUi.corruptionAttemptChoice],
      frontId,
    );
  }

  async makeRulerDieChoice(frontId: WotrFrontId): Promise<WotrAction> {
    const die = await this.ui.askActionDie('Choose a die to discard', {
      frontId,
      specialDice: ['ruler'],
    });
    return discardDice(frontId, die);
  }
}
