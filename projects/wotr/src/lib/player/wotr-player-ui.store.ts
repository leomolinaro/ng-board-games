import { Injectable, Signal } from "@angular/core";
import { WotrRegionId } from "../region/wotr-region.models";

export interface WotrPlayerUiState {
  canCancel: boolean;
  message: string | null;
  validRegions: WotrRegionId[] | null;
  canPass: boolean;
  canConfirm: boolean;
}

export function initialState (): WotrPlayerUiState {
  return {
    canCancel: false,
    message: null,
    validRegions: null,
    canPass: false,
    canConfirm: false
  };
}

@Injectable ()
export class WotrPlayerUiStore {

  update!: (actionName: string, updater: (a: WotrPlayerUiState) => WotrPlayerUiState) => void;
  state!: Signal<WotrPlayerUiState>;

}
