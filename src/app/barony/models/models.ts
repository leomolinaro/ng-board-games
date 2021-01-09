export type BaronyColor = "blue" | "yellow" | "red" | "green";
export type BaronyLandType = "mountain" | "forest" | "plain" | "fields" | "lake";
export type BaronyPawnType = "city" | "knight" | "village" | "stronghold";

export interface BaronyPlayer {
  index: number;
  name: string;
  color: BaronyColor;
  score: number;
  pawns: { [type in BaronyPawnType]: number };
  resources: BaronyResource[];
} // BaronyPlayer

export interface BaronyPawn {
  color: BaronyColor;
  type: BaronyPawnType;
} // BaronyPawn

export interface BaronyResource {
  type: BaronyLandType;
  goldNumber: number;
  silverNumber: number;
} // BaronyResource

export interface BaronyLandTileCoordinates {
  x: number;
  y: number;
  z: number;
} // BaronyLandTileCoordinates

export interface BaronyLandTile {
  coordinates: BaronyLandTileCoordinates;
  type: BaronyLandType;
  pawns: BaronyPawn[];
} // BaronyLandTile

export interface BaronyLandPiece {
  1: BaronyLandType;
  2: BaronyLandType;
  3: BaronyLandType;
  quantity: number;
} // BaronyLandPiece

export function getLandTileCoordinateKey (c: BaronyLandTileCoordinates) {
  return `${c.x}_${c.y}_${c.z}`;
} // getLandTileCoordinateKey
