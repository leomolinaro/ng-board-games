export type WotrMinionId = "saruman" | "the-witch-king" | "the-mouth-of-sauron";

export interface WotrMinion {
  id: WotrMinionId;
  name: string;
  level: number;
  leadership: number;
  status: "available" | "inPlay" | "eliminated";
}

