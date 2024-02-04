
export type WotrFreePeopleActionDie = "character" | "army" | "muster" | "event" | "muster-army" | "will-of-the-west";
export type WotrShadowActionDie = "character" | "army" | "muster" | "event" | "muster-army" | "eye";
export type WotrActionDie = WotrFreePeopleActionDie | WotrShadowActionDie;

export type WotrCombatDie = 1 | 2 | 3 | 4 | 5 | 6;

export type WotrFreePeopleActionToken = "political-advance" | "draw-card";
export type WotrShadowActionToken = "political-advance" | "move-nazgul-minions";
export type WotrActionToken = WotrFreePeopleActionToken | WotrShadowActionToken;
