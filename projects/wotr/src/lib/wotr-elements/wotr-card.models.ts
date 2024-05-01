import { arrayUtil } from "@leobg/commons/utils";

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

export type WotrCardLabel =
  "Elven Cloaks" |
  "Elven Rope" |
  "Phial of Galadriel" |
  "Smeagol Helps Nice Master" |
  "Mithril Coat and Sting" |
  "Axe and Box" |
  "Horns of Gondor" |
  "Wizard's Staff" |
  "Athelas" |
  "There is Another Way" |
  "I Will Go Alone" |
  "Bilbo's Song" |
  "Mirror of Galadriel" |
  "Challenge of the King" |
  "Gwahir the Windlord" |
  "We Prove the Swifter" |
  "There and Back Again" |
  "The Eagles are Coming!" |
  "The Ents Awake: Treebeard" |
  "The Ents Awake: Huorns" |
  "The Ents Awake: Entmoot" |
  "Dead Men of Dunharrow" |
  "House of the Stewards" |
  "The Grey Company" |
  "The Last Battle" |
  "A Power too Great" |
  "The Power of Tom Bombadil" |
  "Book of Mazarbul" |
  "The Spirit of Mordor" |
  "Faramir's Ranges" |
  "Fear! Fire! Foes!" |
  "Wisdom of Elrond" |
  "The Red Arrow" |
  "Help Unlooked For" |
  "Paths of the Woses" |
  "Through a Day and a Night" |
  "Cirdan's Ships" |
  "Guards of the Citadel" |
  "Celeborn's Galadhrim" |
  "Riders of Theoden" |
  "Grimbeorn the Old, Son of Beorn" |
  "Imrahil of Dol Amroth" |
  "King Brand's Men" |
  "Swords in Eriador" |
  "Kindred of Glorfindel" |
  "Dain Ironfoot's Guard" |
  "Eomer, son of Eomund" |
  "Thranduil's Archers" |
  "Shelob's Lair" |
  "The Ring is Mine!" |
  "On, On They Went" |
  "Give it to Uss!" |
  "Orc Patrol" |
  "Isildur's Bane" |
  "Foul Thing from the Deep" |
  "Candles of Corpses" |
  "Nazgul Search" |
  "Cruel Weather" |
  "The Nazgul Strike" |
  "Morgul Wound" |
  "Lure of the Ring" |
  "The Breaking of the Fellowship" |
  "Worn with Sorrow and Toil" |
  "Flocks of Crebain" |
  "A Balrog is Come!" |
  "The Lidless Eye" |
  "Dreadful Spells" |
  "Grond, Hammer of the Unnderworld" |
  "The Palantir of Orthanc" |
  "Wormtongue" |
  "The Ringwraiths are Abroad" |
  "The Black Captain Commands" |
  "Return to Valinor" |
  "The Fighting Uruk-hai" |
  "Denethor's Folly" |
  "The Day Without Dawn" |
  "Threats and Promises" |
  "Stormcrow" |
  "Shadows Gather" |
  "The Shadow Lengthens" |
  "The Shadow is Moving" |
  "Corsairs of Umbar" |
  "Rage of the Dunledings" |
  "Return of the Witch-king" |
  "Half-orcs and Goblin-men" |
  "Olog-hai" |
  "Hill-trolls" |
  "A New Power is Rising" |
  "Many Kings to the Service of Mordor" |
  "The King is Revealed" |
  "Shadows on the Misty Mountains" |
  "Orcs Multiplying Again" |
  "Horde From the East" |
  "Monsters Rousted" |
  "Musterings of Long-planned War" |
  "Pits of Mordor";

const LABEL_BY_CARD: Record<WotrCardId, WotrCardLabel> = {
  fpcha01: "Elven Cloaks",
  fpcha02: "Elven Rope",
  fpcha03: "Phial of Galadriel",
  fpcha04: "Smeagol Helps Nice Master",
  fpcha05: "Mithril Coat and Sting",
  fpcha06: "Axe and Box",
  fpcha07: "Horns of Gondor",
  fpcha08: "Wizard's Staff",
  fpcha09: "Athelas",
  fpcha10: "There is Another Way",
  fpcha11: "I Will Go Alone",
  fpcha12: "Bilbo's Song",
  fpcha13: "Mirror of Galadriel",
  fpcha14: "Challenge of the King",
  fpcha15: "Gwahir the Windlord",
  fpcha16: "We Prove the Swifter",
  fpcha17: "There and Back Again",
  fpcha18: "The Eagles are Coming!",
  fpcha19: "The Ents Awake: Treebeard",
  fpcha20: "The Ents Awake: Huorns",
  fpcha21: "The Ents Awake: Entmoot",
  fpcha22: "Dead Men of Dunharrow",
  fpcha23: "House of the Stewards",
  fpcha24: "The Grey Company",
  fpstr01: "The Last Battle",
  fpstr02: "A Power too Great",
  fpstr03: "The Power of Tom Bombadil",
  fpstr04: "Book of Mazarbul",
  fpstr05: "The Spirit of Mordor",
  fpstr06: "Faramir's Ranges",
  fpstr07: "Fear! Fire! Foes!",
  fpstr08: "Wisdom of Elrond",
  fpstr09: "The Red Arrow",
  fpstr10: "Help Unlooked For",
  fpstr11: "Paths of the Woses",
  fpstr12: "Through a Day and a Night",
  fpstr13: "Cirdan's Ships",
  fpstr14: "Guards of the Citadel",
  fpstr15: "Celeborn's Galadhrim",
  fpstr16: "Riders of Theoden",
  fpstr17: "Grimbeorn the Old, Son of Beorn",
  fpstr18: "Imrahil of Dol Amroth",
  fpstr19: "King Brand's Men",
  fpstr20: "Swords in Eriador",
  fpstr21: "Kindred of Glorfindel",
  fpstr22: "Dain Ironfoot's Guard",
  fpstr23: "Eomer, son of Eomund",
  fpstr24: "Thranduil's Archers",
  scha01: "Shelob's Lair",
  scha02: "The Ring is Mine!",
  scha03: "On, On They Went",
  scha04: "Give it to Uss!",
  scha05: "Orc Patrol",
  scha06: "Isildur's Bane",
  scha07: "Foul Thing from the Deep",
  scha08: "Candles of Corpses",
  scha09: "Nazgul Search",
  scha10: "Cruel Weather",
  scha11: "The Nazgul Strike",
  scha12: "Morgul Wound",
  scha13: "Lure of the Ring",
  scha14: "The Breaking of the Fellowship",
  scha15: "Worn with Sorrow and Toil",
  scha16: "Flocks of Crebain",
  scha17: "A Balrog is Come!",
  scha18: "The Lidless Eye",
  scha19: "Dreadful Spells",
  scha20: "Grond, Hammer of the Unnderworld",
  scha21: "The Palantir of Orthanc",
  scha22: "Wormtongue",
  scha23: "The Ringwraiths are Abroad",
  scha24: "The Black Captain Commands",
  sstr01: "Return to Valinor",
  sstr02: "The Fighting Uruk-hai",
  sstr03: "Denethor's Folly",
  sstr04: "The Day Without Dawn",
  sstr05: "Threats and Promises",
  sstr06: "Stormcrow",
  sstr07: "Shadows Gather",
  sstr08: "The Shadow Lengthens",
  sstr09: "The Shadow is Moving",
  sstr10: "Corsairs of Umbar",
  sstr11: "Rage of the Dunledings",
  sstr12: "Return of the Witch-king",
  sstr13: "Half-orcs and Goblin-men",
  sstr14: "Olog-hai",
  sstr15: "Hill-trolls",
  sstr16: "A New Power is Rising",
  sstr17: "Many Kings to the Service of Mordor",
  sstr18: "The King is Revealed",
  sstr19: "Shadows on the Misty Mountains",
  sstr20: "Orcs Multiplying Again",
  sstr21: "Horde From the East",
  sstr22: "Monsters Rousted",
  sstr23: "Musterings of Long-planned War",
  sstr24: "Pits of Mordor",
};

const CARD_BY_LABEL =
  arrayUtil.toMap (Object.keys (LABEL_BY_CARD) as WotrCardId[], cardId => LABEL_BY_CARD[cardId], cardId => cardId) as Record<WotrCardLabel, WotrCardId>;

export function labelToCardId (label: WotrCardLabel): WotrCardId { return CARD_BY_LABEL[label]; }

export function cardToLabel (cardId: WotrCardId): string { return LABEL_BY_CARD[cardId]; }