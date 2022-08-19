import { Injectable } from "@angular/core";
import { arrayUtil } from "@bg-utils";
import { BritArea, BritAreaId, BritBuilding, BritCavalry, BritColor, BritEvent, BritInfantry, BritInvasion, BritLandArea, BritLandAreaId, BritLeader, BritLeaderId, BritNation, BritNationId, BritNeighbor, BritPopulation, BritRegionId, BritRevolt, BritRomanFort, BritRound, BritRoundId, BritSaxonBuhr, BritSeaArea, BritSeaAreaId, BritSpecialEvent, BritUnit } from "./brit-components.models";

@Injectable ({
  providedIn: "root"
})
export class BritComponentsService {

  constructor () { }

  readonly COLORS: BritColor[] = ["red", "blue", "yellow", "green"];

  readonly LAND_AREA_IDS: BritLandAreaId[] = ["avalon", "downlands", "wessex", "sussex", "kent", "essex", "lindsey", "suffolk", "norfolk",
  "south-mercia", "north-mercia", "hwicce", "devon", "cornwall", "gwent", "dyfed", "powys",
  "gwynedd", "clwyd", "march", "cheshire", "york", "bernicia", "pennines", "cumbria", "lothian", "galloway",
  "dunedin", "strathclyde", "dalriada", "alban", "mar", "moray", "skye", "caithness", "orkneys", "hebrides"];
  
  readonly SEA_AREA_IDS: BritSeaAreaId[] = ["icelandic-sea", "north-sea", "frisian-sea", "english-channel", "irish-sea", "atlantic-ocean"];
  
  readonly AREA_IDS: BritAreaId[] = [...this.LAND_AREA_IDS, ...this.SEA_AREA_IDS];
  
  readonly britNations: BritNationId[] = ["romans", "romano-british", "normans", "saxons", "danes", "norwegians",
  "jutes", "angles", "belgae", "welsh", "brigantes",
  "caledonians", "picts", "irish", "scots", "norsemen", "dubliners"];
  
  readonly POPULATIONS: BritPopulation[] = [0, 1, 2, 3, 4, 5];
  readonly ROUND_IDS: BritRoundId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

  createAreas (): BritArea[] {
    return [
      this.createLandArea ("avalon", "Avalon", "england", false, ["devon", "wessex", "downlands", "hwicce", "atlantic-ocean"]),
      this.createLandArea ("downlands", "Downlands", "england", true, ["avalon", "wessex", "sussex", "essex", "south-mercia", "hwicce"]),
      this.createLandArea ("wessex", "Wessex", "england", false, ["devon", "english-channel", "sussex", "downlands", "avalon"]),
      this.createLandArea ("sussex", "Sussex", "england", false, ["wessex", "english-channel", "kent", "essex", "downlands"]),
      this.createLandArea ("kent", "Kent", "england", false, ["sussex", "english-channel", "frisian-sea", "essex"]),
      this.createLandArea ("essex", "Essex", "england", false, ["downlands", "sussex", "kent", "frisian-sea", "suffolk", "south-mercia"]),
      this.createLandArea ("lindsey", "Lindsey", "england", true, ["north-mercia", "suffolk", "norfolk", "frisian-sea", "york"]),
      this.createLandArea ("suffolk", "Suffolk", "england", false, ["south-mercia", "essex", "frisian-sea", "norfolk", "lindsey", "north-mercia"]),
      this.createLandArea ("norfolk", "Norfolk", "england", false, ["suffolk", "frisian-sea", "lindsey"]),
      this.createLandArea ("south-mercia", "South Mercia", "england", false, ["hwicce", "downlands", "essex", "suffolk", "north-mercia"]),
      this.createLandArea ("north-mercia", "North Mercia", "england", false, ["march", "hwicce", "south-mercia", "suffolk", "lindsey", "york"]),
      this.createLandArea ("hwicce", "Hwicce", "england", false, ["powys", "gwent", "atlantic-ocean", "avalon", "downlands", "south-mercia", "north-mercia", "march"]),
      this.createLandArea ("devon", "Devon", "england", true, ["cornwall", "english-channel", "wessex", "avalon", "atlantic-ocean", { id: "dyfed", strait: true }, { id: "gwent", strait: true }]),
      this.createLandArea ("cornwall", "Cornwall", "england", true, ["atlantic-ocean", "english-channel", "devon"]),
      this.createLandArea ("gwent", "Gwent", "wales", true, ["dyfed", "atlantic-ocean", "hwicce", "powys", { id: "devon", strait: true }]),
      this.createLandArea ("dyfed", "Dyfed", "wales", false, ["atlantic-ocean", "gwent", "powys", { id: "devon", strait: true }]),
      this.createLandArea ("powys", "Powys", "wales", true, ["atlantic-ocean", "dyfed", "gwent", "hwicce", "march", "clwyd", "gwynedd"]),
      this.createLandArea ("gwynedd", "Gwynedd", "wales", false, ["atlantic-ocean", "powys", "clwyd"]),
      this.createLandArea ("clwyd", "Clwyd", "wales", true, ["gwynedd", "powys", "march", "cheshire", "atlantic-ocean"]),
      this.createLandArea ("march", "March", "england", false, ["powys", "hwicce", "north-mercia", "york", "cheshire", "clwyd"]),
      this.createLandArea ("cheshire", "Cheshire", "england", false, ["clwyd", "march", "york", "pennines", "cumbria", "irish-sea", "atlantic-ocean"]),
      this.createLandArea ("york", "York", "england", false, ["pennines", "cheshire", "march", "north-mercia", "lindsey", "frisian-sea", "north-sea", "bernicia"]),
      this.createLandArea ("bernicia", "Bernicia", "england", false, ["pennines", "york", "north-sea", "lothian"]),
      this.createLandArea ("pennines", "Pennines", "england", true, ["cumbria", "cheshire", "york", "bernicia", "lothian"]),
      this.createLandArea ("cumbria", "Cumbria", "england", false, ["irish-sea", "cheshire", "pennines", "lothian", "galloway"]),
      this.createLandArea ("lothian", "Lothian", "england", false, ["galloway", "cumbria", "pennines", "bernicia", "north-sea", "dunedin", "strathclyde"]),
      this.createLandArea ("galloway", "Galloway", "england", true, ["irish-sea", "cumbria", "lothian", "strathclyde"]),
      this.createLandArea ("dunedin", "Dunedin", "scotland", false, ["dalriada", "strathclyde", "lothian", "north-sea", "mar", "alban"]),
      this.createLandArea ("strathclyde", "Strathclyde", "scotland", false, ["irish-sea", "galloway", "lothian", "dunedin", "dalriada"]),
      this.createLandArea ("dalriada", "Dalriada", "scotland", true, ["irish-sea", "strathclyde", "dunedin", "alban", "skye"]),
      this.createLandArea ("alban", "Alban", "scotland", true, ["skye", "dalriada", "dunedin", "mar", "moray"]),
      this.createLandArea ("mar", "Mar", "scotland", true, ["alban", "dunedin", "north-sea", "icelandic-sea", "moray"]),
      this.createLandArea ("moray", "Moray", "scotland", true, ["skye", "alban", "mar", "icelandic-sea", "caithness"]),
      this.createLandArea ("skye", "Skye", "scotland", true, [{ id: "hebrides", strait: true }, "icelandic-sea", "irish-sea", "dalriada", "alban", "moray", "caithness"]),
      this.createLandArea ("caithness", "Caithness", "scotland", true, ["skye", "moray", "icelandic-sea", { id: "orkneys", strait: true }]),
      this.createLandArea ("orkneys", "Orkneys", "scotland", true, ["icelandic-sea", { id: "caithness", strait: true }]),
      this.createLandArea ("hebrides", "Hebrides", "scotland", true, ["icelandic-sea", { id: "skye", strait: true }]),
      this.createSeaArea ("icelandic-sea", "Icelandic Sea", ["orkneys", "hebrides", "caithness", "skye", "moray", "mar", "irish-sea", "north-sea"]),
      this.createSeaArea ("north-sea", "North Sea", ["icelandic-sea", "mar", "dunedin", "lothian", "bernicia", "york", "frisian-sea"]),
      this.createSeaArea ("frisian-sea", "Frisian Sea", ["north-sea", "york", "lindsey", "norfolk", "suffolk", "essex", "kent", "english-channel"]),
      this.createSeaArea ("english-channel", "English Channel", ["atlantic-ocean", "north-sea", "kent", "sussex", "wessex", "devon", "cornwall"]),
      this.createSeaArea ("irish-sea", "Irish Sea", ["icelandic-sea", "atlantic-ocean", "cheshire", "cumbria", "galloway", "strathclyde", "dalriada", "skye"]),
      this.createSeaArea ("atlantic-ocean", "Atlantic Ocean", ["irish-sea", "cheshire", "clwyd", "gwynedd", "powys", "dyfed", "gwent", "hwicce", "avalon", "devon", "cornwall", "english-channel"]),
    ];
  } // createAreas
  
  private createLandArea (id: BritLandAreaId, name: string, region: BritRegionId, difficultTerrain: boolean, neighbors: BritNeighbor[]): BritLandArea {
    return {
      id: id,
      name: name,
      region: region,
      type: "land",
      difficultTerrain: difficultTerrain,
      units: [],
      neighbors: neighbors
    };
  } // this.createLandArea
  
  private createSeaArea (id: BritSeaAreaId, name: string, neighbors: BritAreaId[]): BritSeaArea {
    return {
      id: id,
      name: name,
      type: "sea",
      neighbors: neighbors,
      units: []
    };
  } // this.createLandArea
  
  createNationsAndUnits (): { nation: BritNation; units: BritUnit[] }[] {
    return [
      this.createNation ("romans", "Romans", "yellow", 16, 0, 24, []),
      this.createNation ("romano-british", "Romano-British", "yellow", 8, 0, 0, [["arthur", "Arthur"]]),
      this.createNation ("normans", "Normans", "blue", 8, 0, 0, [["william", "William"]]),
      this.createNation ("saxons", "Saxons", "red", 20, 0, 8, [["aelle", "Aelle"], ["egbert", "Egbert"], ["alfred", "Alfred"], ["edgar", "Edgar"], ["harold", "Harold"]]),
      this.createNation ("danes", "Danes", "green", 18, 0, 0, [["ivar-and-halfdan", "Ivar and Halfdan"], ["cnut", "Cnut"], ["svein-estrithson", "Svein Estrithson"]]),
      this.createNation ("norwegians", "Norwegians", "yellow", 12, 0, 0, [["harald-hardrada", "Harald Hardrada"]]),
      this.createNation ("jutes", "Jutes", "green", 6, 0, 0, []),
      this.createNation ("angles", "Angles", "blue", 17, 0, 0, [["ida", "Ida"], ["oswiu", "Oswiu"], ["offa", "Offa"]]),
      this.createNation ("belgae", "Belgae", "blue", 10, 0, 0, [["boudicca", "Boudicca"]]),
      this.createNation ("welsh", "Welsh", "green", 13, 0, 0, []),
      this.createNation ("brigantes", "Brigantes", "red", 11, 0, 0, [["urien", "Urien"]]),
      this.createNation ("caledonians", "Caledonians", "green", 7, 0, 0, []),
      this.createNation ("picts", "Picts", "blue", 10, 0, 0, []),
      this.createNation ("irish", "Irish", "red", 8, 0, 0, []),
      this.createNation ("scots", "Scots", "yellow", 11, 0, 0, [["fergus-mor-mac-erc", "Fergus Mor Mac Erc"]]),
      this.createNation ("norsemen", "Norsemen", "red", 10, 0, 0, [["ketil-flatnose", "Ketil Flatnose"]]),
      this.createNation ("dubliners", "Dubliners", "yellow", 9, 0, 0, [["olaf-guthfrithsson", "Olaf Guthfrithsson"]])
    ];
  } // createNationsAndUnits
  
  private createNation (nationId: BritNationId, label: string, color: BritColor, nInfantries: number, nCavalries: number, nBuildings: number, leaderIdAndNames: [BritLeaderId, string][]): { nation: BritNation; units: BritUnit[] } {
    const infantries = arrayUtil.range (nInfantries, index => this.createInfantry (nationId, label, color, index));
    const cavalries = arrayUtil.range (nCavalries, index => this.createCavalry (nationId, label, color, index));
    const buildings = nBuildings
      ? (nationId === "romans"
        ? arrayUtil.range (nBuildings, index => this.createRomanFort (nationId, label, color, index))
        : (nationId === "saxons"
          ? arrayUtil.range (nBuildings, index => this.createSaxonBuhr (nationId, label, color, index))
          : []))
      : [];
    const leaders = leaderIdAndNames.map (l => this.createLeader (l[0], l[1], nationId, label, color));
    return {
      nation: {
        id: nationId,
        label: label,
        color: color,
        infantries: infantries.map (u => u.id),
        cavalries: cavalries.map (u => u.id),
        buildings: (buildings as BritBuilding[]).map (u => u.id),
        leaders: leaders.map (u => u.id),
        population: null,
        active: false
      },
      units: [
        ...infantries,
        ...cavalries,
        ...buildings,
        ...leaders
      ]
    };
  } // getNation
  
  private createInfantry (nationId: BritNationId, nationLabel: string, nationColor: BritColor, infantryIndex: number): BritInfantry {
    return {
      id: `${nationId}-infantry-${infantryIndex}`,
      type: "infantry",
      nation: nationId,
      nationLabel,
      typeLabel: "Infantry",
      nationColor
    };
  } // createInfantry
  
  private createCavalry (nationId: BritNationId, nationLabel: string, nationColor: BritColor, cavalryIndex: number): BritCavalry {
    return {
      id: `${nationId}-cavalry-${cavalryIndex}`,
      type: "cavalry",
      nation: nationId,
      nationLabel,
      typeLabel: "Cavalry",
      nationColor
    };
  } // createCavalry
  
  private createRomanFort (nationId: BritNationId & "romans", nationLabel: string, nationColor: BritColor, fortIndex: number): BritRomanFort {
    return {
      id: `${nationId}-fort-${fortIndex}`,
      type: "roman-fort",
      nation: nationId,
      nationLabel,
      typeLabel: "Fort",
      nationColor
    };
  } // createRomanFort
  
  private createSaxonBuhr (nationId: BritNationId & "saxons", nationLabel: string, nationColor: BritColor, fortIndex: number): BritSaxonBuhr {
    return {
      id: `${nationId}-fort-${fortIndex}`,
      type: "saxon-buhr",
      nation: nationId,
      nationLabel,
      typeLabel: "Buhr",
      nationColor
    };
  } // createSaxonBuhr
  
  private createLeader (leaderId: BritLeaderId, leaderName: string, nationId: BritNationId, nationLabel: string, nationColor: BritColor): BritLeader {
    return {
      id: leaderId,
      type: "leader",
      nation: nationId,
      name: leaderName,
      nationLabel,
      typeLabel: "Leader",
      nationColor
    };
  } // createSaxonBuhr
  
  createRounds (): BritRound[] {
    return [
      this.createRound (1, 43, 60, [],
        new BritEventBuilder ("romans").special ("romans-invasion").invasion ("english-channel", 16).majorInvasion ().build (),
        new BritEventBuilder ("belgae").special ("boudicca-revolt").revolt (1).leader ("boudicca").build ()
      ),
      this.createRound (2, 60, 100, [],
        new BritEventBuilder ("romans").special ("romans-withdrawal").build ()
        ),
      this.createRound (3, 100, 250, [],
        new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().build ()
      ),
      this.createRound (4, 250, 340, [],
        new BritEventBuilder ("caledonians").boats ().build (),
        new BritEventBuilder ("picts").raiding ().boats ().build (),
        new BritEventBuilder ("irish").invasion ("atlantic-ocean", 2).raiding ().boats ().build (),
        new BritEventBuilder ("scots").invasion ("irish-sea", 1).raiding ().build (),
        new BritEventBuilder ("saxons").invasion ("english-channel", 3).raiding ().build (),
        new BritEventBuilder ("jutes").invasion ("english-channel", 2).raiding ().build (),
        new BritEventBuilder ("angles").invasion ("frisian-sea", 3).raiding ().build ()
      ),
      this.createRound (5, 340, 430, ["scoring"],
        new BritEventBuilder ("caledonians").boats ().build (),
        new BritEventBuilder ("picts").raiding ().boats ().build (),
        new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().boats ().build (),
        new BritEventBuilder ("scots").invasion ("irish-sea", 2).raiding ().boats ().build (),
        new BritEventBuilder ("saxons").invasion ("english-channel", 3).raiding ().boats ().build (),
        new BritEventBuilder ("jutes").invasion ("english-channel", 2).raiding ().boats ().build (),
        new BritEventBuilder ("angles").invasion ("frisian-sea", 3).raiding ().boats ().build ()
      ),
      this.createRound (6, 430, 485, [],
        new BritEventBuilder ("romans").special ("romans-replacement").build (),
        new BritEventBuilder ("caledonians").boats ().build (),
        new BritEventBuilder ("picts").boats ().build (),
        new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().boats ().build (),
        new BritEventBuilder ("scots").invasion ("irish-sea", 2).raiding ().boats ().build (),
        new BritEventBuilder ("saxons").invasion ("frisian-sea", 8).leader ("aelle").majorInvasion ().boats ().build (),
        new BritEventBuilder ("jutes").invasion ("english-channel", 1).boats ().build (),
        new BritEventBuilder ("angles").invasion ("north-sea", 4).boats ().build ()
      ),
      this.createRound (7, 485, 560, ["scoring"],
        new BritEventBuilder ("romano-british").revolt (0, 2).leader ("arthur").build (),
        new BritEventBuilder ("brigantes").leader ("urien").build (),
        new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).boats ().build (),
        new BritEventBuilder ("scots").invasion ("irish-sea", 3).leader ("fergus-mor-mac-erc").majorInvasion ().raiding ().boats ().build (),
        new BritEventBuilder ("saxons").invasion ("frisian-sea", 4).boats ().build (),
        new BritEventBuilder ("jutes").boats ().build (),
        new BritEventBuilder ("angles").invasion ("north-sea", 7).leader ("ida").majorInvasion ().boats ().build ()
      ),
      this.createRound (8, 560, 635, ["bretwalda"],
        new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).build (),
        new BritEventBuilder ("scots").invasion ("irish-sea", 1).build (),
        new BritEventBuilder ("saxons").boats ().build (),
        new BritEventBuilder ("jutes").boats ().build (),
        new BritEventBuilder ("angles").invasion ("north-sea", 2).boats ().build ()
      ),
      this.createRound (9, 635, 710, ["bretwalda"],
        new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).build (),
        new BritEventBuilder ("scots").boats ().build (),
        new BritEventBuilder ("angles").special ("oswiu-invasion").leader ("oswiu").boats ().build ()
      ),
      this.createRound (10, 710, 785, ["bretwalda", "scoring"],
        new BritEventBuilder ("saxons").boats ().build (),
        new BritEventBuilder ("angles").special ("offa-invasion").leader ("offa").boats ().build ()
      ),
      this.createRound (11, 785, 860, ["king"],
        new BritEventBuilder ("norsemen").invasion ("icelandic-sea", 5).leader ("ketil-flatnose").majorInvasion ().raiding ().boats ().build (),
        new BritEventBuilder ("danes").special ("danes-first-invasion").invasion ("north-sea", 4).invasion ("frisian-sea", 4).raiding ().build (),
        new BritEventBuilder ("saxons").leader ("egbert").build (),
      ),
      this.createRound (12, 860, 935, ["king"],
        new BritEventBuilder ("norsemen").invasion ("irish-sea", 2).invasion ("atlantic-ocean", 2).raiding ().boats ().build (),
        new BritEventBuilder ("dubliners").invasion ("irish-sea", 2).raiding ().build (),
        new BritEventBuilder ("danes").invasion ("north-sea", 6).leader ("ivar-and-halfdan").majorInvasion ().boats ().build (),
        new BritEventBuilder ("saxons").leader ("alfred").build (),
      ),
      this.createRound (13, 935, 985, ["king", "scoring"],
        new BritEventBuilder ("norsemen").boats ().build (),
        new BritEventBuilder ("dubliners").invasion ("irish-sea", 5).leader ("olaf-guthfrithsson").majorInvasion ().boats ().build (),
        new BritEventBuilder ("danes").invasion ("north-sea", 2).boats ().build (),
        new BritEventBuilder ("saxons").leader ("edgar").build (),
      ),
      this.createRound (14, 985, 1035, ["king"],
        new BritEventBuilder ("norsemen").boats ().build (),
        new BritEventBuilder ("dubliners").invasion ("irish-sea", 3).boats ().build (),
        new BritEventBuilder ("danes").special ("cnut-invasion").invasion ("frisian-sea", 6).leader ("cnut").boats ().build ()
      ),
      this.createRound (15, 1035, 1066, [],
        new BritEventBuilder ("danes").boats ().build (),
        new BritEventBuilder ("norwegians").invasion ("north-sea", 10).leader ("harald-hardrada").majorInvasion ().boats ().build (),
        new BritEventBuilder ("saxons").leader ("harold").build (),
        new BritEventBuilder ("normans").invasion ("english-channel", 6, 4).leader ("william").majorInvasion ().build ()
      ),
      this.createRound (16, 1066, 1085, ["king", "scoring"],
        new BritEventBuilder ("danes").invasion ("frisian-sea", 3).leader ("svein-estrithson").boats ().build (),
        new BritEventBuilder ("norwegians").special ("norwegians-reinforcements").boats ().build (),
        new BritEventBuilder ("saxons").special ("saxons-reinforcements").build (),
        new BritEventBuilder ("normans").special ("normans-reinforcements").build (),
      ),
    ];
  } // createRounds
  
  private createRound (roundId: BritRoundId, fromYear: number, toYear: number, types: ("scoring" | "bretwalda" | "king")[], ...events: BritEvent[]): BritRound {
    return {
      id: roundId,
      fromYear,
      toYear,
      scoring: types.includes ("scoring"),
      bretwaldaElection: types.includes ("bretwalda"),
      kingElection: types.includes ("king"),
      events
    };
  } // createRound
  
  getNationIdsOfColor (color: BritColor): BritNationId[] {
    switch (color) {
      case "yellow": return ["romans", "romano-british", "norwegians", "scots", "dubliners"];
      case "red": return ["saxons", "brigantes", "irish", "norsemen"];
      case "blue": return ["normans", "angles", "belgae", "picts"];
      case "green": return ["danes", "jutes", "welsh", "caledonians"];
    } // switch
  } // getNationIdsOfColor
  
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
