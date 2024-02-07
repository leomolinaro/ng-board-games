import { WotrCompanionId } from "./wotr-companion.models";

export interface WotrFellowship {
  status: "hidden" | "revealed";
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
}
