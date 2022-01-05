import { BritAreaId, BritColor, BritLandAreaId, BritSeaAreaId } from "./brit-models";

export const BRIT_COLORS: BritColor[] = ["red", "blue", "yellow", "green"];

export const BRIT_LAND_AREAS: BritLandAreaId[] = ["avalon", "downlands", "wessex", "sussex", "kent", "essex", "lindsey", "suffolk", "norfolk",
"south-mercia", "north-mercia", "hwicce", "devon", "cornwall", "gwent", "dyfed", "powys",
"gwynedd", "clwyd", "march", "cheshire", "york", "bernicia", "pennines", "cumbria", "lothian", "galloway",
"dunedin", "strathclyde", "dalriada", "alban", "mar", "moray", "skye", "caithness", "orkneys", "hebrides"];

export const BRIT_SEA_AREAS: BritSeaAreaId[] = ["icelandic-sea", "north-sea", "frisian-sea", "english-channel", "irish-sea", "atlantic-ocean"];

export const BRIT_AREAS: BritAreaId[] = [...BRIT_LAND_AREAS, ...BRIT_SEA_AREAS];

