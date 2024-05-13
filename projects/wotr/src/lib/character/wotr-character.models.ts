import { WotrCompanion, WotrCompanionId } from "../companion/wotr-companion.models";
import { WotrMinion, WotrMinionId } from "../minion/wotr-minion.models";

export type WotrCharacterId = WotrCompanionId | WotrMinionId;
export type WotrCharacter = WotrCompanion | WotrMinion;
