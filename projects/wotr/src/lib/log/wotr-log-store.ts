import { Injectable, Signal } from "@angular/core";
import { WotrLog } from "./wotr-log-models";

export type WotrLogState = WotrLog[];

export function initialeState(): WotrLogState {
  return [];
}

@Injectable({ providedIn: "root" })
export class WotrLogStore {
  update!: (actionName: string, updater: (a: WotrLogState) => WotrLogState) => void;
  state!: Signal<WotrLogState>;
}
