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
  | "rers"
  // Kome tiles
  | "1km"
  | "2km";

export interface WotrHuntTile {
  id: WotrHuntTileId;
  type: "standard" | "free-people-special" | "shadow-special";
  eye?: boolean;
  reveal?: boolean;
  quantity?: number;
  stop?: boolean;
  dice?: boolean;
  crown?: boolean;
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

export function baseHuntTiles(): WotrHuntTileId[] {
  return ["3", "3", "3", "2", "2", "1", "1", "er", "er", "er", "er", "2r", "1r", "1r", "0r", "0r"];
}

export function komeHuntTiles(): WotrHuntTileId[] {
  return ["1km", "2km"];
}
