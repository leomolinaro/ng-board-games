export type BaronyColor = "blue" | "yellow" | "red" | "green";
export type BaronyLandType = "mountain" | "forest" | "plain" | "fields" | "lake";
export type BaronyPawn = "city" | "knight" | "village" | "stronghold";

export interface BaronyPlayer {
  name: string;
  color: BaronyColor;
} // BaronyPlayer

export interface BaronyLandTileCoordinates {
  x: number;
  y: number;
  z: number;
} // BaronyLandTileCoordinates

export interface BaronyLandTile {
  coordinates: BaronyLandTileCoordinates;
  type: BaronyLandType;
} // BaronyLandTile

export interface BaronyState {
  players: BaronyPlayer[];
  landTiles: {
    map: { [coordinates: string]: BaronyLandTile };
    coordinates: BaronyLandTileCoordinates[];
  };
} // BaronyState

export interface BaronyLandPiece {
  1: BaronyLandType;
  2: BaronyLandType;
  3: BaronyLandType;
  quantity: number;
} // BaronyLandPiece
