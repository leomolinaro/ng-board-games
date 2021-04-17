import { arrayUtil, stringUtil } from "@bg-utils";
import { BritArea, BritAreaId, BritBuilding, BritCavalry, BritInfantry, BritLandArea, BritLandAreaId, BritLeader, BritNation, BritNationId, BritNeighbor, BritRegionId, BritRomanFort, BritSaxonBuhr, BritSeaArea, BritSeaAreaId, BritUnit } from "../brit-models";

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
    neighbors: neighbors
  };
} // createLandArea

export function createNationsAndUnits (): { nation: BritNation; units: BritUnit[] }[] {
  return [
    createNation ("romans", "Romans", 16, 0, 24, []),
    createNation ("romano-british", "Romano-British", 8, 0, 0, ["Arthur"]),
    createNation ("normans", "Normans", 8, 0, 0, ["William"]),
    createNation ("saxons", "Saxons", 20, 0, 8, ["Aelle", "Egbert", "Alfred", "Edgar", "Harold"]),
    createNation ("danes", "Danes", 18, 0, 0, ["Ivar and Halfdan", "Cnut", "Svein Estrithson"]),
    createNation ("norwegians", "Norwegians", 12, 0, 0, ["Harald Hardrada"]),
    createNation ("jutes", "Jutes", 6, 0, 0, []),
    createNation ("angles", "Angles", 17, 0, 0, ["Ida", "Oswiu", "Offa"]),
    createNation ("belgae", "Belgae", 10, 0, 0, ["Boudicca"]),
    createNation ("welsh", "Welsh", 13, 0, 0, []),
    createNation ("brigantes", "Brigantes", 11, 0, 0, ["Urien"]),
    createNation ("caledonians", "Caledonians", 7, 0, 0, []),
    createNation ("picts", "Picts", 10, 0, 0, []),
    createNation ("irish", "Irish", 8, 0, 0, []),
    createNation ("scots", "Scots", 11, 0, 0, ["Fergus Mor Mac Erc"]),
    createNation ("norsemen", "Norsemen", 10, 0, 0, ["Ketil Flatnose"]),
    createNation ("dubliners", "Dubliners", 9, 0, 0, ["Olaf Guthfrithsson"])
  ];
} // createNationsAndUnits

function createNation (id: BritNationId, name: string, nInfantries: number, nCavalries: number, nBuildings: number, leaderNames: string[]): { nation: BritNation; units: BritUnit[] } {
  const infantries = arrayUtil.range (nInfantries, index => createInfantry (id, index));
  const cavalries = arrayUtil.range (nCavalries, index => createCavalry (id, index));
  const buildings = nBuildings
    ? (id === "romans"
      ? arrayUtil.range (nBuildings, index => createRomanFort (id, index))
      : (id === "saxons"
        ? arrayUtil.range (nBuildings, index => createSaxonBuhr (id, index))
        : []))
    : [];
  const leaders = leaderNames.map (l => createLeader (id, l));
  return {
    nation: {
      id: id,
      name: name,
      infantries: infantries.map (u => u.id),
      cavalries: cavalries.map (u => u.id),
      buildings: (buildings as BritBuilding[]).map (u => u.id),
      leaders: leaders.map (u => u.id),
    },
    units: [
      ...infantries,
      ...cavalries,
      ...buildings,
      ...leaders
    ]
  };
} // getNation

function createInfantry (nationId: BritNationId, infantryIndex: number): BritInfantry {
  return {
    id: `${nationId}-infantry-${infantryIndex}`,
    type: "infantry",
    nation: nationId
  };
} // createInfantry

function createCavalry (nationId: BritNationId, cavalryIndex: number): BritCavalry {
  return {
    id: `${nationId}-cavalry-${cavalryIndex}`,
    type: "cavalry",
    nation: nationId
  };
} // createCavalry

function createRomanFort (nationId: BritNationId & "romans", fortIndex: number): BritRomanFort {
  return {
    id: `${nationId}-fort-${fortIndex}`,
    type: "roman-fort",
    nation: nationId
  };
} // createRomanFort

function createSaxonBuhr (nationId: BritNationId & "saxons", fortIndex: number): BritSaxonBuhr {
  return {
    id: `${nationId}-fort-${fortIndex}`,
    type: "saxon-buhr",
    nation: nationId
  };
} // createSaxonBuhr

function createLeader (nationId: BritNationId, leaderName: string): BritLeader {
  const leaderId = stringUtil.toLowerCase (stringUtil.toDashCase (leaderName));
  return {
    id: `${nationId}-${leaderId}`,
    type: "leader",
    nation: nationId,
    name: leaderName
  };
} // createSaxonBuhr
