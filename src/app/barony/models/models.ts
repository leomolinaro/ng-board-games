export type BaronyColor = "blue" | "yellow" | "red" | "green";
export type BaronyLandType = "mountain" | "forest" | "plain" | "fields" | "lake";
export type BaronyPawnType = "city" | "knight" | "village" | "stronghold";
export type BaronyBuilding = Extract<BaronyPawnType, "village" | "stronghold">;
export type BaronyAction = "recruitment" | "movement" | "construction" | "newCity" | "expedition" | "nobleTitle";
export type BaronyResourceType = "mountain" | "forest" | "plain" | "fields";

export interface BaronyPlayer {
  id: string;
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

export interface BaronyLandCoordinates {
  x: number;
  y: number;
  z: number;
} // BaronyLandCoordinates

export interface BaronyLand {
  id: string;
  coordinates: BaronyLandCoordinates;
  type: BaronyLandType;
  pawns: BaronyPawn[];
} // BaronyLand

export interface BaronyLandPiece {
  1: BaronyLandType;
  2: BaronyLandType;
  3: BaronyLandType;
  quantity: number;
} // BaronyLandPiece

export function landCoordinatesToId (c: BaronyLandCoordinates) {
  return `${c.x}_${c.y}_${c.z}`;
} // landCoordinatesToId

export interface BaronyMovement {
  fromLand: BaronyLandCoordinates;
  toLand: BaronyLandCoordinates;
  conflict: boolean;
  gainedResource: BaronyResourceType | null;
} // BaronyMovement

export interface BaronyConstruction {
  land: BaronyLandCoordinates;
  building: BaronyBuilding;
} // BaronyConstruction

export interface BaronyLogMovement { type: "movement"; movement: BaronyMovement; player: string; }
export interface BaronyLogExpedition { type: "expedition"; land: BaronyLandCoordinates; player: string; }
export interface BaronyLogNobleTitle { type: "nobleTitle"; resources: BaronyResourceType[]; player: string; }
export interface BaronyLogNewCity { type: "newCity"; land: BaronyLandCoordinates; player: string; }
export interface BaronyLogConstruction { type: "construction"; construction: BaronyConstruction; player: string; }
export interface BaronyLogRecuitment { type: "recruitment"; land: BaronyLandCoordinates; player: string; }
export interface BaronyLogTurn { type: "turn"; player: string; }
export interface BaronyLogSetupPlacement { type: "setupPlacement"; land: BaronyLandCoordinates; player: string; }
export interface BaronyLogSetup { type: "setup"; }

export type BaronyLog = BaronyLogSetup | BaronyLogSetupPlacement | BaronyLogTurn | BaronyLogRecuitment | BaronyLogConstruction
  | BaronyLogNewCity | BaronyLogNobleTitle | BaronyLogExpedition | BaronyLogMovement;
