import { BaronyAction, BaronyColor, BaronyLandPiece, BaronyLandType, BaronyPawnType, BaronyResourceType } from "./barony-models";

export const BARONY_WINNING_POINTS: number[] = [60, 70, 80];
export const BARONY_LAND_TYPES: BaronyLandType[] = ["fields", "forest", "lake", "mountain", "plain"];
export const BARONY_RESOURCE_TYPES: BaronyResourceType[] = ["fields", "forest", "mountain", "plain"];
export const BARONY_COLORS: BaronyColor[] = ["blue", "green", "red", "yellow"];
export const BARONY_PAWN_TYPES: BaronyPawnType[] = ["city", "knight", "stronghold", "village"];
export const BARONY_ACTIONS: BaronyAction[] = ["recruitment", "movement", "construction", "newCity", "expedition", "nobleTitle"];
export const BARONY_NUMBER_OF_LAND_TILES = {
  fields: 22,
  forest: 25,
  lake: 14,
  mountain: 22,
  plain: 25
};
export const BARONY_LAND_PIECES: BaronyLandPiece[] = [
  { 1: "mountain", 2: "mountain", 3: "mountain", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "fields", quantity: 1 },
  { 1: "mountain", 2: "mountain", 3: "lake", quantity: 2 },
  { 1: "mountain", 2: "forest", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "forest", 3: "plain", quantity: 0 },
  { 1: "mountain", 2: "forest", 3: "fields", quantity: 0 },
  { 1: "mountain", 2: "forest", 3: "lake", quantity: 1 },
  { 1: "mountain", 2: "plain", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "plain", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "plain", 3: "fields", quantity: 0 },
  { 1: "mountain", 2: "plain", 3: "lake", quantity: 0 },
  { 1: "mountain", 2: "fields", 3: "forest", quantity: 1 },
  { 1: "mountain", 2: "fields", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "mountain", 2: "fields", 3: "lake", quantity: 0 },
  { 1: "mountain", 2: "lake", 3: "forest", quantity: 0 },
  { 1: "mountain", 2: "lake", 3: "plain", quantity: 1 },
  { 1: "mountain", 2: "lake", 3: "fields", quantity: 1 },
  { 1: "mountain", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "forest", 2: "forest", 3: "forest", quantity: 2 },
  { 1: "forest", 2: "forest", 3: "plain", quantity: 1 },
  { 1: "forest", 2: "forest", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "forest", 3: "lake", quantity: 2 },
  { 1: "forest", 2: "plain", 3: "plain", quantity: 1 },
  { 1: "forest", 2: "plain", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "plain", 3: "lake", quantity: 0 },
  { 1: "forest", 2: "fields", 3: "plain", quantity: 0 },
  { 1: "forest", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "fields", 3: "lake", quantity: 0 },
  { 1: "forest", 2: "lake", 3: "plain", quantity: 1 },
  { 1: "forest", 2: "lake", 3: "fields", quantity: 1 },
  { 1: "forest", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "plain", 2: "plain", 3: "plain", quantity: 2 },
  { 1: "plain", 2: "plain", 3: "fields", quantity: 1 },
  { 1: "plain", 2: "plain", 3: "lake", quantity: 2 },
  { 1: "plain", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "plain", 2: "fields", 3: "lake", quantity: 1 },
  { 1: "plain", 2: "lake", 3: "fields", quantity: 0 },
  { 1: "plain", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "fields", 2: "fields", 3: "fields", quantity: 1 },
  { 1: "fields", 2: "fields", 3: "lake", quantity: 2 },
  { 1: "fields", 2: "lake", 3: "lake", quantity: 0 },
  { 1: "lake", 2: "lake", 3: "lake", quantity: 0 },
];
