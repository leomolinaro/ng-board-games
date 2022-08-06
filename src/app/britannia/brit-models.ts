import { BgUser } from "@bg-services";

export type BritColor = "blue" | "yellow" | "red" | "green";

interface ABritUnit {
  id: BritUnitId;
  nation: BritNationId;
  nationLabel: string;
  type: string;
  typeLabel: string;
  nationColor: BritColor;
} // ABritUnit

export type BritLeaderId = "arthur" | "william" | "aelle" | "egbert" | "alfred" | "edgar" | "harold" |
"ivar-and-halfdan" | "cnut" | "svein-estrithson" | "harald-hardrada" | "ida" | "oswiu" | "offa" |
"boudicca" | "urien" | "fergus-mor-mac-erc" | "ketil-flatnose" | "olaf-guthfrithsson";

export interface BritArmy extends ABritUnit { }
export interface BritInfantry extends ABritUnit { type: "infantry"; }
export interface BritCavalry extends ABritUnit { type: "cavalry"; }
export interface BritLeader extends ABritUnit {
  id: BritLeaderId;
  type: "leader";
  name: string;
} // BritLeader
export interface BritBuilding extends ABritUnit { }
export interface BritRomanFort extends BritBuilding { type: "roman-fort"; }
export interface BritSaxonBuhr extends BritBuilding { type: "saxon-buhr"; }
export type BritUnit = BritInfantry | BritCavalry | BritLeader | BritRomanFort | BritSaxonBuhr;
export type BritUnitId = string;

export type BritRegionId = "wales" | "england" | "scotland";

export type BritPopulation = 0 | 1 | 2 | 3 | 4 | 5;

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

export function isBritLandAreaId (areaId: BritAreaId): areaId is BritLandAreaId {
  return !isBritSeaAreaId (areaId);
} // isBritLandAreaId

export function isBritSeaAreaId (areaId: BritAreaId): areaId is BritSeaAreaId {
  switch (areaId) {
    case "icelandic-sea":
    case "north-sea":
    case "frisian-sea":
    case "english-channel":
    case "irish-sea":
    case "atlantic-ocean": return true;
    default: return false;
  } // switch
} // isBritSeaAreaId

export type BritNeighbor = BritAreaId | { id: BritAreaId, strait: true };

interface ABritArea {
  name: string;
  neighbors: BritNeighbor[];
  units: string[];
} // ABritArea

export interface BritLandArea extends ABritArea {
  id: BritLandAreaId;
  region: BritRegionId;
  type: "land";
  difficultTerrain: boolean;
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
  label: string;
  color: BritColor;
  infantries: string[];
  cavalries: string[];
  buildings: string[];
  leaders: string[];
  population: BritPopulation | null;
} // BritNation

export type BritRoundId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;

export interface BritRound {
  id: BritRoundId;
  fromYear: number;
  toYear: number;
  events: BritEvent[];
  scoring: boolean;
  bretwaldaElection: boolean;
  kingElection: boolean;
} // BritRound

export interface BritEvent {
  nation: BritNationId;
  invasions: BritInvasion[] | null;
  revolt: BritRevolt | null;
  majorInvasion: boolean;
  raiding: boolean;
  boats: boolean;
  special: BritSpecialEvent | null;
  leader: BritLeaderId | null;
} // BritEvent

export type BritSpecialEvent =
  "romans-invasion" | "boudicca-revolt" | "romans-withdrawal" | "romans-replacement" |
  "oswiu-invasion" | "offa-invasion" |
  "danes-first-invasion" | "cnut-invasion" |
  "norwegians-reinforcements" | "saxons-reinforcements" | "normans-reinforcements";

export interface BritInvasion {
  infantries: number;
  cavalries: number;
  area: BritSeaAreaId;
} // BritInvasion

export interface BritRevolt {
  infantries: number;
  cavalries: number;
} // BritRevolt

export interface ABritPlayer {
  id: string;
  name: string;
  nations: BritNationId[];
  color: BritColor;
  score: number;
} // ABritPlayer

export interface BritAiPlayer extends ABritPlayer {
  isAi: true;
  isRemote: false;
  isLocal: false;
} // BritAiPlayer

export interface BritRealPlayer extends ABritPlayer {
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

export type BritStory =  { };

export interface BritSetup {
  areas: Record<BritAreaId, [BritNationId, number] | BritNationId | null>;
  populationMarkers: BritNationId[];
} // BritSetup
