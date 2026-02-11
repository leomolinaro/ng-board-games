export type WotrExpansionId = "lome" | "wome" | "kome" | "foe" | "tb" | "tss";
export type WotrVariantId =
  | "theBreakingOfTheFellowship"
  | "theCouncilOfRivendell"
  | "dismayTokens"
  | "visibleCorruptionTile"
  | "sequentialCorruptionDraw"
  | "noRulerTokens"
  | "newCities";

export interface WotrExpansion {
  id: WotrExpansionId;
  name: string;
  requires?: WotrExpansionId[];
  inactive?: boolean;
}

export interface WotrVariant {
  id: WotrVariantId;
  name: string;
  requires: WotrExpansionId[];
  inactive?: boolean;
}

const lome: WotrExpansion = { id: "lome", name: "Lords of Middle-earth", inactive: true };
const wome: WotrExpansion = { id: "wome", name: "Warriors of Middle-earth", inactive: true };
const kome: WotrExpansion = { id: "kome", name: "Kings of Middle-earth" };
const foe: WotrExpansion = { id: "foe", name: "Fate of Erebor", inactive: true };
const tb: WotrExpansion = { id: "tb", name: "Treebeard", inactive: true };
const tss: WotrExpansion = {
  id: "tss",
  name: "The Seeing Stones",
  requires: [kome.id],
  inactive: true
};

const theBreakingOfTheFellowship: WotrVariant = {
  id: "theBreakingOfTheFellowship",
  name: "Breaking of the Fellowship",
  requires: [],
  inactive: true
};
const theCouncilOfRivendell: WotrVariant = {
  id: "theCouncilOfRivendell",
  name: "The Council of Rivendell",
  requires: [lome.id],
  inactive: true
};
const dismayTokens: WotrVariant = {
  id: "dismayTokens",
  name: "Dismay Tokens",
  requires: [kome.id],
  inactive: true
};
const visibleCorruptionTile: WotrVariant = {
  id: "visibleCorruptionTile",
  name: "Visible Corruption Tile",
  requires: [kome.id],
  inactive: true
};
const sequentialCorruptionDraw: WotrVariant = {
  id: "sequentialCorruptionDraw",
  name: "Sequential Corruption Draw",
  requires: [kome.id],
  inactive: true
};
const noRulerTokens: WotrVariant = {
  id: "noRulerTokens",
  name: "No Ruler Tokens",
  requires: [kome.id],
  inactive: true
};
const newCities: WotrVariant = {
  id: "newCities",
  name: "New Cities",
  requires: [foe.id],
  inactive: true
};

export const EXPANSIONS: WotrExpansion[] = [lome, wome, kome, foe, tb, tss];

export const VARIANTS: WotrVariant[] = [
  theBreakingOfTheFellowship,
  theCouncilOfRivendell,
  dismayTokens,
  visibleCorruptionTile,
  sequentialCorruptionDraw,
  noRulerTokens,
  newCities
];

const EXPANSION_MAP: Record<WotrExpansionId, WotrExpansion> = {
  lome,
  wome,
  kome,
  foe,
  tb,
  tss
};

export function getExpansion(id: WotrExpansionId): WotrExpansion {
  return EXPANSION_MAP[id];
}

export function getVariant(id: WotrVariantId): WotrVariant {
  return VARIANT_MAP[id];
}

const VARIANT_MAP: Record<WotrVariantId, WotrVariant> = {
  theBreakingOfTheFellowship,
  theCouncilOfRivendell,
  dismayTokens,
  visibleCorruptionTile,
  sequentialCorruptionDraw,
  noRulerTokens,
  newCities
};
