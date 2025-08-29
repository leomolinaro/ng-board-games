import { Injectable, computed, inject } from "@angular/core";
import { uiEvent } from "@leobg/commons/utils";
import { patchState, signalStore, withState } from "@ngrx/signals";
import {
  WotrActionChoice,
  WotrActionDie,
  WotrActionToken
} from "../action-die/wotr-action-die-models";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId, WotrCompanionId } from "../character/wotr-character-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrPlayerInfo } from "../player/wotr-player-info-models";
import { WotrPlayerInfoStore } from "../player/wotr-player-info-store";
import {
  WotrChooseCasualtiesUnitSelection,
  WotrRegionUnitSelection
} from "../region/dialog/wotr-region-unit-selection";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionUnits, WotrReinforcementUnit, WotrUnits } from "../unit/wotr-unit-models";
import { WotrDieCardStory, WotrDieStory } from "./wotr-story-models";

interface WotrGameUiState {
  currentPlayerId: WotrFrontId | null;
  canCancel: boolean;
  message: string | null;
  options: WotrUiOption[] | null;
  regionSelection: WotrRegionId[] | null;
  nationSelection: WotrNationId[] | null;
  actionDieSelection: WotrActionDieSelection | null;
  reinforcementUnitSelection: WotrReinforcementUnitSelection | null;
  regionUnitSelection: WotrRegionUnitSelection | null;
  cardSelection: WotrCardSelection | null;
  inputQuantitySelection: WotrInputQuantitySelection | false;
  fellowshipCompanionsSelection: WotrFellowshipCompanionSelection | null;
}

export interface WotrActionDieSelection {
  frontId: WotrFrontId;
  tokens: WotrActionToken[];
}

export interface WotrCardSelection {
  nCards: number;
  frontId: WotrFrontId;
  message: string;
  cards?: WotrCardId[];
}

export interface WotrReinforcementUnitSelection {
  units: WotrReinforcementUnit[];
  frontId: WotrFrontId;
  canPass: boolean;
}

export interface WotrFellowshipCompanionSelection {
  companions: WotrCompanionId[];
  singleSelection: boolean;
}

export interface WotrInputQuantitySelection {
  min: number;
  max: number;
  default: number;
}

export interface WotrPlayerUiState {}

export const initialState: WotrGameUiState = {
  currentPlayerId: null,
  canCancel: false,
  message: null,
  regionSelection: null,
  nationSelection: null,
  actionDieSelection: null,
  options: null,
  reinforcementUnitSelection: null,
  regionUnitSelection: null,
  cardSelection: null,
  inputQuantitySelection: false,
  fellowshipCompanionsSelection: null
};

export interface WotrUiOption<O = unknown> {
  value: O;
  label: string;
  disabled?: boolean;
}

export interface WotrUiChoice<P = WotrFrontId> {
  label(): string;
  isAvailable?(params: P): boolean;
  actions(params: P): Promise<WotrAction[]>;
  character?: WotrCharacterId;
  card?: () => WotrCardId;
}

export interface WotrUiCharacterChoice extends WotrUiChoice<WotrFrontId> {
  character: WotrCharacterId;
}

@Injectable({ providedIn: "root" })
export class WotrGameUi extends signalStore(
  { protectedState: false },
  withState<WotrGameUiState>(initialState)
) {
  private playerInfoStore = inject(WotrPlayerInfoStore);

  currentPlayer = computed<WotrPlayerInfo | null>(() => {
    const currentPlayerId = this.currentPlayerId();
    if (currentPlayerId) {
      return this.playerInfoStore.playerMap()[currentPlayerId];
    } else {
      return null;
    }
  });

  pass = uiEvent<void>();

  cancel = uiEvent<void>();
  setCanCancel(canCancel: boolean) {
    patchState(this, { canCancel });
  }

  private updateUi<
    S extends WotrGameUiState & {
      [K in keyof S]: K extends keyof WotrGameUiState ? WotrGameUiState[K] : never;
    }
  >(updater: (state: WotrGameUiState) => S) {
    patchState(this, updater);
  }

  async askContinue(message: string): Promise<void> {
    await this.askOption<null>(message, [{ value: null, label: message }]);
  }

  async askConfirm(message: string, yesLabel: string, noLabel: string): Promise<boolean> {
    return this.askOption<boolean>(message, [
      { value: true, label: yesLabel },
      { value: false, label: noLabel }
    ]);
  }

  inputQuantity = uiEvent<number>();
  async askQuantity(message: string, selection: WotrInputQuantitySelection): Promise<number> {
    this.updateUi(s => ({ ...s, message, inputQuantitySelection: selection }));
    const quantity = await this.inputQuantity.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, inputQuantitySelection: false }));
    return quantity;
  }

  region = uiEvent<WotrRegionId>();
  async askRegion(message: string, regionSelection: WotrRegionId[]): Promise<WotrRegionId> {
    this.updateUi(s => ({ ...s, message, regionSelection }));
    const region = await this.region.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, regionSelection: null }));
    return region;
  }

  cards = uiEvent<WotrCardId[]>();
  async askCards(message: string, cardSelection: WotrCardSelection): Promise<WotrCardId[]> {
    this.updateUi(s => ({ ...s, message, cardSelection }));
    const cards = await this.cards.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, cardSelection: null }));
    return cards;
  }
  async askCard(message: string, cardSelection: WotrCardSelection): Promise<WotrCardId> {
    this.updateUi(s => ({ ...s, message, cardSelection }));
    const cards = await this.cards.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, cardSelection: null }));
    return cards[0];
  }

  nation = uiEvent<WotrNationId>();
  async askNation(message: string, nationSelection: WotrNationId[]): Promise<WotrNationId> {
    this.updateUi(s => ({ ...s, message, nationSelection }));
    const nation = await this.nation.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, nationSelection: null }));
    return nation;
  }

  actionChoice = uiEvent<WotrActionChoice>();
  async askActionDie(
    message: string,
    frontId: WotrFrontId,
    tokens: WotrActionToken[]
  ): Promise<WotrActionChoice> {
    this.updateUi(s => ({ ...s, message, actionDieSelection: { frontId, tokens } }));
    const actionDieOrToken = await this.actionChoice.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, actionDieSelection: null }));
    return actionDieOrToken;
  }

  option = uiEvent<WotrUiOption>();
  async askOption<O>(message: string, options: WotrUiOption<O>[]): Promise<O> {
    this.updateUi(s => ({ ...s, message, options: options }));
    const option = await this.option.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, options: null }));
    return option.value as O;
  }

  reinforcementUnit = uiEvent<WotrReinforcementUnit>();
  async askReinforcementUnit(
    message: string,
    reinforcementUnitSelection: WotrReinforcementUnitSelection
  ): Promise<WotrReinforcementUnit | false> {
    const options: WotrUiOption<boolean>[] = [];
    if (reinforcementUnitSelection.canPass) {
      options.push({ value: false, label: "Pass" });
    }
    this.updateUi(s => ({
      ...s,
      message,
      reinforcementUnitSelection,
      options: options?.length ? options : null
    }));
    const choice = await Promise.race([this.reinforcementUnit.get(), this.option.get()]);
    this.updateUi(s => ({
      ...s,
      message: null,
      canCancel: true,
      reinforcementUnitSelection: null,
      options: null
    }));
    return "value" in choice ? false : choice;
  }

  regionUnits = uiEvent<WotrRegionUnits>();
  async askRegionUnits(
    message: string,
    unitSelection: WotrRegionUnitSelection
  ): Promise<WotrRegionUnits> {
    this.updateUi(s => ({
      ...s,
      message,
      regionUnitSelection: unitSelection
    }));
    const regionUnits = await this.regionUnits.get();
    this.updateUi(s => ({
      ...s,
      message: null,
      canCancel: true,
      regionUnitSelection: null,
      regionSelection: null
    }));
    return regionUnits;
  }

  casualtyUnits = uiEvent<{ downgrading: WotrUnits; removing: WotrUnits }>();
  async askCasualtyUnits(
    message: string,
    unitSelection: WotrChooseCasualtiesUnitSelection
  ): Promise<{ downgrading: WotrUnits; removing: WotrUnits }> {
    this.updateUi(s => ({
      ...s,
      message,
      regionUnitSelection: unitSelection
    }));
    const casualtyUnits = await this.casualtyUnits.get();
    this.updateUi(s => ({ ...s, message: null, canCancel: true, regionUnitSelection: null }));
    return casualtyUnits;
  }

  fellowshipCompanions = uiEvent<WotrCompanionId[]>();
  async askFellowshipCompanions(
    message: string,
    fellowshipCompanionsSelection: WotrFellowshipCompanionSelection
  ): Promise<WotrCompanionId[]> {
    this.updateUi(s => ({
      ...s,
      message,
      fellowshipCompanionsSelection
    }));
    const companions = await this.fellowshipCompanions.get();
    this.updateUi(s => ({
      ...s,
      message: null,
      canCancel: true,
      fellowshipCompanionsSelection: null
    }));
    return companions;
  }

  async askChoice<P = WotrFrontId>(
    message: string,
    choices: WotrUiChoice<P>[],
    params: P
  ): Promise<WotrAction[]> {
    const choice = await this.askOption<WotrUiChoice<P>>(
      message,
      choices.map(c => ({
        value: c,
        label: c.label(),
        disabled: c.isAvailable ? !c.isAvailable(params) : false
      }))
    );
    return choice.actions(params);
  }

  async askDieStoryChoice<P = WotrFrontId>(
    die: WotrActionDie,
    message: string,
    choices: WotrUiChoice<P>[],
    params: P
  ): Promise<WotrDieStory | WotrDieCardStory> {
    const choice = await this.askOption<WotrUiChoice<P>>(
      message,
      choices.map(c => ({
        value: c,
        label: c.label(),
        disabled: c.isAvailable ? !c.isAvailable(params) : false
      }))
    );
    const actions = await choice.actions(params);
    if (choice.card) {
      const story: WotrDieCardStory = {
        type: "die-card",
        die,
        actions,
        card: choice.card()
      };
      return story;
    } else {
      const story: WotrDieStory = {
        type: "die",
        die,
        actions
      };
      if (choice.character) story.character = choice.character;
      return story;
    }
  }

  resetUi(turnPlayer: WotrFrontId) {
    this.updateUi(s => ({
      ...initialState,
      message: `${this.playerInfoStore.player(turnPlayer).name} is thinking...`,
      canCancel: false,
      currentPlayerId: s.currentPlayerId
    }));
  }

  // setFirstActionUi (player: string): Partial<WotrUiState> {
  //   return {
  //     turnPlayer: player,
  //     canCancel: false
  //   };
  // }

  player = uiEvent<WotrFrontId | null>();
  setCurrentPlayerId(playerId: WotrFrontId | null) {
    this.player.emit(playerId);
    patchState(this, { currentPlayerId: playerId });
  }
}
