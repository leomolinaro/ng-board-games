import { WotrCompanionId } from "../character/wotr-character.models";

export interface WotrFellowship {
  status: "hidden" | "revealed";
  progress: number;
  corruption: number;
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
  mordorTrack?: WotrMordorTrack;
}

export type WotrMordorTrack = 0 | 1 | 2 | 3 | 4 | 5;
