import { WotrCompanionId } from "../character/wotr-character-models";

export interface WotrFellowship {
  status: "hidden" | "revealed";
  progress: number;
  corruption: number;
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
  mordorTrack?: WotrMordorTrack;
  moveOrHideAttempt: boolean;
}

export type WotrMordorTrack = 0 | 1 | 2 | 3 | 4 | 5;

export class WotrRingDestroyed extends Error {
  constructor() {
    super("The Ring has been destroyed! Free Peoples win!");
  }
}
