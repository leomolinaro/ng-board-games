import { WotrCompanion, WotrCompanionId } from "./wotr-companion.models";
import { WotrMinion, WotrMinionId } from "./wotr-minion.models";

export type WotrCharacterId = WotrCompanionId | WotrMinionId;
export type WotrCharacter = WotrCompanion | WotrMinion;
