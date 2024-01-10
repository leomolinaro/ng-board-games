export type WotrFront = "free-peoples" | "shadow";

export type WotrRegionId =
  "forlindon" | "north-ered-luin" | "ered-luin" | "grey-havens" | "harlindon" | "tower-hills" |
  "evendim" | "arnor" | "north-downs" | "bree" | "buckland" | "the-shire" | "south-ered-luin" | "minhiriath" |
  "cardolan" | "old-forest" | "south-downs" | "weather-hills" | "ettenmoors" | "angmar" | "mount-gram" |
  "mount-gundabad" | "troll-shaws" | "rivendell" | "fords-of-bruinen" | "hollin" | "moria" | "north-dunland" | "tharbad" |
  "south-dunland" | "enedwaith" | "gap-of-rohan" | "orthanc" | "druwaith-iaur" | "andrast" | "high-pass" | "goblins-gate" |
  "eagles-eyre" | "old-ford" | "gladden-fields" | "dimrill-dale" | "lorien" | "parth-celebrant" | "fangorn" | "fords-of-isen" |
  "helms-deep" | "westemnet" | "edoras" | "folde" | "eastemnet" | "anfalas" | "erech" | "dol-amroth" | "lamedon" | "pelargir" |
  "lossarnach" | "minas-tirith" | "druadan-forest" | "carrock" | "rhosgobel" | "north-anduin-vale" | "south-anduin-vale" |
  "western-brown-lands" | "western-emyn-muil" | "dead-marshes" | "osgiliath" | "south-ithilien" | "north-ithilien" | "eastern-emyn-muil" |
  "eastern-brown-lands" | "dagorlad" | "ash-mountains" | "noman-lands" | "southern-dorwinion" | "northern-dorwinion" | "southern-rhovanion" |
  "northern-rhovanion" | "vale-of-the-celduin" | "vale-of-the-carnen" | "eastern-mirkwood" | "narrows-of-the-forest" | "dol-guldur" |
  "southern-mirkwood" | "old-forest-road" | "western-mirkwood" | "northern-mirkwood" | "withered-heath" | "woodland-realm" | "dale" |
  "erebor" | "iron-hills" | "north-rhun" | "east-rhun" | "south-rhun" | "morannon" | "minas-morgul" | "gorgoroth" | "nurn" | "barad-dur" |
  "west-harondor" | "east-harondor" | "umbar" | "near-harad" | "far-harad" | "khand";

export type WotrNeighbor = { id: WotrRegionId; impassable: boolean };

export type WotrSettlentType = "town" | "city" | "stronghold";

export interface WotrRegion {
  id: WotrRegionId;
  name: string;
  nationId: WotrNationId | null;
  seaside: boolean;
  neighbors: WotrNeighbor[];
  fortification: boolean;
  settlement: WotrSettlentType | null;
} // WotrRegion

export type WotrNationId = "dwarves" | "elves" | "gondor" | "the-north" | "rohan" | "isengard" | "sauron" | "southrons-&-esterlings";

export interface WotrNation {
  id: WotrNationId;
  label: string;
  front: WotrFront;
  nRegulars: number;
  nElites: number;
  nLeaders?: number;
  nNazgul?: number;
} // WotrNation

export type WotrCompanion = "gandalf" | "strider" | "boromir" | "legolas" | "gimli" | "meriadoc" | "peregrin" | "aragorn";
export type WotrMinion = "saruman" | "the-witch-king" | "the-mouth-of-sauron";
export type WotrUnitType = "regular" | "elite" | "leader" | "nazgul";

export type WotrPhase = 1 | 2 | 3 | 4 | 5 | 6;

export type WotrFreePeopleCharacterCardId = "";
export type WotrFreePeopleStrategyCardId = "";
export type WotrShadowCharacterCardId = "";
export type WotrShadowStrategyCardId = "";
export type WotrFreePeopleCardId = WotrFreePeopleCharacterCardId | WotrFreePeopleStrategyCardId;
export type WotrShadowCardId = WotrShadowCharacterCardId | WotrShadowStrategyCardId;
export type WotrCharacterCardId = WotrFreePeopleCharacterCardId | WotrShadowCharacterCardId;
export type WotrStrategyCardId = WotrFreePeopleStrategyCardId | WotrShadowStrategyCardId;
export type WotrCardId = WotrCharacterCardId | WotrStrategyCardId;

export type WotrFreePeopleActionDie = "character" | "army" | "muster" | "event" | "muster-army" | "will-of-the-west";
export type WotrShadowActionDie = "character" | "army" | "muster" | "event" | "muster-army" | "eye";
export type WotrActionDie = WotrFreePeopleActionDie | WotrShadowActionDie;

export type WotrCombatDie = 1 | 2 | 3 | 4 | 5 | 6;

export type WotrHuntTile = never;
