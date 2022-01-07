import { arrayUtil } from "@bg-utils";
import { BritArea, BritAreaId, BritBuilding, BritCavalry, BritColor, BritEvent, BritInfantry, BritInvasion, BritLandArea, BritLandAreaId, BritLeader, BritLeaderId, BritNation, BritNationId, BritNeighbor, BritRegionId, BritRevolt, BritRomanFort, BritRound, BritRoundId, BritSaxonBuhr, BritSeaArea, BritSeaAreaId, BritSetup, BritSpecialEvent, BritUnit } from "../brit-models";

export function createAreas (): BritArea[] {
  return [
    createLandArea ("avalon", "Avalon", "england", false, ["devon", "wessex", "downlands", "hwicce", "atlantic-ocean"]),
    createLandArea ("downlands", "Downlands", "england", false, ["avalon", "wessex", "sussex", "essex", "south-mercia", "hwicce"]),
    createLandArea ("wessex", "Wessex", "england", false, ["devon", "english-channel", "sussex", "downlands", "avalon"]),
    createLandArea ("sussex", "Sussex", "england", false, ["wessex", "english-channel", "kent", "essex", "downlands"]),
    createLandArea ("kent", "Kent", "england", false, ["sussex", "english-channel", "frisian-sea", "essex"]),
    createLandArea ("essex", "Essex", "england", false, ["downlands", "sussex", "kent", "frisian-sea", "suffolk", "south-mercia"]),
    createLandArea ("lindsey", "Lindsey", "england", false, ["north-mercia", "suffolk", "norfolk", "frisian-sea", "york"]),
    createLandArea ("suffolk", "Suffolk", "england", false, ["south-mercia", "essex", "frisian-sea", "norfolk", "lindsey", "north-mercia"]),
    createLandArea ("norfolk", "Norfolk", "england", false, ["suffolk", "frisian-sea", "lindsey"]),
    createLandArea ("south-mercia", "South Mercia", "england", false, ["hwicce", "downlands", "essex", "suffolk", "north-mercia"]),
    createLandArea ("north-mercia", "North Mercia", "england", false, ["march", "hwicce", "south-mercia", "suffolk", "lindsey", "york"]),
    createLandArea ("hwicce", "Hwicce", "england", false, ["powys", "gwent", "atlantic-ocean", "avalon", "downlands", "south-mercia", "north-mercia", "march"]),
    createLandArea ("devon", "Devon", "england", false, ["cornwall", "english-channel", "wessex", "avalon", "atlantic-ocean", { id: "dyfed", strait: true }, { id: "gwent", strait: true }]),
    createLandArea ("cornwall", "Cornwall", "england", false, ["atlantic-ocean", "english-channel", "devon"]),
    createLandArea ("gwent", "Gwent", "wales", false, ["dyfed", "atlantic-ocean", "hwicce", "powys", { id: "devon", strait: true }]),
    createLandArea ("dyfed", "Dyfed", "wales", false, ["atlantic-ocean", "gwent", "powys", { id: "devon", strait: true }]),
    createLandArea ("powys", "Powys", "wales", false, ["atlantic-ocean", "dyfed", "gwent", "hwicce", "march", "clwyd", "gwynedd"]),
    createLandArea ("gwynedd", "Gwynedd", "wales", false, ["atlantic-ocean", "powys", "clwyd"]),
    createLandArea ("clwyd", "Clwyd", "wales", false, ["gwynedd", "powys", "march", "cheshire", "atlantic-ocean"]),
    createLandArea ("march", "March", "england", false, ["powys", "hwicce", "north-mercia", "york", "cheshire", "clwyd"]),
    createLandArea ("cheshire", "Cheshire", "england", false, ["clwyd", "march", "york", "pennines", "cumbria", "irish-sea", "atlantic-ocean"]),
    createLandArea ("york", "York", "england", false, ["pennines", "cheshire", "march", "north-mercia", "lindsey", "frisian-sea", "north-sea", "bernicia"]),
    createLandArea ("bernicia", "Bernicia", "england", false, ["pennines", "york", "north-sea", "lothian"]),
    createLandArea ("pennines", "Pennines", "england", false, ["cumbria", "cheshire", "york", "bernicia", "lothian"]),
    createLandArea ("cumbria", "Cumbria", "england", false, ["irish-sea", "cheshire", "pennines", "lothian", "galloway"]),
    createLandArea ("lothian", "Lothian", "england", false, ["galloway", "cumbria", "pennines", "bernicia", "north-sea", "dunedin", "strathclyde"]),
    createLandArea ("galloway", "Galloway", "england", false, ["irish-sea", "cumbria", "lothian", "strathclyde"]),
    createLandArea ("dunedin", "Dunedin", "scotland", false, ["dalriada", "strathclyde", "lothian", "north-sea", "mar", "alban"]),
    createLandArea ("strathclyde", "Strathclyde", "scotland", false, ["irish-sea", "galloway", "lothian", "dunedin", "dalriada"]),
    createLandArea ("dalriada", "Dalriada", "scotland", false, ["irish-sea", "strathclyde", "dunedin", "alban", "skye"]),
    createLandArea ("alban", "Alban", "scotland", false, ["skye", "dalriada", "dunedin", "mar", "moray"]),
    createLandArea ("mar", "Mar", "scotland", false, ["alban", "dunedin", "north-sea", "icelandic-sea", "moray"]),
    createLandArea ("moray", "Moray", "scotland", false, ["skye", "alban", "mar", "icelandic-sea", "caithness"]),
    createLandArea ("skye", "Skye", "scotland", false, [{ id: "hebrides", strait: true }, "icelandic-sea", "irish-sea", "dalriada", "alban", "moray", "caithness"]),
    createLandArea ("caithness", "Caithness", "scotland", false, ["skye", "moray", "icelandic-sea", { id: "orkneys", strait: true }]),
    createLandArea ("orkneys", "Orkneys", "scotland", false, ["icelandic-sea", { id: "caithness", strait: true }]),
    createLandArea ("hebrides", "Hebrides", "scotland", false, ["icelandic-sea", { id: "skye", strait: true }]),
    createSeaArea ("icelandic-sea", "Icelandic Sea", ["orkneys", "hebrides", "caithness", "skye", "moray", "mar", "irish-sea", "north-sea"]),
    createSeaArea ("north-sea", "North Sea", ["icelandic-sea", "mar", "dunedin", "lothian", "bernicia", "york", "frisian-sea"]),
    createSeaArea ("frisian-sea", "Frisian Sea", ["north-sea", "york", "lindsey", "norfolk", "suffolk", "essex", "kent", "english-channel"]),
    createSeaArea ("english-channel", "English Channel", ["atlantic-ocean", "north-sea", "kent", "sussex", "wessex", "devon", "cornwall"]),
    createSeaArea ("irish-sea", "Irish Sea", ["icelandic-sea", "atlantic-ocean", "cheshire", "cumbria", "galloway", "strathclyde", "dalriada", "skye"]),
    createSeaArea ("atlantic-ocean", "Atlantic Ocean", ["irish-sea", "cheshire", "clwyd", "gwynedd", "powys", "dyfed", "gwent", "hwicce", "avalon", "devon", "cornwall", "english-channel"]),
  ];
} // createAreas

function createLandArea (id: BritLandAreaId, name: string, region: BritRegionId, difficultTerrain: boolean, neighbors: BritNeighbor[]): BritLandArea {
  return {
    id: id,
    name: name,
    region: region,
    type: "land",
    difficultTerrain: difficultTerrain,
    units: [],
    neighbors: neighbors
  };
} // createLandArea

function createSeaArea (id: BritSeaAreaId, name: string, neighbors: BritAreaId[]): BritSeaArea {
  return {
    id: id,
    name: name,
    type: "sea",
    neighbors: neighbors,
    units: []
  };
} // createLandArea

export function createNationsAndUnits (): { nation: BritNation; units: BritUnit[] }[] {
  return [
    createNation ("romans", "Romans", "yellow", 16, 0, 24, []),
    createNation ("romano-british", "Romano-British", "yellow", 8, 0, 0, [["arthur", "Arthur"]]),
    createNation ("normans", "Normans", "blue", 8, 0, 0, [["william", "William"]]),
    createNation ("saxons", "Saxons", "red", 20, 0, 8, [["aelle", "Aelle"], ["egbert", "Egbert"], ["alfred", "Alfred"], ["edgar", "Edgar"], ["harold", "Harold"]]),
    createNation ("danes", "Danes", "green", 18, 0, 0, [["ivar-and-halfdan", "Ivar and Halfdan"], ["cnut", "Cnut"], ["svein-estrithson", "Svein Estrithson"]]),
    createNation ("norwegians", "Norwegians", "yellow", 12, 0, 0, [["harald-hardrada", "Harald Hardrada"]]),
    createNation ("jutes", "Jutes", "green", 6, 0, 0, []),
    createNation ("angles", "Angles", "blue", 17, 0, 0, [["ida", "Ida"], ["oswiu", "Oswiu"], ["offa", "Offa"]]),
    createNation ("belgae", "Belgae", "blue", 10, 0, 0, [["boudicca", "Boudicca"]]),
    createNation ("welsh", "Welsh", "green", 13, 0, 0, []),
    createNation ("brigantes", "Brigantes", "red", 11, 0, 0, [["urien", "Urien"]]),
    createNation ("caledonians", "Caledonians", "green", 7, 0, 0, []),
    createNation ("picts", "Picts", "blue", 10, 0, 0, []),
    createNation ("irish", "Irish", "red", 8, 0, 0, []),
    createNation ("scots", "Scots", "yellow", 11, 0, 0, [["fergus-mor-mac-erc", "Fergus Mor Mac Erc"]]),
    createNation ("norsemen", "Norsemen", "red", 10, 0, 0, [["ketil-flatnose", "Ketil Flatnose"]]),
    createNation ("dubliners", "Dubliners", "yellow", 9, 0, 0, [["olaf-guthfrithsson", "Olaf Guthfrithsson"]])
  ];
} // createNationsAndUnits

function createNation (nationId: BritNationId, label: string, color: BritColor, nInfantries: number, nCavalries: number, nBuildings: number, leaderIdAndNames: [BritLeaderId, string][]): { nation: BritNation; units: BritUnit[] } {
  const infantries = arrayUtil.range (nInfantries, index => createInfantry (nationId, label, color, index));
  const cavalries = arrayUtil.range (nCavalries, index => createCavalry (nationId, label, color, index));
  const buildings = nBuildings
    ? (nationId === "romans"
      ? arrayUtil.range (nBuildings, index => createRomanFort (nationId, label, color, index))
      : (nationId === "saxons"
        ? arrayUtil.range (nBuildings, index => createSaxonBuhr (nationId, label, color, index))
        : []))
    : [];
  const leaders = leaderIdAndNames.map (l => createLeader (l[0], l[1], nationId, label, color));
  return {
    nation: {
      id: nationId,
      label: label,
      color: color,
      infantries: infantries.map (u => u.id),
      cavalries: cavalries.map (u => u.id),
      buildings: (buildings as BritBuilding[]).map (u => u.id),
      leaders: leaders.map (u => u.id),
      population: null
    },
    units: [
      ...infantries,
      ...cavalries,
      ...buildings,
      ...leaders
    ]
  };
} // getNation

function createInfantry (nationId: BritNationId, nationLabel: string, nationColor: BritColor, infantryIndex: number): BritInfantry {
  return {
    id: `${nationId}-infantry-${infantryIndex}`,
    type: "infantry",
    nation: nationId,
    nationLabel,
    typeLabel: "Infantry",
    nationColor
  };
} // createInfantry

function createCavalry (nationId: BritNationId, nationLabel: string, nationColor: BritColor, cavalryIndex: number): BritCavalry {
  return {
    id: `${nationId}-cavalry-${cavalryIndex}`,
    type: "cavalry",
    nation: nationId,
    nationLabel,
    typeLabel: "Cavalry",
    nationColor
  };
} // createCavalry

function createRomanFort (nationId: BritNationId & "romans", nationLabel: string, nationColor: BritColor, fortIndex: number): BritRomanFort {
  return {
    id: `${nationId}-fort-${fortIndex}`,
    type: "roman-fort",
    nation: nationId,
    nationLabel,
    typeLabel: "Fort",
    nationColor
  };
} // createRomanFort

function createSaxonBuhr (nationId: BritNationId & "saxons", nationLabel: string, nationColor: BritColor, fortIndex: number): BritSaxonBuhr {
  return {
    id: `${nationId}-fort-${fortIndex}`,
    type: "saxon-buhr",
    nation: nationId,
    nationLabel,
    typeLabel: "Buhr",
    nationColor
  };
} // createSaxonBuhr

function createLeader (leaderId: BritLeaderId, leaderName: string, nationId: BritNationId, nationLabel: string, nationColor: BritColor): BritLeader {
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

export function createRounds (): BritRound[] {
  return [
    createRound (1, 43, 60, [],
      new BritEventBuilder ("romans").special ("romans-invasion").invasion ("english-channel", 16).majorInvasion ().build (),
      new BritEventBuilder ("belgae").special ("boudicca-revolt").revolt (1).leader ("boudicca").build ()
    ),
    createRound (2, 60, 100, [],
      new BritEventBuilder ("romans").special ("romans-withdrawal").build ()
      ),
    createRound (3, 100, 250, [],
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().build ()
    ),
    createRound (4, 250, 340, [],
      new BritEventBuilder ("caledonians").boats ().build (),
      new BritEventBuilder ("picts").raiding ().boats ().build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 2).raiding ().boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 1).raiding ().build (),
      new BritEventBuilder ("saxons").invasion ("english-channel", 3).raiding ().build (),
      new BritEventBuilder ("jutes").invasion ("english-channel", 2).raiding ().build (),
      new BritEventBuilder ("angles").invasion ("frisian-sea", 3).raiding ().build ()
    ),
    createRound (5, 340, 430, ["scoring"],
      new BritEventBuilder ("caledonians").boats ().build (),
      new BritEventBuilder ("picts").raiding ().boats ().build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 2).raiding ().boats ().build (),
      new BritEventBuilder ("saxons").invasion ("english-channel", 3).raiding ().boats ().build (),
      new BritEventBuilder ("jutes").invasion ("english-channel", 2).raiding ().boats ().build (),
      new BritEventBuilder ("angles").invasion ("frisian-sea", 3).raiding ().boats ().build ()
    ),
    createRound (6, 430, 485, [],
      new BritEventBuilder ("romans").special ("romans-replacement").build (),
      new BritEventBuilder ("caledonians").boats ().build (),
      new BritEventBuilder ("picts").boats ().build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).raiding ().boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 2).raiding ().boats ().build (),
      new BritEventBuilder ("saxons").invasion ("frisian-sea", 8).leader ("aelle").majorInvasion ().boats ().build (),
      new BritEventBuilder ("jutes").invasion ("english-channel", 1).boats ().build (),
      new BritEventBuilder ("angles").invasion ("north-sea", 4).boats ().build ()
    ),
    createRound (7, 485, 560, ["scoring"],
      new BritEventBuilder ("romano-british").revolt (0, 2).leader ("arthur").build (),
      new BritEventBuilder ("brigantes").leader ("urien").build (),
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).boats ().build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 3).leader ("fergus-mor-mac-erc").majorInvasion ().raiding ().boats ().build (),
      new BritEventBuilder ("saxons").invasion ("frisian-sea", 4).boats ().build (),
      new BritEventBuilder ("jutes").boats ().build (),
      new BritEventBuilder ("angles").invasion ("north-sea", 7).leader ("ida").majorInvasion ().boats ().build ()
    ),
    createRound (8, 560, 635, ["bretwalda"],
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).build (),
      new BritEventBuilder ("scots").invasion ("irish-sea", 1).build (),
      new BritEventBuilder ("saxons").boats ().build (),
      new BritEventBuilder ("jutes").boats ().build (),
      new BritEventBuilder ("angles").invasion ("north-sea", 2).boats ().build ()
    ),
    createRound (9, 635, 710, ["bretwalda"],
      new BritEventBuilder ("irish").invasion ("atlantic-ocean", 1).build (),
      new BritEventBuilder ("scots").boats ().build (),
      new BritEventBuilder ("angles").special ("oswiu-invasion").leader ("oswiu").boats ().build ()
    ),
    createRound (10, 710, 785, ["bretwalda", "scoring"],
      new BritEventBuilder ("saxons").boats ().build (),
      new BritEventBuilder ("angles").special ("offa-invasion").leader ("offa").boats ().build ()
    ),
    createRound (11, 785, 860, ["king"],
      new BritEventBuilder ("norsemen").invasion ("icelandic-sea", 5).leader ("ketil-flatnose").majorInvasion ().raiding ().boats ().build (),
      new BritEventBuilder ("danes").special ("danes-first-invasion").invasion ("north-sea", 4).invasion ("frisian-sea", 4).raiding ().build (),
      new BritEventBuilder ("saxons").leader ("egbert").build (),
    ),
    createRound (12, 860, 935, ["king"],
      new BritEventBuilder ("norsemen").invasion ("irish-sea", 2).invasion ("atlantic-ocean", 2).raiding ().boats ().build (),
      new BritEventBuilder ("dubliners").invasion ("irish-sea", 2).raiding ().build (),
      new BritEventBuilder ("danes").invasion ("north-sea", 6).leader ("ivar-and-halfdan").majorInvasion ().boats ().build (),
      new BritEventBuilder ("saxons").leader ("alfred").build (),
    ),
    createRound (13, 935, 985, ["king", "scoring"],
      new BritEventBuilder ("norsemen").boats ().build (),
      new BritEventBuilder ("dubliners").invasion ("irish-sea", 5).leader ("olaf-guthfrithsson").majorInvasion ().boats ().build (),
      new BritEventBuilder ("danes").invasion ("north-sea", 2).boats ().build (),
      new BritEventBuilder ("saxons").leader ("edgar").build (),
    ),
    createRound (14, 985, 1035, ["king"],
      new BritEventBuilder ("norsemen").boats ().build (),
      new BritEventBuilder ("dubliners").invasion ("irish-sea", 3).boats ().build (),
      new BritEventBuilder ("danes").special ("cnut-invasion").invasion ("frisian-sea", 6).leader ("cnut").boats ().build ()
    ),
    createRound (15, 1035, 1066, [],
      new BritEventBuilder ("danes").boats ().build (),
      new BritEventBuilder ("norwegians").invasion ("north-sea", 10).leader ("harald-hardrada").majorInvasion ().boats ().build (),
      new BritEventBuilder ("saxons").leader ("harold").build (),
      new BritEventBuilder ("normans").invasion ("english-channel", 6, 4).leader ("william").majorInvasion ().build ()
    ),
    createRound (16, 1066, 1085, ["king", "scoring"],
      new BritEventBuilder ("danes").invasion ("frisian-sea", 3).leader ("svein-estrithson").boats ().build (),
      new BritEventBuilder ("norwegians").special ("norwegians-reinforcements").boats ().build (),
      new BritEventBuilder ("saxons").special ("saxons-reinforcements").build (),
      new BritEventBuilder ("normans").special ("normans-reinforcements").build (),
    ),
  ];
} // createRounds

function createRound (roundId: BritRoundId, fromYear: number, toYear: number, types: ("scoring" | "bretwalda" | "king")[], ...events: BritEvent[]): BritRound {
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

export function getNationIdsOfColor (color: BritColor): BritNationId[] {
  switch (color) {
    case "yellow": return ["romans", "romano-british", "norwegians", "scots", "dubliners"];
    case "red": return ["saxons", "brigantes", "irish", "norsemen"];
    case "blue": return ["normans", "angles", "belgae", "picts"];
    case "green": return ["danes", "jutes", "welsh", "caledonians"];
  } // switch
} // getNationIdsOfColor

export function getGameSetup (): BritSetup {
  return {
    areas: {
      "avalon": "welsh",
      "downlands": "belgae",
      "wessex": "belgae",
      "sussex": "belgae",
      "kent": "belgae",
      "essex": "belgae",
      "lindsey": "belgae",
      "suffolk": "belgae",
      "norfolk": "belgae",
      "south-mercia": "belgae",
      "north-mercia": "belgae",
      "hwicce": "welsh",
      "devon": "welsh",
      "cornwall": "welsh",
      "gwent": "welsh",
      "dyfed": "welsh",
      "powys": "welsh",
      "gwynedd": "welsh",
      "clwyd": "welsh",
      "march": "brigantes",
      "cheshire": "brigantes",
      "york": "brigantes",
      "bernicia": "brigantes",
      "pennines": "brigantes",
      "cumbria": "brigantes",
      "lothian": "brigantes",
      "galloway": "brigantes",
      "dunedin": "picts",
      "strathclyde": "brigantes",
      "dalriada": "picts",
      "alban": "picts",
      "mar": "picts",
      "moray": "picts",
      "skye": "picts",
      "caithness": "caledonians",
      "orkneys": "caledonians",
      "hebrides": "caledonians",
      "icelandic-sea": null,
      "north-sea": null,
      "frisian-sea": null,
      "english-channel": ["romans", 16],
      "irish-sea": null,
      "atlantic-ocean": null
    },
    populationMarkers: ["welsh", "belgae", "brigantes", "picts", "caledonians"]
  };
} // getGameSetup

