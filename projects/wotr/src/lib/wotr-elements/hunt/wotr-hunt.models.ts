export type WotrHuntTileId = "0r" | "1" | "1r" | "2" | "2r" | "3" | "b0" | "b-1" | "b-2" | "er" | "r1rs" | "r3s" | "rds" | "rers";

export interface WotrHuntTile {
  id: WotrHuntTileId;
  type: "standard" | "free-people-special" | "shadow-special";
  eye?: boolean;
  reveal?: boolean;
  quantity?: number;
  stop?: boolean;
  dice?: boolean;
}
