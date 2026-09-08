import { Injectable, computed, inject } from '@angular/core';
import { lazyInject, uiEvent } from '@leobg/commons/utils';
import { patchState, signalStore, withState } from '@ngrx/signals';
import type {
  WotrActionChoice,
  WotrActionDie,
  WotrActionToken,
  WotrSpecialActionDieType,
} from '../action-die/wotr-action-die-models';
import type { WotrCardId } from '../card/wotr-card-models';
import type {
  KomeSovereignId,
  WotrCharacterId,
  WotrCompanionId,
} from '../character/wotr-character-models';
import type { WotrAction } from '../commons/wotr-action-models';
import type { WotrElvenRing, WotrFrontId } from '../front/wotr-front-models';
import type { WotrNationId } from '../nation/wotr-nation-models';
import type { WotrPlayerInfo } from '../player/wotr-player-info-models';
import { WotrPlayerInfoStore } from '../player/wotr-player-info-store';
import type { WotrRegionUnitSelection } from '../region/dialog/wotr-region-unit-selection';
import type { WotrRegionId } from '../region/wotr-region-models';
import type {
  WotrRegionUnits,
  WotrReinforcementUnit,
  WotrUnits,
} from '../unit/wotr-unit-models';
import { WotrGameUiContext } from './wotr-game-ui-context';
import type { WotrDieCardStory, WotrDieStory } from './wotr-story-models';

interface WotrGameUiState {
  currentPlayerId: WotrFrontId | null;
  canCancel: boolean;
  message: string | null;
  options: WotrUiOption[] | null;
  regionSelection: WotrRegionId[] | null;
  nationSelection: WotrNationId[] | null;
  elvenRingSelection: WotrElvenRingSelection | null;
  actionBoxSelection: WotrActionBoxSelection | null;
  eyeSelection: boolean;
  reinforcementUnitSelection: WotrReinforcementUnitSelection | null;
  regionUnitSelection: WotrRegionUnitSelection | null;
  handCardSelection: WotrCardSelection | null;
  tableCardSelection: WotrCardSelection | null;
  inputQuantitySelection: WotrInputQuantitySelection | false;
  fellowshipCompanionsSelection: WotrFellowshipCompanionSelection | null;
  sovereignSelection: KomeSovereignId[] | null;
}

export interface WotrElvenRingSelection {
  rings: WotrElvenRing[];
  frontId: WotrFrontId;
}

export interface WotrActionBoxSelection {
  frontId: WotrFrontId;
  tokens: WotrActionToken[];
  specialDice: WotrSpecialActionDieType[];
}

export interface WotrActionDieSelection {
  frontId: WotrFrontId;
  specialDice?: WotrSpecialActionDieType[];
}

export interface WotrActionResolutionSelection {
  frontId: WotrFrontId;
  specialDice?: WotrSpecialActionDieType[];
  tokens?: WotrActionToken[];
  elvenRings?: WotrElvenRing[];
  eyes?: boolean;
}

export interface WotrCardSelection {
  nCards: number;
  frontId: WotrFrontId;
  message: string;
  cards?: WotrCardId[];
}

export interface WotrReinforcementUnitSelection<
  CanPass extends boolean = boolean,
> {
  units: WotrReinforcementUnit[];
  frontId: WotrFrontId;
  canPass: CanPass;
}

export interface WotrFellowshipCompanionSelection {
  companions: WotrCompanionId[];
  singleSelection: boolean;
  nCompanions?: number;
}

export interface WotrInputQuantitySelection {
  min: number;
  max: number;
  default: number;
}

export const initialState: WotrGameUiState = {
  currentPlayerId: null,
  canCancel: false,
  message: null,
  regionSelection: null,
  nationSelection: null,
  elvenRingSelection: null,
  actionBoxSelection: null,
  eyeSelection: false,
  options: null,
  reinforcementUnitSelection: null,
  regionUnitSelection: null,
  handCardSelection: null,
  tableCardSelection: null,
  inputQuantitySelection: false,
  fellowshipCompanionsSelection: null,
  sovereignSelection: null,
};

export interface WotrUiOption<O = unknown> {
  value: O;
  label: string;
  disabled?: boolean;
}

export interface WotrUiChoice<P = WotrFrontId> {
  label(): string;
  isAvailable?(params: P): boolean;
  actions(
    params: P,
    ui: WotrGameUiContext,
  ): WotrAction[] | Promise<WotrAction[]>;
  character?: WotrCharacterId;
  card?: () => WotrCardId | null;
}

export interface WotrUiCharacterChoice extends WotrUiChoice<WotrFrontId> {
  character: WotrCharacterId;
}

@Injectable()
export class WotrGameUi extends signalStore(
  { protectedState: false },
  withState<WotrGameUiState>(initialState),
) {
  private playerInfoStore = inject(WotrPlayerInfoStore);
  private ui = lazyInject(WotrGameUiContext);

  currentPlayer = computed<WotrPlayerInfo | null>(() => {
    const currentPlayerId = this.currentPlayerId();
    return currentPlayerId
      ? this.playerInfoStore.playerMap()[currentPlayerId]
      : null;
  });

  pass = uiEvent<void>();

  cancel = uiEvent<void>();
  setCanCancel(canCancel: boolean) {
    patchState(this, { canCancel });
  }

  private updateUi<
    S extends WotrGameUiState & {
      [K in keyof S]: K extends keyof WotrGameUiState
        ? WotrGameUiState[K]
        : never;
    },
  >(updater: (state: WotrGameUiState) => S) {
    patchState(this, updater);
  }

  async askContinue(message: string): Promise<void> {
    await this.askOption<null>(message, [{ value: null, label: message }]);
  }

  async askConfirm(
    message: string,
    yesLabel: string,
    noLabel: string,
  ): Promise<boolean> {
    return this.askOption<boolean>(message, [
      { value: true, label: yesLabel },
      { value: false, label: noLabel },
    ]);
  }

  inputQuantity = uiEvent<number>();
  async askQuantity(
    message: string,
    selection: WotrInputQuantitySelection,
  ): Promise<number> {
    this.updateUi((s) => ({
      ...s,
      message,
      inputQuantitySelection: selection,
    }));
    const quantity = await this.inputQuantity.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      inputQuantitySelection: false,
    }));
    return quantity;
  }

  region = uiEvent<WotrRegionId>();
  async askRegion(
    message: string,
    regionSelection: WotrRegionId[],
  ): Promise<WotrRegionId> {
    this.updateUi((s) => ({ ...s, message, regionSelection }));
    const region = await this.region.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      regionSelection: null,
    }));
    return region;
  }

  handCards = uiEvent<WotrCardId[]>();
  async askHandCards(
    message: string,
    cardSelection: WotrCardSelection,
  ): Promise<WotrCardId[]> {
    this.updateUi((s) => ({ ...s, message, handCardSelection: cardSelection }));
    const cards = await this.handCards.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      handCardSelection: null,
    }));
    return cards;
  }
  async askHandCard(
    message: string,
    cardSelection: WotrCardSelection,
  ): Promise<WotrCardId> {
    this.updateUi((s) => ({ ...s, message, handCardSelection: cardSelection }));
    const cards = await this.handCards.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      handCardSelection: null,
    }));
    return cards[0];
  }

  tableCard = uiEvent<WotrCardId>();
  async askTableCard(
    message: string,
    cardSelection: WotrCardSelection,
  ): Promise<WotrCardId> {
    this.updateUi((s) => ({
      ...s,
      message,
      tableCardSelection: cardSelection,
    }));
    const card = await this.tableCard.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      tableCardSelection: null,
    }));
    return card;
  }

  nation = uiEvent<WotrNationId>();
  async askNation(
    message: string,
    nationSelection: WotrNationId[],
  ): Promise<WotrNationId> {
    this.updateUi((s) => ({ ...s, message, nationSelection }));
    const nation = await this.nation.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      nationSelection: null,
    }));
    return nation;
  }

  elvenRing = uiEvent<WotrElvenRing>();
  async askElvenRing(
    message: string,
    elvenRingSelection: WotrElvenRingSelection,
  ): Promise<WotrElvenRing> {
    this.updateUi((s) => ({ ...s, message, elvenRingSelection }));
    const elvenRing = await this.elvenRing.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      elvenRingSelection: null,
    }));
    return elvenRing;
  }

  actionDieChoice = uiEvent<WotrActionDie>();
  actionTokenChoice = uiEvent<WotrActionToken>();
  eyeChoice = uiEvent<void>();

  async askActionDie(
    message: string,
    params: WotrActionDieSelection,
  ): Promise<WotrActionDie> {
    const actionBoxSelection: WotrActionBoxSelection = {
      frontId: params.frontId,
      tokens: [],
      specialDice: params.specialDice ?? [],
    };
    this.updateUi((s) => ({
      ...s,
      message,
      actionBoxSelection,
    }));
    const actionDie = await this.actionDieChoice.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      actionBoxSelection: null,
    }));
    return actionDie;
  }

  async askActionResolution(
    message: string,
    params: WotrActionResolutionSelection,
  ): Promise<WotrActionChoice> {
    const actionBoxSelection: WotrActionBoxSelection = {
      frontId: params.frontId,
      tokens: params.tokens ?? [],
      specialDice: params.specialDice ?? [],
    };
    this.updateUi((s) => {
      s = {
        ...s,
        message,
        actionBoxSelection,
      };
      if (params.elvenRings)
        s.elvenRingSelection = {
          frontId: params.frontId,
          rings: params.elvenRings,
        };
      if (params.eyes) s.eyeSelection = true;
      return s;
    });
    const actionDieOrTokenOrElvenRing = await Promise.race([
      this.actionDieChoice
        .get()
        // eslint-disable-next-line unicorn/prefer-await
        .then<WotrActionChoice>((die) => ({ type: 'die', die })),
      this.actionTokenChoice
        .get()
        // eslint-disable-next-line unicorn/prefer-await
        .then<WotrActionChoice>((token) => ({ type: 'token', token })),
      this.elvenRing
        .get()
        // eslint-disable-next-line unicorn/prefer-await
        .then<WotrActionChoice>((ring) => ({ type: 'elvenRing', ring })),
      // eslint-disable-next-line unicorn/prefer-await
      this.eyeChoice.get().then<WotrActionChoice>(() => ({ type: 'eye' })),
    ]);
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      actionBoxSelection: null,
      elvenRingSelection: null,
      eyeSelection: false,
    }));
    return actionDieOrTokenOrElvenRing;
  }

  async askActionDieOrStop(
    message: string,
    stopMessage: string,
    actionDieSelection: WotrActionDieSelection,
  ): Promise<WotrActionDie | 'stop'> {
    const actionBoxSelection: WotrActionBoxSelection = {
      frontId: actionDieSelection.frontId,
      tokens: [],
      specialDice: actionDieSelection.specialDice ?? [],
    };
    this.updateUi((s) => ({
      ...s,
      message,
      actionBoxSelection,
      options: [{ value: 'stop', label: stopMessage }],
    }));
    const actionDieOrStop = await Promise.race([
      this.actionDieChoice
        .get()
        // eslint-disable-next-line unicorn/prefer-await
        .then<WotrActionChoice>((die) => ({ type: 'die', die })),
      this.option.get(),
    ]);
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      actionBoxSelection: null,
      options: null,
    }));
    if ('type' in actionDieOrStop && actionDieOrStop.type === 'die') {
      return actionDieOrStop.die;
    }
    if ('value' in actionDieOrStop && actionDieOrStop.value === 'stop') {
      return 'stop';
    }
    throw new Error('Invalid action die or stop selection');
  }

  sovereign = uiEvent<KomeSovereignId>();
  async askSovereign(
    message: string,
    sovereigns: KomeSovereignId[],
  ): Promise<KomeSovereignId> {
    this.updateUi((s) => ({ ...s, message, sovereignSelection: sovereigns }));
    const sovereign = await this.sovereign.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      sovereignSelection: null,
    }));
    return sovereign;
  }

  option = uiEvent<WotrUiOption>();
  async askOption<O>(message: string, options: WotrUiOption<O>[]): Promise<O> {
    this.updateUi((s) => ({ ...s, message, options: options }));
    const option = await this.option.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      options: null,
    }));
    return option.value as O;
  }

  async askOptionOrElvenRing<O>(
    message: string,
    options: WotrUiOption<O>[],
    elvenRingSelection: WotrElvenRingSelection | null,
  ): Promise<O | WotrElvenRing> {
    this.updateUi((s) => ({
      ...s,
      message,
      options: options,
      elvenRingSelection,
    }));
    const optionOrElvenRing = await Promise.race([
      // eslint-disable-next-line unicorn/prefer-await
      this.option.get().then((o) => o.value as O),
      this.elvenRing.get(),
    ]);
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      options: null,
      elvenRingSelection: null,
    }));
    return optionOrElvenRing;
  }

  reinforcementUnit = uiEvent<WotrReinforcementUnit>();
  async askReinforcementUnit<CanPass extends boolean = boolean>(
    message: string,
    reinforcementUnitSelection: WotrReinforcementUnitSelection<CanPass>,
  ): Promise<WotrReinforcementUnit | (CanPass extends true ? false : never)> {
    const options: WotrUiOption<boolean>[] = [];
    if (reinforcementUnitSelection.canPass) {
      options.push({ value: false, label: 'Pass' });
    }
    this.updateUi((s) => ({
      ...s,
      message,
      reinforcementUnitSelection,
      options: options?.length ? options : null,
    }));
    const choice = await Promise.race([
      this.reinforcementUnit.get(),
      this.option.get(),
    ]);
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      reinforcementUnitSelection: null,
      options: null,
    }));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
    return 'value' in choice ? (false as any) : choice;
  }

  regionUnits = uiEvent<WotrRegionUnits>();
  async askRegionUnits(
    message: string,
    unitSelection: WotrRegionUnitSelection,
  ): Promise<WotrRegionUnits> {
    this.updateUi((s) => ({
      ...s,
      message,
      regionUnitSelection: unitSelection,
    }));
    const regionUnits = await this.regionUnits.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      regionUnitSelection: null,
      regionSelection: null,
    }));
    return regionUnits;
  }

  casualtyUnits = uiEvent<{ downgrading: WotrUnits; removing: WotrUnits }>();
  async askCasualtyUnits(
    message: string,
    unitSelection: WotrRegionUnitSelection,
  ): Promise<{ downgrading: WotrUnits; removing: WotrUnits }> {
    this.updateUi((s) => ({
      ...s,
      message,
      regionUnitSelection: unitSelection,
    }));
    const casualtyUnits = await this.casualtyUnits.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      regionUnitSelection: null,
    }));
    return casualtyUnits;
  }

  fellowshipCompanions = uiEvent<WotrCompanionId[]>();
  async askFellowshipCompanions(
    message: string,
    fellowshipCompanionsSelection: WotrFellowshipCompanionSelection,
  ): Promise<WotrCompanionId[]> {
    this.updateUi((s) => ({
      ...s,
      message,
      fellowshipCompanionsSelection,
    }));
    const companions = await this.fellowshipCompanions.get();
    this.updateUi((s) => ({
      ...s,
      message: null,
      canCancel: true,
      fellowshipCompanionsSelection: null,
    }));
    return companions;
  }

  async askChoice<P = WotrFrontId>(
    message: string,
    choices: WotrUiChoice<P>[],
    params: P,
  ): Promise<WotrAction[]> {
    const choice = await this.askOption<WotrUiChoice<P>>(
      message,
      choices.map((c) => ({
        value: c,
        label: c.label(),
        disabled: c.isAvailable ? !c.isAvailable(params) : false,
      })),
    );
    return choice.actions(params, this.ui);
  }

  async askDieStoryChoice<P = WotrFrontId>(
    die: WotrActionDie,
    message: string,
    choices: WotrUiChoice<P>[],
    params: P,
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choice = await this.askOption<WotrUiChoice<P>>(
      message,
      choices.map((c) => ({
        value: c,
        label: c.label(),
        disabled: c.isAvailable ? !c.isAvailable(params) : false,
      })),
    );
    const actions = await choice.actions(params, this.ui);
    const card = choice.card ? choice.card() : null;
    if (card) {
      const story: WotrDieCardStory = {
        type: 'die-card',
        die,
        actions,
        card,
      };
      return story;
    }
    const story: WotrDieStory = {
      type: 'die',
      die,
      actions,
    };
    if (choice.character) story.character = choice.character;
    return story;
  }

  resetUi(turnPlayer: WotrFrontId) {
    this.updateUi((s) => ({
      ...initialState,
      message: `${this.playerInfoStore.player(turnPlayer).name} is thinking...`,
      canCancel: false,
      currentPlayerId: s.currentPlayerId,
    }));
  }

  player = uiEvent<WotrFrontId | null>();
  setCurrentPlayerId(playerId: WotrFrontId | null) {
    this.player.emit(playerId);
    patchState(this, { currentPlayerId: playerId });
  }
}
