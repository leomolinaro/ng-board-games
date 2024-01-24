import { WotrCompanion, WotrCompanionId, WotrMinion, WotrMinionId } from "./nation.models";

export type WotrCharacterId = WotrCompanionId | WotrMinionId;
export type WotrCharacter = WotrCompanion | WotrMinion;
