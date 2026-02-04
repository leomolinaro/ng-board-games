import { WotrCompanionId } from "../character/wotr-character-models";

export type WotrHuntTileId =
  | "0r"
  | "1"
  | "1r"
  | "2"
  | "2r"
  | "3"
  | "b0"
  | "b-1"
  | "b-2"
  | "er"
  | "r1rs"
  | "r3s"
  | "rds"
  | "rers";

export interface WotrHuntTile {
  id: WotrHuntTileId;
  type: "standard" | "free-people-special" | "shadow-special";
  eye?: boolean;
  reveal?: boolean;
  quantity?: number;
  stop?: boolean;
  dice?: boolean;
}

export interface WotrHuntEffectParams {
  damage: number;
  isRevealing?: boolean;
  tableCardsUsed?: true;
  guideSpecialAbilityUsed?: true;
  randomCompanions?: WotrCompanionId[];
  casualtyTaken?: true;
  onlyRingAbsorbtion?: true;
  mustEliminateRandomCompanion?: true;
}

export class WotrRingBearerCorrupted extends Error {
  constructor() {
    super("The Ring Bearer has been corrupted! Shadow wins!");
  }
}
