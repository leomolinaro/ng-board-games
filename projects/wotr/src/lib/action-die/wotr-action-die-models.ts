import { WotrElvenRing, WotrFrontId } from "../front/wotr-front-models";

export type WotrActionDieResult =
  | "character"
  | "army"
  | "muster"
  | "event"
  | "muster-army"
  | "will-of-the-west"
  | "eye";

export type WotrSpecialActionDieType = "ruler";

export interface WotrSpecialActionDie {
  type: WotrSpecialActionDieType;
  result: WotrActionDieResult;
}

export type WotrActionDie = WotrActionDieResult | WotrSpecialActionDie;

export type WotrActionChoice =
  | { type: "die"; die: WotrActionDie }
  | { type: "token"; token: WotrActionToken }
  | { type: "elvenRing"; ring: WotrElvenRing }
  | { type: "eye" };

export type WotrFreePeopleActionToken = "political-advance" | "draw-card";
export type WotrShadowActionToken = "political-advance" | "move-nazgul-minions";
export type WotrActionToken = WotrFreePeopleActionToken | WotrShadowActionToken;

export interface WotrActionTokenOption {
  token: WotrActionToken;
  front: WotrFrontId;
}

export const ACTION_TOKEN_OPTIONS: WotrActionTokenOption[] = [
  { token: "draw-card", front: "free-peoples" },
  { token: "move-nazgul-minions", front: "shadow" },
  { token: "political-advance", front: "free-peoples" },
  { token: "political-advance", front: "shadow" }
];

const ACTION_TOKENS: Record<WotrFrontId, Partial<Record<WotrActionToken, string>>> = {
  "free-peoples": {
    "political-advance": "Advance a Free People Nation on the Political track",
    "draw-card": "Draw one Event Card"
  },
  "shadow": {
    "political-advance": "Advance a Shadow Nation on the Political track",
    "move-nazgul-minions": "Move Nazgul and Minions"
  }
};

export function getActionTokenName(token: WotrActionToken, front: WotrFrontId): string {
  const frontTokens = ACTION_TOKENS[front];
  if (!frontTokens) throw new Error("Unknown front " + front);
  const name = frontTokens[token];
  if (!name) throw new Error("Unknown token " + token + " for front " + front);
  return name;
}
