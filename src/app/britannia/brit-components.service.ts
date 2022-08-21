import { Injectable } from "@angular/core";
import { arrayUtil } from "@bg-utils";
import { BritArea, BritAreaId, BritColor, BritEvent, BritInvasion, BritLandArea, BritLandAreaId, BritLeaderId, BritNation, BritNationId, BritNeighbor, BritPopulation, BritRegionId, BritRevolt, BritRound, BritRoundId, BritSeaArea, BritSeaAreaId, BritSpecialEvent, BritUnit, BritUnitId } from "./brit-components.models";

@Injectable ({
  providedIn: "root"
})
export class BritComponentsService {

  constructor () {
    this.init ();
  } // constructor

  readonly COLORS: BritColor[] = ["red", "blue", "yellow", "green"];

  readonly LAND_AREA_IDS: BritLandAreaId[] = ["avalon", "downlands", "wessex", "sussex", "kent", "essex", "lindsey", "suffolk", "norfolk",
  "south-mercia", "north-mercia", "hwicce", "devon", "cornwall", "gwent", "dyfed", "powys",
  "gwynedd", "clwyd", "march", "cheshire", "york", "bernicia", "pennines", "cumbria", "lothian", "galloway",
  "dunedin", "strathclyde", "dalriada", "alban", "mar", "moray", "skye", "caithness", "orkneys", "hebrides"];
  
  readonly SEA_AREA_IDS: BritSeaAreaId[] = ["icelandic-sea", "north-sea", "frisian-sea", "english-channel", "irish-sea", "atlantic-ocean"];
  
  readonly AREA_IDS: BritAreaId[] = [...this.LAND_AREA_IDS, ...this.SEA_AREA_IDS];
  
  readonly NATION_IDS: BritNationId[] = ["romans", "romano-british", "normans", "saxons", "danes", "norwegians",
  "jutes", "angles", "belgae", "welsh", "brigantes",
  "caledonians", "picts", "irish", "scots", "norsemen", "dubliners"];
  
  readonly POPULATIONS: BritPopulation[] = [0, 1, 2, 3, 4, 5];
  readonly ROUND_IDS: BritRoundId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  readonly AREA: Record<BritAreaId, BritArea> = { } as any;
  readonly NATION: Record<BritNationId, BritNation> = { } as any;
  readonly UNIT: Record<BritUnitId, BritUnit> = { } as any;
  readonly ROUND: Record<BritRoundId, BritRound> = { } as any;

  areasToMap<V> (getValue: (areaId: BritAreaId) => V): Record<BritAreaId, V> {
    const map: Record<BritAreaId, V> = { } as any;
    this.AREA_IDS.forEach (areaId => map[areaId] = getValue (areaId));
    return map;
  } // areasToMap

  getArea (areaId: BritAreaId): BritArea { return this.AREA[areaId]; }
  getLandArea (landAreaId: BritLandAreaId): BritLandArea { return this.AREA[landAreaId] as BritLandArea; }
  getSeaArea (seaAreaId: BritSeaAreaId): BritSeaArea { return this.AREA[seaAreaId] as BritSeaArea; }
  forEachArea (forEachArea: (area: BritArea) => void): void {
    this.AREA_IDS.forEach (areaId => forEachArea (this.AREA[areaId]));
  } // forEachArea
  
  getNationIdsOfColor (color: BritColor): BritNationId[] {
    switch (color) {
      case "yellow": return ["romans", "romano-british", "norwegians", "scots", "dubliners"];
      case "red": return ["saxons", "brigantes", "irish", "norsemen"];
      case "blue": return ["normans", "angles", "belgae", "picts"];
      case "green": return ["danes", "jutes", "welsh", "caledonians"];
    } // switch
  } // getNationIdsOfColor

  nationsToMap<V> (getValue: (nationId: BritNationId) => V): Record<BritNationId, V> {
    const map: Record<BritNationId, V> = { } as any;
    this.NATION_IDS.forEach (nationId => map[nationId] = getValue (nationId));
    return map;
  } // nationsToMap

  getNation (nationId: BritNationId): BritNation { return this.NATION[nationId]; }

  getUnit (unitId: BritUnitId): BritUnit { return this.UNIT[unitId]; }

  init () {
    // Land areas
    this.initLandArea ("avalon", "Avalon", "england", false, ["devon", "wessex", "downlands", "hwicce", "atlantic-ocean"]);
    this.initLandArea ("downlands", "Downlands", "england", true, ["avalon", "wessex", "sussex", "essex", "south-mercia", "hwicce"]);
    this.initLandArea ("wessex", "Wessex", "england", false, ["devon", "english-channel", "sussex", "downlands", "avalon"]);
    this.initLandArea ("sussex", "Sussex", "england", false, ["wessex", "english-channel", "kent", "essex", "downlands"]);
    this.initLandArea ("kent", "Kent", "england", false, ["sussex", "english-channel", "frisian-sea", "essex"]);
    this.initLandArea ("essex", "Essex", "england", false, ["downlands", "sussex", "kent", "frisian-sea", "suffolk", "south-mercia"]);
    this.initLandArea ("lindsey", "Lindsey", "england", true, ["north-mercia", "suffolk", "norfolk", "frisian-sea", "york"]);
    this.initLandArea ("suffolk", "Suffolk", "england", false, ["south-mercia", "essex", "frisian-sea", "norfolk", "lindsey", "north-mercia"]);
    this.initLandArea ("norfolk", "Norfolk", "england", false, ["suffolk", "frisian-sea", "lindsey"]);
    this.initLandArea ("south-mercia", "South Mercia", "england", false, ["hwicce", "downlands", "essex", "suffolk", "north-mercia"]);
    this.initLandArea ("north-mercia", "North Mercia", "england", false, ["march", "hwicce", "south-mercia", "suffolk", "lindsey", "york"]);
    this.initLandArea ("hwicce", "Hwicce", "england", false, ["powys", "gwent", "atlantic-ocean", "avalon", "downlands", "south-mercia", "north-mercia", "march"]);
    this.initLandArea ("devon", "Devon", "england", true, ["cornwall", "english-channel", "wessex", "avalon", "atlantic-ocean", { id: "dyfed", strait: true }, { id: "gwent", strait: true }]);
    this.initLandArea ("cornwall", "Cornwall", "england", true, ["atlantic-ocean", "english-channel", "devon"]);
    this.initLandArea ("gwent", "Gwent", "wales", true, ["dyfed", "atlantic-ocean", "hwicce", "powys", { id: "devon", strait: true }]);
    this.initLandArea ("dyfed", "Dyfed", "wales", false, ["atlantic-ocean", "gwent", "powys", { id: "devon", strait: true }]);
    this.initLandArea ("powys", "Powys", "wales", true, ["atlantic-ocean", "dyfed", "gwent", "hwicce", "march", "clwyd", "gwynedd"]);
    this.initLandArea ("gwynedd", "Gwynedd", "wales", false, ["atlantic-ocean", "powys", "clwyd"]);
    this.initLandArea ("clwyd", "Clwyd", "wales", true, ["gwynedd", "powys", "march", "cheshire", "atlantic-ocean"]);
    this.initLandArea ("march", "March", "england", false, ["powys", "hwicce", "north-mercia", "york", "cheshire", "clwyd"]);
    this.initLandArea ("cheshire", "Cheshire", "england", false, ["clwyd", "march", "york", "pennines", "cumbria", "irish-sea", "atlantic-ocean"]);
    this.initLandArea ("york", "York", "england", false, ["pennines", "cheshire", "march", "north-mercia", "lindsey", "frisian-sea", "north-sea", "bernicia"]);
    this.initLandArea ("bernicia", "Bernicia", "england", false, ["pennines", "york", "north-sea", "lothian"]);
    this.initLandArea ("pennines", "Pennines", "england", true, ["cumbria", "cheshire", "york", "bernicia", "lothian"]);
    this.initLandArea ("cumbria", "Cumbria", "england", false, ["irish-sea", "cheshire", "pennines", "lothian", "galloway"]);
    this.initLandArea ("lothian", "Lothian", "england", false, ["galloway", "cumbria", "pennines", "bernicia", "north-sea", "dunedin", "strathclyde"]);
    this.initLandArea ("galloway", "Galloway", "england", true, ["irish-sea", "cumbria", "lothian", "strathclyde"]);
    this.initLandArea ("dunedin", "Dunedin", "scotland", false, ["dalriada", "strathclyde", "lothian", "north-sea", "mar", "alban"]);
    this.initLandArea ("strathclyde", "Strathclyde", "scotland", false, ["irish-sea", "galloway", "lothian", "dunedin", "dalriada"]);
    this.initLandArea ("dalriada", "Dalriada", "scotland", true, ["irish-sea", "strathclyde", "dunedin", "alban", "skye"]);
    this.initLandArea ("alban", "Alban", "scotland", true, ["skye", "dalriada", "dunedin", "mar", "moray"]);
    this.initLandArea ("mar", "Mar", "scotland", true, ["alban", "dunedin", "north-sea", "icelandic-sea", "moray"]);
    this.initLandArea ("moray", "Moray", "scotland", true, ["skye", "alban", "mar", "icelandic-sea", "caithness"]);
    this.initLandArea ("skye", "Skye", "scotland", true, [{ id: "hebrides", strait: true }, "icelandic-sea", "irish-sea", "dalriada", "alban", "moray", "caithness"]);
    this.initLandArea ("caithness", "Caithness", "scotland", true, ["skye", "moray", "icelandic-sea", { id: "orkneys", strait: true }]);
    this.initLandArea ("orkneys", "Orkneys", "scotland", true, ["icelandic-sea", { id: "caithness", strait: true }]);
    this.initLandArea ("hebrides", "Hebrides", "scotland", true, ["icelandic-sea", { id: "skye", strait: true }]);
    // Sea areas
    this.initSeaArea ("icelandic-sea", "Icelandic Sea", ["orkneys", "hebrides", "caithness", "skye", "moray", "mar", "irish-sea", "north-sea"]);
    this.initSeaArea ("north-sea", "North Sea", ["icelandic-sea", "mar", "dunedin", "lothian", "bernicia", "york", "frisian-sea"]);
    this.initSeaArea ("frisian-sea", "Frisian Sea", ["north-sea", "york", "lindsey", "norfolk", "suffolk", "essex", "kent", "english-channel"]);
    this.initSeaArea ("english-channel", "English Channel", ["atlantic-ocean", "north-sea", "kent", "sussex", "wessex", "devon", "cornwall"]);
    this.initSeaArea ("irish-sea", "Irish Sea", ["icelandic-sea", "atlantic-ocean", "cheshire", "cumbria", "galloway", "strathclyde", "dalriada", "skye"]);
    this.initSeaArea ("atlantic-ocean", "Atlantic Ocean", ["irish-sea", "cheshire", "clwyd", "gwynedd", "powys", "dyfed", "gwent", "hwicce", "avalon", "devon", "cornwall", "english-channel"]);
    // Nations
    this.initNation ("romans", "Romans", "yellow", 16, 0, 24, []);
    this.initNation ("romano-british", "Romano-British", "yellow", 8, 0, 0, [["arthur", "Arthur"]]);
    this.initNation ("normans", "Normans", "blue", 8, 0, 0, [["william", "William"]]);
    this.initNation ("saxons", "Saxons", "red", 20, 0, 8, [["aelle", "Aelle"], ["egbert", "Egbert"], ["alfred", "Alfred"], ["edgar", "Edgar"], ["harold", "Harold"]]);
    this.initNation ("danes", "Danes", "green", 18, 0, 0, [["ivar-and-halfdan", "Ivar and Halfdan"], ["cnut", "Cnut"], ["svein-estrithson", "Svein Estrithson"]]);
    this.initNation ("norwegians", "Norwegians", "yellow", 12, 0, 0, [["harald-hardrada", "Harald Hardrada"]]);
    this.initNation ("jutes", "Jutes", "green", 6, 0, 0, []);
    this.initNation ("angles", "Angles", "blue", 17, 0, 0, [["ida", "Ida"], ["oswiu", "Oswiu"], ["offa", "Offa"]]);
    this.initNation ("belgae", "Belgae", "blue", 10, 0, 0, [["boudicca", "Boudicca"]]);
    this.initNation ("welsh", "Welsh", "green", 13, 0, 0, []);
    this.initNation ("brigantes", "Brigantes", "red", 11, 0, 0, [["urien", "Urien"]]);
    this.initNation ("caledonians", "Caledonians", "green", 7, 0, 0, []);
    this.initNation ("picts", "Picts", "blue", 10, 0, 0, []);
    this.initNation ("irish", "Irish", "red", 8, 0, 0, []);
    this.initNation ("scots", "Scots", "yellow", 11, 0, 0, [["fergus-mor-mac-erc", "Fergus Mor Mac Erc"]]);
    this.initNation ("norsemen", "Norsemen", "red", 10, 0, 0, [["ketil-flatnose", "Ketil Flatnose"]]);
    this.initNation ("dubliners", "Dubliners", "yellow", 9, 0, 0, [["olaf-guthfrithsson", "Olaf Guthfrithsson"]])
    // Rounds
    this.initRound (1, 43, 60, [],
      new BritEventBuilder ("romans").special ("romans-invasion").invasion ("english-channel", 16).majorInvasion ().build (),
      new BritEventBuilder ("belgae").special ("boudicca-revolt").revolt (1).leader ("boudicca").build ()
    );
    this.initRound (2, 60, 100, [],
      new BritEventBuilder ("romans").special ("romans-withdrawal").build ()
    );
    this.initRound (3, 100, 250, [],
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().build ()
    );
    this.initRound (4, 250, 340, [],
      new BritEventBuilder ("caledonians").boats ().build (),
      new BritEventBuilder ("picts").raiding ().boats ().build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 2).raiding ().boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 1).raiding ().build (),
      new BritEventBuilder ("saxons").invasion ("english-channel", 3).raiding ().build (),
      new BritEventBuilder ("jutes").invasion ("english-channel", 2).raiding ().build (),
      new BritEventBuilder ("angles").invasion ("frisian-sea", 3).raiding ().build ()
    );
    this.initRound (5, 340, 430, ["scoring"],
      new BritEventBuilder ("caledonians").boats ().build (),
      new BritEventBuilder ("picts").raiding ().boats ().build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 2).raiding ().boats ().build (),
      new BritEventBuilder ("saxons").invasion ("english-channel", 3).raiding ().boats ().build (),
      new BritEventBuilder ("jutes").invasion ("english-channel", 2).raiding ().boats ().build (),
      new BritEventBuilder ("angles").invasion ("frisian-sea", 3).raiding ().boats ().build ()
    );
    this.initRound (6, 430, 485, [],
      new BritEventBuilder ("romans").special ("romans-replacement").build (),
      new BritEventBuilder ("caledonians").boats ().build (),
      new BritEventBuilder ("picts").boats ().build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 2).raiding ().boats ().build (),
      new BritEventBuilder ("saxons").invasion ("frisian-sea", 8).leader ("aelle").majorInvasion ().boats ().build (),
      new BritEventBuilder ("jutes").invasion ("english-channel", 1).boats ().build (),
      new BritEventBuilder ("angles").invasion ("north-sea", 4).boats ().build ()
    );
    this.initRound (7, 485, 560, ["scoring"],
      new BritEventBuilder ("romano-british").revolt (0, 2).leader ("arthur").build (),
      new BritEventBuilder ("brigantes").leader ("urien").build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 3).leader ("fergus-mor-mac-erc").majorInvasion ().raiding ().boats ().build (),
      new BritEventBuilder ("saxons").invasion ("frisian-sea", 4).boats ().build (),
      new BritEventBuilder ("jutes").boats ().build (),
      new BritEventBuilder ("angles").invasion ("north-sea", 7).leader ("ida").majorInvasion ().boats ().build ()
    );
    this.initRound (8, 560, 635, ["bretwalda"],
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 1).build (),
      new BritEventBuilder ("saxons").boats ().build (),
      new BritEventBuilder ("jutes").boats ().build (),
      new BritEventBuilder ("angles").invasion ("north-sea", 2).boats ().build ()
    );
    this.initRound (9, 635, 710, ["bretwalda"],
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).build (),
      new BritEventBuilder ("scots").boats ().build (),
      new BritEventBuilder ("angles").special ("oswiu-invasion").leader ("oswiu").boats ().build ()
    );
    this.initRound (10, 710, 785, ["bretwalda", "scoring"],
      new BritEventBuilder ("saxons").boats ().build (),
      new BritEventBuilder ("angles").special ("offa-invasion").leader ("offa").boats ().build ()
    );
    this.initRound (11, 785, 860, ["king"],
      new BritEventBuilder ("norsemen").invasion ("icelandic-sea", 5).leader ("ketil-flatnose").majorInvasion ().raiding ().boats ().build (),
      new BritEventBuilder ("danes").special ("danes-first-invasion").invasion ("north-sea", 4).invasion ("frisian-sea", 4).raiding ().build (),
      new BritEventBuilder ("saxons").leader ("egbert").build (),
    );
    this.initRound (12, 860, 935, ["king"],
      new BritEventBuilder ("norsemen").invasion ("irish-sea", 2).invasion ("atlantic-ocean", 2).raiding ().boats ().build (),
      new BritEventBuilder ("dubliners").invasion ("irish-sea", 2).raiding ().build (),
      new BritEventBuilder ("danes").invasion ("north-sea", 6).leader ("ivar-and-halfdan").majorInvasion ().boats ().build (),
      new BritEventBuilder ("saxons").leader ("alfred").build (),
    );
    this.initRound (13, 935, 985, ["king", "scoring"],
      new BritEventBuilder ("norsemen").boats ().build (),
      new BritEventBuilder ("dubliners").invasion ("irish-sea", 5).leader ("olaf-guthfrithsson").majorInvasion ().boats ().build (),
      new BritEventBuilder ("danes").invasion ("north-sea", 2).boats ().build (),
      new BritEventBuilder ("saxons").leader ("edgar").build (),
    );
    this.initRound (14, 985, 1035, ["king"],
      new BritEventBuilder ("norsemen").boats ().build (),
      new BritEventBuilder ("dubliners").invasion ("irish-sea", 3).boats ().build (),
      new BritEventBuilder ("danes").special ("cnut-invasion").invasion ("frisian-sea", 6).leader ("cnut").boats ().build ()
    );
    this.initRound (15, 1035, 1066, [],
      new BritEventBuilder ("danes").boats ().build (),
      new BritEventBuilder ("norwegians").invasion ("north-sea", 10).leader ("harald-hardrada").majorInvasion ().boats ().build (),
      new BritEventBuilder ("saxons").leader ("harold").build (),
      new BritEventBuilder ("normans").invasion ("english-channel", 6, 4).leader ("william").majorInvasion ().build ()
    );
    this.initRound (16, 1066, 1085, ["king", "scoring"],
      new BritEventBuilder ("danes").invasion ("frisian-sea", 3).leader ("svein-estrithson").boats ().build (),
      new BritEventBuilder ("norwegians").special ("norwegians-reinforcements").boats ().build (),
      new BritEventBuilder ("saxons").special ("saxons-reinforcements").build (),
      new BritEventBuilder ("normans").special ("normans-reinforcements").build ()
    );
  } // init

  private initLandArea (id: BritLandAreaId, name: string, region: BritRegionId, difficultTerrain: boolean, neighbors: BritNeighbor[]) {
    this.AREA[id] = {
      id: id,
      name: name,
      region: region,
      type: "land",
      difficultTerrain: difficultTerrain,
      neighbors: neighbors
    };
  } // initLandArea
  
  private initSeaArea (id: BritSeaAreaId, name: string, neighbors: BritAreaId[]) {
    this.AREA[id] = {
      id: id,
      name: name,
      type: "sea",
      neighbors: neighbors,
    };
  } // initSeaArea

  private initNation (nationId: BritNationId, label: string, color: BritColor, nInfantries: number, nCavalries: number, nBuildings: number, leaderIdAndNames: [BritLeaderId, string][]) {
    const infantryIds = arrayUtil.range (nInfantries, index => this.initInfantry (nationId, label, color, index));
    const cavalryIds = arrayUtil.range (nCavalries, index => this.initCavalry (nationId, label, color, index));
    const buildingIds = nBuildings
      ? (nationId === "romans"
        ? arrayUtil.range (nBuildings, index => this.initRomanFort (nationId, label, color, index))
        : (nationId === "saxons"
          ? arrayUtil.range (nBuildings, index => this.initSaxonBuhr (nationId, label, color, index))
          : []))
      : [];
    leaderIdAndNames.map (l => this.initLeader (l[0], l[1], nationId, label, color));
    this.NATION[nationId] = {
      id: nationId,
      label: label,
      color: color,
      infantryIds: infantryIds,
      cavalryIds: cavalryIds,
      buildingIds: buildingIds,
      leaderIds: leaderIdAndNames.map (u => u[0])
    };
  } // initNation

  private initInfantry (nationId: BritNationId, nationLabel: string, nationColor: BritColor, infantryIndex: number): BritUnitId {
    const id = `${nationId}-infantry-${infantryIndex}`;
    this.UNIT[id] = {
      id,
      type: "infantry",
      nationId,
      nationLabel,
      typeLabel: "Infantry",
      nationColor
    };
    return id;
  } // initInfantry
  
  private initCavalry (nationId: BritNationId, nationLabel: string, nationColor: BritColor, cavalryIndex: number): BritUnitId {
    const id = `${nationId}-cavalry-${cavalryIndex}`;
    this.UNIT[id] = {
      id,
      type: "cavalry",
      nationId,
      nationLabel,
      typeLabel: "Cavalry",
      nationColor
    };
    return id;
  } // createCavalry
  
  private initRomanFort (nationId: BritNationId & "romans", nationLabel: string, nationColor: BritColor, fortIndex: number): BritUnitId {
    const id = `${nationId}-fort-${fortIndex}`;
    this.UNIT[id] = {
      id,
      type: "roman-fort",
      nationId,
      nationLabel,
      typeLabel: "Fort",
      nationColor
    };
    return id;
  } // createRomanFort
  
  private initSaxonBuhr (nationId: BritNationId & "saxons", nationLabel: string, nationColor: BritColor, fortIndex: number): BritUnitId {
    const id = `${nationId}-fort-${fortIndex}`;
    this.UNIT[id] = {
      id,
      type: "saxon-buhr",
      nationId,
      nationLabel,
      typeLabel: "Buhr",
      nationColor
    };
    return id;
  } // initSaxonBuhr
  
  private initLeader (leaderId: BritLeaderId, leaderName: string, nationId: BritNationId, nationLabel: string, nationColor: BritColor) {
    this.UNIT[leaderId] = {
      id: leaderId,
      type: "leader",
      nationId,
      name: leaderName,
      nationLabel,
      typeLabel: "Leader",
      nationColor
    };
  } // initLeader

  private initRound (roundId: BritRoundId, fromYear: number, toYear: number, types: ("scoring" | "bretwalda" | "king")[], ...events: BritEvent[]) {
    this.ROUND[roundId] = {
      id: roundId,
      fromYear,
      toYear,
      scoring: types.includes ("scoring"),
      bretwaldaElection: types.includes ("bretwalda"),
      kingElection: types.includes ("king"),
      events
    };
  } // initRound
  
} // BritRulesComponentsService

class BritEventBuilder {
  
  constructor (
    private nation: BritNationId
  ) { }

  private _invasions: BritInvasion[] | null = null;
  private _revolt: BritRevolt | null = null;
  private _majorInvasion: boolean = false;
  private _raiding: boolean = false;
  private _boats: boolean = false;
  private _special: BritSpecialEvent | null = null;
  private _leader: BritLeaderId | null = null;

  leader (leader: BritLeaderId) { this._leader = leader; return this; }
  special (special: BritSpecialEvent) { this._special = special; return this; }
  majorInvasion () { this._majorInvasion = true; return this; }
  raiding () { this._raiding = true; return this; }
  boats () { this._boats = true; return this; }
  revolt (infantries: number, cavalries?: number) {
    this._revolt = {
      infantries,
      cavalries: cavalries || 0
    };
    return this;
  } // revolt
  invasion (area: BritSeaAreaId, infantries: number, cavalries?: number) {
    if (!this._invasions) { this._invasions = []; }
    this._invasions.push ({
      area,
      infantries,
      cavalries: cavalries || 0
    })
    return this;
  } // invasion

  build (): BritEvent {
    return {
      nation: this.nation,
      boats: this._boats,
      majorInvasion: this._majorInvasion,
      raiding: this._raiding,
      leader: this._leader,
      special: this._special,
      invasions: this._invasions,
      revolt: this._revolt
    };
  } // build

} // BritEventBuilder
