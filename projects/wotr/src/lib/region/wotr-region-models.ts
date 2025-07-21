import { WotrFrontId } from "../front/wotr-front-models";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrArmy, WotrFreeUnits } from "../unit/wotr-unit-models";

export type WotrRegionId =
  | "forlindon"
  | "north-ered-luin"
  | "ered-luin"
  | "grey-havens"
  | "harlindon"
  | "tower-hills"
  | "evendim"
  | "arnor"
  | "north-downs"
  | "bree"
  | "buckland"
  | "the-shire"
  | "south-ered-luin"
  | "minhiriath"
  | "cardolan"
  | "old-forest"
  | "south-downs"
  | "weather-hills"
  | "ettenmoors"
  | "angmar"
  | "mount-gram"
  | "mount-gundabad"
  | "troll-shaws"
  | "rivendell"
  | "fords-of-bruinen"
  | "hollin"
  | "moria"
  | "north-dunland"
  | "tharbad"
  | "south-dunland"
  | "enedwaith"
  | "gap-of-rohan"
  | "orthanc"
  | "druwaith-iaur"
  | "andrast"
  | "high-pass"
  | "goblins-gate"
  | "eagles-eyre"
  | "old-ford"
  | "gladden-fields"
  | "dimrill-dale"
  | "lorien"
  | "parth-celebrant"
  | "fangorn"
  | "fords-of-isen"
  | "helms-deep"
  | "westemnet"
  | "edoras"
  | "folde"
  | "eastemnet"
  | "anfalas"
  | "erech"
  | "dol-amroth"
  | "lamedon"
  | "pelargir"
  | "lossarnach"
  | "minas-tirith"
  | "druadan-forest"
  | "carrock"
  | "rhosgobel"
  | "north-anduin-vale"
  | "south-anduin-vale"
  | "western-brown-lands"
  | "western-emyn-muil"
  | "dead-marshes"
  | "osgiliath"
  | "south-ithilien"
  | "north-ithilien"
  | "eastern-emyn-muil"
  | "eastern-brown-lands"
  | "dagorlad"
  | "ash-mountains"
  | "noman-lands"
  | "southern-dorwinion"
  | "northern-dorwinion"
  | "southern-rhovanion"
  | "northern-rhovanion"
  | "vale-of-the-celduin"
  | "vale-of-the-carnen"
  | "eastern-mirkwood"
  | "narrows-of-the-forest"
  | "dol-guldur"
  | "southern-mirkwood"
  | "old-forest-road"
  | "western-mirkwood"
  | "northern-mirkwood"
  | "withered-heath"
  | "woodland-realm"
  | "dale"
  | "erebor"
  | "iron-hills"
  | "north-rhun"
  | "east-rhun"
  | "south-rhun"
  | "morannon"
  | "minas-morgul"
  | "gorgoroth"
  | "nurn"
  | "barad-dur"
  | "west-harondor"
  | "east-harondor"
  | "umbar"
  | "near-harad"
  | "far-harad"
  | "khand";

export type WotrNeighbor = { id: WotrRegionId; impassable: boolean };

export type WotrSettlentType = "town" | "city" | "stronghold";

export interface WotrRegion {
  id: WotrRegionId;
  name: string;
  nationId?: WotrNationId;
  frontId?: WotrFrontId; // original controller, only if settlement
  seaside: boolean;
  neighbors: WotrNeighbor[];
  fortification?: true;
  settlement?: WotrSettlentType;
  army?: WotrArmy;
  freeUnits?: WotrFreeUnits;
  underSiegeArmy?: WotrArmy;
  fellowship: boolean;
  controlledBy?: WotrFrontId; // only if settlement
}
