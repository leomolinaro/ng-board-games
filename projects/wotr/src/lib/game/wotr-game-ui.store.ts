import { Injectable, computed, inject } from "@angular/core";
import { uiEvent } from "@leobg/commons/utils";
import { patchState, signalStore, withState } from "@ngrx/signals";
import { WotrActionChoice, WotrActionToken } from "../action-die/wotr-action-die.models";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrPlayerInfo } from "../player/wotr-player-info.models";
import { WotrPlayerInfoStore } from "../player/wotr-player-info.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrReinforcementUnit, WotrUnits } from "../unit/wotr-unit.models";

export interface WotrValidRegionUnits {
  nArmyUnits: number;
  underSiege: boolean;
}

interface WotrGameUiState {
  currentPlayerId: WotrFrontId | null;
  canCancel: boolean;
  message: string | null;
  validRegions: WotrRegionId[] | null;
  validNations: WotrNationId[] | null;
  validActionFront: WotrFrontId | null;
  validActionTokens: WotrActionToken[] | null;
  validOptions: WotrAskOption[] | null;
  validReinforcementUnits: WotrReinforcementUnit[] | null;
  validRegionUnits: WotrValidRegionUnits | null;
  canPass: boolean;
  canConfirm: boolean;
  canContinue: boolean;
  canInputQuantity: WotrGameUiInputQuantity | false;
}

export interface WotrGameUiInputQuantity {
  min: number;
  max: number;
}

export interface WotrPlayerUiState {}

export const initialState: WotrGameUiState = {
  currentPlayerId: null,
  canCancel: false,
  message: null,
  validRegions: null,
  validNations: null,
  validActionFront: null,
  validActionTokens: null,
  validOptions: null,
  validReinforcementUnits: null,
  validRegionUnits: null,
  canPass: false,
  canConfirm: false,
  canContinue: false,
  canInputQuantity: false
};

interface WotrAskOption<O = unknown> {
  value: O;
  label: string;
  disabled?: boolean;
}

export interface WotrPlayerChoice<P = WotrFrontId> {
  label(): string;
  isAvailable(params: P): boolean;
  resolve(params: P): Promise<WotrAction[]>;
}

@Injectable({ providedIn: "root" })
export class WotrGameUiStore extends signalStore(
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

  private updateUi<
    S extends WotrGameUiState & {
      [K in keyof S]: K extends keyof WotrGameUiState ? WotrGameUiState[K] : never;
    }
  >(updater: (state: WotrGameUiState) => S) {
    patchState(this, updater);
  }

  continue = uiEvent<void>();
  async askContinue(message: string): Promise<void> {
    this.updateUi(s => ({ ...s, message, canContinue: true }));
    await this.continue.get();
    this.updateUi(s => ({ ...s, message: null, canContinue: false }));
  }

  confirm = uiEvent<boolean>();
  async askConfirm(message: string): Promise<boolean> {
    this.updateUi(s => ({ ...s, message, canConfirm: true }));
    const confirm = await this.confirm.get();
    this.updateUi(s => ({ ...s, message: null, canConfirm: false }));
    return confirm;
  }

  inputQuantity = uiEvent<number>();
  async askQuantity(message: string, min: number, max: number): Promise<number> {
    this.updateUi(s => ({ ...s, message, canInputQuantity: { min, max } }));
    const quantity = await this.inputQuantity.get();
    this.updateUi(s => ({ ...s, message: null, canInputQuantity: false }));
    return quantity;
  }

  region = uiEvent<WotrRegionId>();
  async askRegion(message: string, validRegions: WotrRegionId[]): Promise<WotrRegionId> {
    this.updateUi(s => ({ ...s, message, validRegions }));
    const region = await this.region.get();
    this.updateUi(s => ({ ...s, message: null, validRegions: null }));
    return region;
  }

  nation = uiEvent<WotrNationId>();
  async askNation(message: string, validNations: WotrNationId[]): Promise<WotrNationId> {
    this.updateUi(s => ({ ...s, message, validNations }));
    const nation = await this.nation.get();
    this.updateUi(s => ({ ...s, message: null, validNations: null }));
    return nation;
  }

  actionChoice = uiEvent<WotrActionChoice>();
  async askActionDie(
    message: string,
    frontId: WotrFrontId,
    validActionTokens: WotrActionToken[]
  ): Promise<WotrActionChoice> {
    this.updateUi(s => ({ ...s, message, validActionFront: frontId, validActionTokens }));
    const actionDieOrToken = await this.actionChoice.get();
    this.updateUi(s => ({ ...s, message: null, validActionFront: null, validActionTokens: null }));
    return actionDieOrToken;
  }

  option = uiEvent<WotrAskOption>();
  async askOption<O>(message: string, options: WotrAskOption<O>[]): Promise<O> {
    this.updateUi(s => ({ ...s, message, validOptions: options }));
    const option = await this.option.get();
    this.updateUi(s => ({ ...s, message: null, validOptions: null }));
    return option.value as O;
  }

  reinforcementUnit = uiEvent<WotrReinforcementUnit>();
  async askReinforcementUnit(
    message: string,
    validReinforcementUnits: WotrReinforcementUnit[]
  ): Promise<WotrReinforcementUnit> {
    this.updateUi(s => ({ ...s, message, validReinforcementUnits }));
    const reinforcementUnit = await this.reinforcementUnit.get();
    this.updateUi(s => ({ ...s, message: null, validReinforcementUnits: null }));
    return reinforcementUnit;
  }

  regionUnits = uiEvent<WotrUnits>();
  async askRegionUnits(
    message: string,
    regionId: WotrRegionId,
    validUnits: WotrValidRegionUnits
  ): Promise<WotrUnits> {
    this.updateUi(s => ({
      ...s,
      message,
      validRegionUnits: validUnits,
      validRegions: [regionId]
    }));
    const regionUnits = await this.regionUnits.get();
    this.updateUi(s => ({ ...s, message: null, validRegionUnits: null, validRegions: null }));
    return regionUnits;
  }

  async playerChoice<P = WotrFrontId>(
    message: string,
    choices: WotrPlayerChoice<P>[],
    params: P
  ): Promise<WotrAction[]> {
    const choice = await this.askOption<WotrPlayerChoice<P>>(
      message,
      choices.map(c => ({
        value: c,
        label: c.label(),
        disabled: !c.isAvailable(params)
      }))
    );
    return choice.resolve(params);
  }

  askCard(message: string, validCards: WotrCardId[], frontId: WotrFrontId): Promise<WotrCardId> {
    throw new Error("Method not implemented.");
  }

  resetUi(turnPlayer: WotrFrontId) {
    this.updateUi(s => ({
      ...initialState,
      message: `${this.playerInfoStore.player(turnPlayer).name} is thinking...`,
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
