import { WotrCompanionId } from "../companion/wotr-character.models";

export interface WotrFellowship {
  status: "hidden" | "revealed";
  progress: number;
  corruption: number;
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
}
