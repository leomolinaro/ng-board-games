import { BgUser } from "@bg-services";

interface ABritUnit {
  id: string;
  nation: BritNationId;
} // ABritUnit

export interface BritArmy extends ABritUnit { }
export interface BritInfantry extends ABritUnit { }
export interface BritCavalry extends ABritUnit { }
export interface BritLeader extends ABritUnit { }
export interface BritBuilding extends ABritUnit { }
export type BritUnit = BritInfantry | BritCavalry | BritLeader | BritBuilding;

export type BritRegionId = "wales" | "england" | "scotland";

export interface BritRegion {
  id: BritRegionId;
  name: string;
} // BritRegion

export type BritLandAreaId = "avalon" | "downlands" | "wessex" | "sussex" | "kent" | "essex" | "lindsey" | "suffolk" | "norfolk" |
"south-mercia" | "north-mercia" | "hwicce" | "devon" | "cornwall" | "gwent" | "dyfed" | "powys"|
"gwynedd" | "clwyd" | "march" | "cheshire" | "york" | "bernicia" | "pennines" | "cumbria" | "lothian" | "galloway"|
"dunedin" | "strathclyde" | "dalriada" | "alban" | "mar" | "moray" | "skye" | "caithness" | "orkneys"| "hebrides";

export type BritSeaAreaId = "icelandic-sea" | "north-sea" | "frisian-sea" | "english-channel" | "irish-sea" | "atlantic-ocean";

export type BritAreaId = BritLandAreaId | BritSeaAreaId;

interface ABritArea {
  name: string;
} // ABritArea

export interface BritLandArea extends ABritArea {
  id: BritLandAreaId;
  region: BritRegionId;
  type: "land";
  difficultTerrain: boolean;
  garrisons: string[];
} // BritLandArea

export interface BritSeaArea extends ABritArea {
  id: BritSeaAreaId;
  type: "sea";
} // BritSeaArea

export type BritArea = BritLandArea | BritSeaArea;

export type BritNationId = "romans" | "romano-british" | "normans" | "saxons" | "danes" | "norwegians" |
"jutes" | "angles" | "belgae" | "welsh" | "brigantes" |
"caledonians" | "picts" | "irish" | "scots" | "norsemen" | "dubliners";

export interface BritNation {
  id: BritNationId;
  name: string;
  reinforcements: string[];
} // BritNation

export interface ABritPlayer {
  id: string;
  name: string;
  nations: string[];
} // ABritPlayer

interface BritAiPlayer extends ABritPlayer {
  isAi: true;
  isRemote: false;
  isLocal: false;
} // BritAiPlayer

interface BritRealPlayer extends ABritPlayer {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
} // BritRealPlayer

export type BritPlayer = BritAiPlayer | BritRealPlayer;

// export interface BritLogMovement { type: "movement"; movement: BritMovement; player: string; }
// export interface BritLogExpedition { type: "expedition"; land: BritLandCoordinates; player: string; }
// export interface BritLogNobleTitle { type: "nobleTitle"; resources: BritResourceType[]; player: string; }
// export interface BritLogNewCity { type: "newCity"; land: BritLandCoordinates; player: string; }
// export interface BritLogConstruction { type: "construction"; construction: BritConstruction; player: string; }
// export interface BritLogRecuitment { type: "recruitment"; land: BritLandCoordinates; player: string; }
// export interface BritLogTurn { type: "turn"; player: string; }
// export interface BritLogSetupPlacement { type: "setupPlacement"; land: BritLandCoordinates; player: string; }
// export interface BritLogSetup { type: "setup"; }

export type BritLog = never/* BritLogSetup | BritLogSetupPlacement | BritLogTurn | BritLogRecuitment | BritLogConstruction
  | BritLogNewCity | BritLogNobleTitle | BritLogExpedition | BritLogMovement */;
