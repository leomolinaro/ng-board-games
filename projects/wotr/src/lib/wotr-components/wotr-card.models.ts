export type WotrCardNumber =
  "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" |
  "11" | "12" | "13" | "14" | "15" | "16" | "17" | "18" | "19" | "20" |
  "21" | "22" | "23" | "24";

export type WotrFreePeopleCharacterCardId = `fpcha${WotrCardNumber}`;
export type WotrFreePeopleStrategyCardId = `fpstr${WotrCardNumber}`;
export type WotrShadowCharacterCardId = `scha${WotrCardNumber}`;
export type WotrShadowStrategyCardId = `sstr${WotrCardNumber}`;
export type WotrFreePeopleCardId = WotrFreePeopleCharacterCardId | WotrFreePeopleStrategyCardId;
export type WotrShadowCardId = WotrShadowCharacterCardId | WotrShadowStrategyCardId;
export type WotrCharacterCardId = WotrFreePeopleCharacterCardId | WotrShadowCharacterCardId;
export type WotrStrategyCardId = WotrFreePeopleStrategyCardId | WotrShadowStrategyCardId;
export type WotrCardId = WotrCharacterCardId | WotrStrategyCardId;

export function isCharacterCard (cardId: WotrCardId): cardId is WotrCharacterCardId {
  return cardId.startsWith ("fpcha") || cardId.startsWith ("scha");
}

export function isStrategyCard (cardId: WotrCardId): cardId is WotrStrategyCardId {
  return cardId.startsWith ("fpstr") || cardId.startsWith ("sstr");
}
