export type WotrCompanionId = "gandalf-the-grey" | "strider" | "boromir" | "legolas" | "gimli" | "meriadoc" | "peregrin" | "aragorn" | "gandalf-the-white";

export interface WotrCompanion {
  id: WotrCompanionId;
  name: string;
  level: number;
  leadership: number;
  status: "inFellowship" | "available" | "inPlay" | "eliminated";
}


