import { arrayUtil } from "@leobg/commons/utils";

export type WotrCardNumber =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24";

export type WotrFreePeopleCardId = WotrFreePeopleCharacterCardId | WotrFreePeopleStrategyCardId;
export function isFreePeoplesCard(cardId: WotrCardId): cardId is WotrFreePeopleCardId {
  return cardId.startsWith("fp");
}

export type WotrShadowCardId = WotrShadowCharacterCardId | WotrShadowStrategyCardId;
export function isShadowCard(cardId: WotrCardId): cardId is WotrShadowCardId {
  return cardId.startsWith("s");
}

export type WotrStrategyCardId = WotrFreePeopleStrategyCardId | WotrShadowStrategyCardId;
export type WotrCardId = WotrCharacterCardId | WotrStrategyCardId;
export type WotrCardType = "character" | "muster" | "army";

export type WotrCharacterCardId = WotrFreePeopleCharacterCardId | WotrShadowCharacterCardId;
export function isCharacterCard(cardId: WotrCardId): cardId is WotrCharacterCardId {
  return cardId.startsWith("fpcha") || cardId.startsWith("scha");
}
export type WotrFreePeopleCharacterCardId = `fpcha${WotrCardNumber}`;
export function isFreePeopleCharacterCard(
  cardId: WotrCardId
): cardId is WotrFreePeopleCharacterCardId {
  return cardId.startsWith("fpcha");
}

export type WotrFreePeopleStrategyCardId = `fpstr${WotrCardNumber}`;
export function isFreePeopleStrategyCard(
  cardId: WotrCardId
): cardId is WotrFreePeopleStrategyCardId {
  return cardId.startsWith("fpstr");
}

export type WotrShadowCharacterCardId = `scha${WotrCardNumber}`;
export function isShadowCharacterCard(cardId: WotrCardId): cardId is WotrShadowCharacterCardId {
  return cardId.startsWith("scha");
}

export type WotrShadowStrategyCardId = `sstr${WotrCardNumber}`;
export function isShadowStrategyCard(cardId: WotrCardId): cardId is WotrShadowStrategyCardId {
  return cardId.startsWith("sstr");
}

export function isStrategyCard(cardId: WotrCardId): cardId is WotrStrategyCardId {
  return cardId.startsWith("fpstr") || cardId.startsWith("sstr");
}

export interface WotrCard {
  id: WotrCardId;
  label: WotrCardLabel;
  type: WotrCardType;
  combatLabel: WotrCardCombatLabel;
  combatTiming: number | number[];
}

export type WotrCardLabel =
  | "Elven Cloaks"
  | "Elven Rope"
  | "Phial of Galadriel"
  | "Smeagol Helps Nice Master"
  | "Mithril Coat and Sting"
  | "Axe and Bow"
  | "Horn of Gondor"
  | "Wizard's Staff"
  | "Athelas"
  | "There is Another Way"
  | "I Will Go Alone"
  | "Bilbo's Song"
  | "Mirror of Galadriel"
  | "Challenge of the King"
  | "Gwahir the Windlord"
  | "We Prove the Swifter"
  | "There and Back Again"
  | "The Eagles are Coming!"
  | "The Ents Awake: Treebeard"
  | "The Ents Awake: Huorns"
  | "The Ents Awake: Entmoot"
  | "Dead Men of Dunharrow"
  | "House of the Stewards"
  | "The Grey Company"
  | "The Last Battle"
  | "A Power too Great"
  | "The Power of Tom Bombadil"
  | "Book of Mazarbul"
  | "The Spirit of Mordor"
  | "Faramir's Rangers"
  | "Fear! Fire! Foes!"
  | "Wisdom of Elrond"
  | "The Red Arrow"
  | "Help Unlooked For"
  | "Paths of the Woses"
  | "Through a Day and a Night"
  | "Cirdan's Ships"
  | "Guards of the Citadel"
  | "Celeborn's Galadhrim"
  | "Riders of Theoden"
  | "Grimbeorn the Old, Son of Beorn"
  | "Imrahil of Dol Amroth"
  | "King Brand's Men"
  | "Swords in Eriador"
  | "Kindred of Glorfindel"
  | "Dain Ironfoot's Guard"
  | "Eomer, son of Eomund"
  | "Thranduil's Archers"
  | "Shelob's Lair"
  | "The Ring is Mine!"
  | "On, On They Went"
  | "Give it to Uss!"
  | "Orc Patrol"
  | "Isildur's Bane"
  | "Foul Thing from the Deep"
  | "Candles of Corpses"
  | "Nazgul Search"
  | "Cruel Weather"
  | "The Nazgul Strike"
  | "Morgul Wound"
  | "Lure of the Ring"
  | "The Breaking of the Fellowship"
  | "Worn with Sorrow and Toil"
  | "Flocks of Crebain"
  | "Balrog of Moria"
  | "The Lidless Eye"
  | "Dreadful Spells"
  | "Grond, Hammer of the Underworld"
  | "The Palantir of Orthanc"
  | "Wormtongue"
  | "The Ringwraiths are Abroad"
  | "The Black Captain Commands"
  | "Return to Valinor"
  | "The Fighting Uruk-hai"
  | "Denethor's Folly"
  | "The Day Without Dawn"
  | "Threats and Promises"
  | "Stormcrow"
  | "Shadows Gather"
  | "The Shadow Lengthens"
  | "The Shadow is Moving"
  | "Corsairs of Umbar"
  | "Rage of the Dunledings"
  | "Return of the Witch-king"
  | "Half-orcs and Goblin-men"
  | "Olog-hai"
  | "Hill-trolls"
  | "A New Power is Rising"
  | "Many Kings to the Service of Mordor"
  | "The King is Revealed"
  | "Shadows on the Misty Mountains"
  | "Orcs Multiplying Again"
  | "Horde From the East"
  | "Monsters Rousted"
  | "Musterings of Long-planned War"
  | "Pits of Mordor";

export type WotrCardCombatLabel =
  | "It is a Gift"
  | "Blade of Westernesse"
  | "Mighty Attack"
  | "Servant of the Secret Fire"
  | "Anduril"
  | "Heroic Death"
  | "Daring Defiance"
  | "Fateful Strike"
  | "Sudden Strike"
  | "Brave Stand"
  | "Ents' Rage"
  | "Huorn-dark"
  | "Nameless Wood"
  | "Daylight"
  | "No Quarter"
  | "Advantageous Position"
  | "Scouts"
  | "Shield-Wall"
  | "Confusion"
  | "Charge"
  | "Valour"
  | "One for the Dark Lord"
  | "Cruel as Death"
  | "They are Terrible"
  | "Dread and Despair"
  | "Foul Stench"
  | "Black Breath"
  | "Words of Power"
  | "Durin's Bane"
  | "Delivery of Orthanc"
  | "Deadly Strife"
  | "Onslaught"
  | "Relentless Assault"
  | "Great Host"
  | "Mumakil"
  | "Swarm of Bats"
  | "We Come to Kill"
  | "Desperate Battle";

const CARD_BY_ID: Record<WotrCardId, WotrCard> = {
  fpcha01: {
    id: "fpcha01",
    label: "Elven Cloaks",
    type: "character",
    combatLabel: "It is a Gift",
    combatTiming: 3
  },
  fpcha02: {
    id: "fpcha02",
    label: "Elven Rope",
    type: "character",
    combatLabel: "It is a Gift",
    combatTiming: 3
  },
  fpcha03: {
    id: "fpcha03",
    label: "Phial of Galadriel",
    type: "character",
    combatLabel: "It is a Gift",
    combatTiming: 3
  },
  fpcha04: {
    id: "fpcha04",
    label: "Smeagol Helps Nice Master",
    type: "character",

    combatLabel: "It is a Gift",
    combatTiming: 3
  },
  fpcha05: {
    id: "fpcha05",
    label: "Mithril Coat and Sting",
    type: "character",
    combatLabel: "Blade of Westernesse",
    combatTiming: 6
  },
  fpcha06: {
    id: "fpcha06",
    label: "Axe and Bow",
    type: "character",
    combatLabel: "Mighty Attack",
    combatTiming: 4
  },
  fpcha07: {
    id: "fpcha07",
    label: "Horn of Gondor",
    type: "character",
    combatLabel: "Mighty Attack",
    combatTiming: 4
  },
  fpcha08: {
    id: "fpcha08",
    label: "Wizard's Staff",
    type: "character",
    combatLabel: "Servant of the Secret Fire",
    combatTiming: 3
  },
  fpcha09: {
    id: "fpcha09",
    label: "Athelas",
    type: "character",
    combatLabel: "Anduril",
    combatTiming: 4
  },
  fpcha10: {
    id: "fpcha10",
    label: "There is Another Way",
    type: "character",
    combatLabel: "Heroic Death",
    combatTiming: 6
  },
  fpcha11: {
    id: "fpcha11",
    label: "I Will Go Alone",
    type: "character",
    combatLabel: "Daring Defiance",
    combatTiming: 0
  },
  fpcha12: {
    id: "fpcha12",
    label: "Bilbo's Song",
    type: "character",
    combatLabel: "Fateful Strike",
    combatTiming: 6
  },
  fpcha13: {
    id: "fpcha13",
    label: "Mirror of Galadriel",
    type: "character",
    combatLabel: "Heroic Death",
    combatTiming: 6
  },
  fpcha14: {
    id: "fpcha14",
    label: "Challenge of the King",
    type: "character",
    combatLabel: "Sudden Strike",
    combatTiming: 2
  },
  fpcha15: {
    id: "fpcha15",
    label: "Gwahir the Windlord",
    type: "character",
    combatLabel: "Daring Defiance",
    combatTiming: 0
  },
  fpcha16: {
    id: "fpcha16",
    label: "We Prove the Swifter",
    type: "character",
    combatLabel: "Daring Defiance",
    combatTiming: 0
  },
  fpcha17: {
    id: "fpcha17",
    label: "There and Back Again",
    type: "character",
    combatLabel: "Brave Stand",
    combatTiming: 3
  },
  fpcha18: {
    id: "fpcha18",
    label: "The Eagles are Coming!",
    type: "character",
    combatLabel: "Heroic Death",
    combatTiming: 6
  },
  fpcha19: {
    id: "fpcha19",
    label: "The Ents Awake: Treebeard",
    type: "character",
    combatLabel: "Ents' Rage",
    combatTiming: 3
  },
  fpcha20: {
    id: "fpcha20",
    label: "The Ents Awake: Huorns",
    type: "character",
    combatLabel: "Huorn-dark",
    combatTiming: 3
  },
  fpcha21: {
    id: "fpcha21",
    label: "The Ents Awake: Entmoot",
    type: "character",
    combatLabel: "Nameless Wood",
    combatTiming: 5
  },
  fpcha22: {
    id: "fpcha22",
    label: "Dead Men of Dunharrow",
    type: "character",
    combatLabel: "Sudden Strike",
    combatTiming: 2
  },
  fpcha23: {
    id: "fpcha23",
    label: "House of the Stewards",
    type: "character",
    combatLabel: "Brave Stand",
    combatTiming: 3
  },
  fpcha24: {
    id: "fpcha24",
    label: "The Grey Company",
    type: "character",
    combatLabel: "Brave Stand",
    combatTiming: 3
  },
  fpstr01: {
    id: "fpstr01",
    label: "The Last Battle",
    type: "army",
    combatLabel: "Daylight",
    combatTiming: 3
  },
  fpstr02: {
    id: "fpstr02",
    label: "A Power too Great",
    type: "army",
    combatLabel: "No Quarter",
    combatTiming: 5
  },
  fpstr03: {
    id: "fpstr03",
    label: "The Power of Tom Bombadil",
    type: "army",
    combatLabel: "Advantageous Position",
    combatTiming: 3
  },
  fpstr04: {
    id: "fpstr04",
    label: "Book of Mazarbul",
    type: "muster",
    combatLabel: "Advantageous Position",
    combatTiming: 3
  },
  fpstr05: {
    id: "fpstr05",
    label: "The Spirit of Mordor",
    type: "army",
    combatLabel: "Scouts",
    combatTiming: 1
  },
  fpstr06: {
    id: "fpstr06",
    label: "Faramir's Rangers",
    type: "army",
    combatLabel: "Shield-Wall",
    combatTiming: 6
  },
  fpstr07: {
    id: "fpstr07",
    label: "Fear! Fire! Foes!",
    type: "muster",
    combatLabel: "Shield-Wall",
    combatTiming: 6
  },
  fpstr08: {
    id: "fpstr08",
    label: "Wisdom of Elrond",
    type: "muster",
    combatLabel: "Confusion",
    combatTiming: 4
  },
  fpstr09: {
    id: "fpstr09",
    label: "The Red Arrow",
    type: "muster",
    combatLabel: "Scouts",
    combatTiming: 1
  },
  fpstr10: {
    id: "fpstr10",
    label: "Help Unlooked For",
    type: "army",
    combatLabel: "No Quarter",
    combatTiming: 5
  },
  fpstr11: {
    id: "fpstr11",
    label: "Paths of the Woses",
    type: "army",
    combatLabel: "Sudden Strike",
    combatTiming: 2
  },
  fpstr12: {
    id: "fpstr12",
    label: "Through a Day and a Night",
    type: "army",
    combatLabel: "Confusion",
    combatTiming: 4
  },
  fpstr13: {
    id: "fpstr13",
    label: "Cirdan's Ships",
    type: "muster",
    combatLabel: "Charge",
    combatTiming: 2
  },
  fpstr14: {
    id: "fpstr14",
    label: "Guards of the Citadel",
    type: "muster",
    combatLabel: "Charge",
    combatTiming: 2
  },
  fpstr15: {
    id: "fpstr15",
    label: "Celeborn's Galadhrim",
    type: "muster",
    combatLabel: "Daylight",
    combatTiming: 3
  },
  fpstr16: {
    id: "fpstr16",
    label: "Riders of Theoden",
    type: "muster",
    combatLabel: "Daylight",
    combatTiming: 3
  },
  fpstr17: {
    id: "fpstr17",
    label: "Grimbeorn the Old, Son of Beorn",
    type: "muster",
    combatLabel: "Scouts",
    combatTiming: 1
  },
  fpstr18: {
    id: "fpstr18",
    label: "Imrahil of Dol Amroth",
    type: "muster",
    combatLabel: "Shield-Wall",
    combatTiming: 6
  },
  fpstr19: {
    id: "fpstr19",
    label: "King Brand's Men",
    type: "muster",
    combatLabel: "Shield-Wall",
    combatTiming: 6
  },
  fpstr20: {
    id: "fpstr20",
    label: "Swords in Eriador",
    type: "muster",
    combatLabel: "Advantageous Position",
    combatTiming: 3
  },
  fpstr21: {
    id: "fpstr21",
    label: "Kindred of Glorfindel",
    type: "muster",
    combatLabel: "Advantageous Position",
    combatTiming: 3
  },
  fpstr22: {
    id: "fpstr22",
    label: "Dain Ironfoot's Guard",
    type: "muster",
    combatLabel: "Valour",
    combatTiming: 3
  },
  fpstr23: {
    id: "fpstr23",
    label: "Eomer, son of Eomund",
    type: "muster",
    combatLabel: "Valour",
    combatTiming: 3
  },
  fpstr24: {
    id: "fpstr24",
    label: "Thranduil's Archers",
    type: "muster",
    combatLabel: "Valour",
    combatTiming: 3
  },
  scha01: {
    id: "scha01",
    label: "Shelob's Lair",
    type: "character",
    combatLabel: "One for the Dark Lord",
    combatTiming: 3
  },
  scha02: {
    id: "scha02",
    label: "The Ring is Mine!",
    type: "character",
    combatLabel: "One for the Dark Lord",
    combatTiming: 3
  },
  scha03: {
    id: "scha03",
    label: "On, On They Went",
    type: "character",
    combatLabel: "One for the Dark Lord",
    combatTiming: 3
  },
  scha04: {
    id: "scha04",
    label: "Give it to Uss!",
    type: "character",
    combatLabel: "One for the Dark Lord",
    combatTiming: 3
  },
  scha05: {
    id: "scha05",
    label: "Orc Patrol",
    type: "character",
    combatLabel: "Cruel as Death",
    combatTiming: 3
  },
  scha06: {
    id: "scha06",
    label: "Isildur's Bane",
    type: "character",
    combatLabel: "Cruel as Death",
    combatTiming: 3
  },
  scha07: {
    id: "scha07",
    label: "Foul Thing from the Deep",
    type: "character",
    combatLabel: "They are Terrible",
    combatTiming: 4
  },
  scha08: {
    id: "scha08",
    label: "Candles of Corpses",
    type: "character",
    combatLabel: "Dread and Despair",
    combatTiming: 3
  },
  scha09: {
    id: "scha09",
    label: "Nazgul Search",
    type: "character",
    combatLabel: "Foul Stench",
    combatTiming: 3
  },
  scha10: {
    id: "scha10",
    label: "Cruel Weather",
    type: "character",
    combatLabel: "Cruel as Death",
    combatTiming: 3
  },
  scha11: {
    id: "scha11",
    label: "The Nazgul Strike",
    type: "character",
    combatLabel: "Black Breath",
    combatTiming: 6
  },
  scha12: {
    id: "scha12",
    label: "Morgul Wound",
    type: "character",
    combatLabel: "Black Breath",
    combatTiming: 6
  },
  scha13: {
    id: "scha13",
    label: "Lure of the Ring",
    type: "character",
    combatLabel: "They are Terrible",
    combatTiming: 4
  },
  scha14: {
    id: "scha14",
    label: "The Breaking of the Fellowship",
    type: "character",
    combatLabel: "Dread and Despair",
    combatTiming: 3
  },
  scha15: {
    id: "scha15",
    label: "Worn with Sorrow and Toil",
    type: "character",
    combatLabel: "Words of Power",
    combatTiming: 1
  },
  scha16: {
    id: "scha16",
    label: "Flocks of Crebain",
    type: "character",
    combatLabel: "They are Terrible",
    combatTiming: 4
  },
  scha17: {
    id: "scha17",
    label: "Balrog of Moria",
    type: "character",
    combatLabel: "Durin's Bane",
    combatTiming: 2
  },
  scha18: {
    id: "scha18",
    label: "The Lidless Eye",
    type: "character",
    combatLabel: "Words of Power",
    combatTiming: 1
  },
  scha19: {
    id: "scha19",
    label: "Dreadful Spells",
    type: "character",
    combatLabel: "Delivery of Orthanc",
    combatTiming: 3
  },
  scha20: {
    id: "scha20",
    label: "Grond, Hammer of the Underworld",
    type: "character",
    combatLabel: "Dread and Despair",
    combatTiming: 3
  },
  scha21: {
    id: "scha21",
    label: "The Palantir of Orthanc",
    type: "character",
    combatLabel: "Cruel as Death",
    combatTiming: 3
  },
  scha22: {
    id: "scha22",
    label: "Wormtongue",
    type: "character",
    combatLabel: "Foul Stench",
    combatTiming: 3
  },
  scha23: {
    id: "scha23",
    label: "The Ringwraiths are Abroad",
    type: "character",
    combatLabel: "Words of Power",
    combatTiming: 1
  },
  scha24: {
    id: "scha24",
    label: "The Black Captain Commands",
    type: "character",
    combatLabel: "Foul Stench",
    combatTiming: 3
  },
  sstr01: {
    id: "sstr01",
    label: "Return to Valinor",
    type: "army",
    combatLabel: "Deadly Strife",
    combatTiming: 2
  },
  sstr02: {
    id: "sstr02",
    label: "The Fighting Uruk-hai",
    type: "army",
    combatLabel: "Onslaught",
    combatTiming: 7
  },
  sstr03: {
    id: "sstr03",
    label: "Denethor's Folly",
    type: "army",
    combatLabel: "Delivery of Orthanc",
    combatTiming: 3
  },
  sstr04: {
    id: "sstr04",
    label: "The Day Without Dawn",
    type: "army",
    combatLabel: "Relentless Assault",
    combatTiming: 3
  },
  sstr05: {
    id: "sstr05",
    label: "Threats and Promises",
    type: "muster",
    combatLabel: "Delivery of Orthanc",
    combatTiming: 3
  },
  sstr06: {
    id: "sstr06",
    label: "Stormcrow",
    type: "muster",
    combatLabel: "Great Host",
    combatTiming: 7
  },
  sstr07: {
    id: "sstr07",
    label: "Shadows Gather",
    type: "army",
    combatLabel: "Mumakil",
    combatTiming: [3, 5]
  },
  sstr08: {
    id: "sstr08",
    label: "The Shadow Lengthens",
    type: "army",
    combatLabel: "Mumakil",
    combatTiming: [3, 5]
  },
  sstr09: {
    id: "sstr09",
    label: "The Shadow is Moving",
    type: "army",
    combatLabel: "Swarm of Bats",
    combatTiming: 0
  },
  sstr10: {
    id: "sstr10",
    label: "Corsairs of Umbar",
    type: "army",
    combatLabel: "Deadly Strife",
    combatTiming: 2
  },
  sstr11: {
    id: "sstr11",
    label: "Rage of the Dunledings",
    type: "muster",
    combatLabel: "Relentless Assault",
    combatTiming: 3
  },
  sstr12: {
    id: "sstr12",
    label: "Return of the Witch-king",
    type: "muster",
    combatLabel: "Swarm of Bats",
    combatTiming: 0
  },
  sstr13: {
    id: "sstr13",
    label: "Half-orcs and Goblin-men",
    type: "army",
    combatLabel: "We Come to Kill",
    combatTiming: 7
  },
  sstr14: {
    id: "sstr14",
    label: "Olog-hai",
    type: "army",
    combatLabel: "We Come to Kill",
    combatTiming: 7
  },
  sstr15: {
    id: "sstr15",
    label: "Hill-trolls",
    type: "army",
    combatLabel: "We Come to Kill",
    combatTiming: 7
  },
  sstr16: {
    id: "sstr16",
    label: "A New Power is Rising",
    type: "muster",
    combatLabel: "Great Host",
    combatTiming: 7
  },
  sstr17: {
    id: "sstr17",
    label: "Many Kings to the Service of Mordor",
    type: "muster",
    combatLabel: "Great Host",
    combatTiming: 7
  },
  sstr18: {
    id: "sstr18",
    label: "The King is Revealed",
    type: "muster",
    combatLabel: "Relentless Assault",
    combatTiming: 3
  },
  sstr19: {
    id: "sstr19",
    label: "Shadows on the Misty Mountains",
    type: "muster",
    combatLabel: "Onslaught",
    combatTiming: 7
  },
  sstr20: {
    id: "sstr20",
    label: "Orcs Multiplying Again",
    type: "muster",
    combatLabel: "Onslaught",
    combatTiming: 7
  },
  sstr21: {
    id: "sstr21",
    label: "Horde From the East",
    type: "muster",
    combatLabel: "Deadly Strife",
    combatTiming: 2
  },
  sstr22: {
    id: "sstr22",
    label: "Monsters Rousted",
    type: "muster",
    combatLabel: "Desperate Battle",
    combatTiming: 3
  },
  sstr23: {
    id: "sstr23",
    label: "Musterings of Long-planned War",
    type: "muster",
    combatLabel: "Desperate Battle",
    combatTiming: 3
  },
  sstr24: {
    id: "sstr24",
    label: "Pits of Mordor",
    type: "muster",
    combatLabel: "Desperate Battle",
    combatTiming: 3
  }
};

const CARD_BY_LABEL = arrayUtil.toMap(
  Object.keys(CARD_BY_ID) as WotrCardId[],
  cardId => CARD_BY_ID[cardId].label,
  cardId => CARD_BY_ID[cardId]
) as Record<WotrCardLabel, WotrCard>;

export function labelToCardId(label: WotrCardLabel): WotrCardId {
  return CARD_BY_LABEL[label].id;
}

export function cardToLabel(cardId: WotrCardId): WotrCardLabel {
  return CARD_BY_ID[cardId].label;
}
export function combatCardToLabel(cardId: WotrCardId): string {
  return CARD_BY_ID[cardId].combatLabel;
}
export function getCard(cardId: WotrCardId): WotrCard {
  return CARD_BY_ID[cardId];
}
