export type WotrMinionId = "saruman" | "the-witch-king" | "the-mouth-of-sauron";
// export type WotrMinionAbility = "sorcerer" | "messenger-of-the-dark-tower" | "the-voice-of-saruman" | "servant-of-the-white-hand";

export interface WotrMinion {
  id: WotrMinionId;
  name: string;
  level: number;
  leadership: number;
  status: "available" | "inPlay" | "eliminated";
}

