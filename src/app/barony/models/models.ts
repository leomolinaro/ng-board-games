export type BaronyColor = "blue" | "yellow" | "red" | "green";
export type BaronyLandType = "mountain" | "forest" | "plain" | "fields" | "lake";
export type BaronyPawnType = "city" | "knight" | "village" | "stronghold";
export type BaronyBuilding = Extract<BaronyPawnType, "village" | "stronghold">;
export type BaronyAction = "recruitment" | "movement" | "construction" | "newCity" | "expedition" | "nobleTitle";
export type BaronyResourceType = "mountain" | "forest" | "plain" | "fields";

export interface BaronyPlayer {
  index: number;
  name: string;
  color: BaronyColor;
  score: number;
  pawns: { [type in BaronyPawnType]: number };
  resources: { [type in BaronyResourceType]: number };
} // BaronyPlayer

export interface BaronyPawn {
  color: BaronyColor;
  type: BaronyPawnType;
} // BaronyPawn

export interface BaronyLandTileCoordinates {
  x: number;
  y: number;
  z: number;
} // BaronyLandTileCoordinates

export interface BaronyLandTile {
  key: string;
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

export interface BaronyMovement {
  fromLandTileCoordinates: BaronyLandTileCoordinates;
  toLandTileCoordinates: BaronyLandTileCoordinates;
} // BaronyMovement

export interface BaronyConstruction {
  landTileCoordinates: BaronyLandTileCoordinates;
  building: BaronyBuilding;
} // BaronyConstruction
