import { BgAiPlayer, BgRealPlayer, BgUser } from "@leobg/commons";

export type BaronyColor = "blue" | "yellow" | "red" | "green";
export type BaronyLandType = "mountain" | "forest" | "plain" | "fields" | "lake";
export type BaronyPawnType = "city" | "knight" | "village" | "stronghold";
export type BaronyBuilding = Extract<BaronyPawnType, "village" | "stronghold">;
export type BaronyAction = "recruitment" | "movement" | "construction" | "newCity" | "expedition" | "nobleTitle";
export type BaronyResourceType = "mountain" | "forest" | "plain" | "fields";

export interface ABaronyPlayer {
  id: BaronyColor;
  name: string;
  score: number;
  pawns: { [type in BaronyPawnType]: number };
  resources: { [type in BaronyResourceType]: number };
  victoryPoints: number;
  winner: boolean;
}

interface BaronyAiPlayer extends ABaronyPlayer, BgAiPlayer<BaronyColor> {
  isAi: true;
  isRemote: boolean;
  isLocal: boolean;
}

interface BaronyRealPlayer extends ABaronyPlayer, BgRealPlayer<BaronyColor> {
  isAi: false;
  isRemote: boolean;
  isLocal: boolean;
  controller: BgUser;
}

export type BaronyPlayer = BaronyAiPlayer | BaronyRealPlayer;

export interface BaronyPawn {
  color: BaronyColor;
  type: BaronyPawnType;
}

export interface BaronyLandCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface BaronyLand {
  id: string;
  coordinates: BaronyLandCoordinates;
  type: BaronyLandType;
  pawns: BaronyPawn[];
}

export interface BaronyLandPiece {
  1: BaronyLandType;
  2: BaronyLandType;
  3: BaronyLandType;
  quantity: number;
}

export function landCoordinatesToId (c: BaronyLandCoordinates) {
  return `${c.x}_${c.y}_${c.z}`;
}

export interface BaronyMovement {
  fromLand: BaronyLandCoordinates;
  toLand: BaronyLandCoordinates;
  conflict: boolean;
  gainedResource: BaronyResourceType | null;
}

export interface BaronyConstruction {
  land: BaronyLandCoordinates;
  building: BaronyBuilding;
}

export interface BaronyLogMovement { type: "movement"; movement: BaronyMovement; player: BaronyColor }
export interface BaronyLogExpedition { type: "expedition"; land: BaronyLandCoordinates; player: BaronyColor }
export interface BaronyLogNobleTitle { type: "nobleTitle"; resources: BaronyResourceType[]; player: BaronyColor }
export interface BaronyLogNewCity { type: "newCity"; land: BaronyLandCoordinates; player: BaronyColor }
export interface BaronyLogConstruction { type: "construction"; construction: BaronyConstruction; player: BaronyColor }
export interface BaronyLogRecuitment { type: "recruitment"; land: BaronyLandCoordinates; player: BaronyColor }
export interface BaronyLogTurn { type: "turn"; player: BaronyColor }
export interface BaronyLogSetupPlacement { type: "setupPlacement"; land: BaronyLandCoordinates; player: BaronyColor }
export interface BaronyLogSetup { type: "setup" }

export type BaronyLog =
  | BaronyLogSetup
  | BaronyLogSetupPlacement
  | BaronyLogTurn
  | BaronyLogRecuitment
  | BaronyLogConstruction
  | BaronyLogNewCity
  | BaronyLogNobleTitle
  | BaronyLogExpedition
  | BaronyLogMovement;

export type BaronyStory = BaronySetupPlacement | BaronyTurn;

export interface BaronySetupPlacement {
  type: "setupPlacement";
  land: BaronyLandCoordinates;
}

export interface BaronyTurnTaskData {
  player: string;
}
interface ABaronyTurn {
  readonly action: BaronyAction;
}
export interface BaronyTurnRectruitment extends ABaronyTurn {
  readonly action: "recruitment";
  land: BaronyLandCoordinates;
  numberOfKnights: number;
}
export interface BaronyTurnMovement extends ABaronyTurn {
  readonly action: "movement";
  movements: BaronyMovement[];
}
export interface BaronyTurnConstruction extends ABaronyTurn {
  readonly action: "construction";
  constructions: BaronyConstruction[];
}
export interface BaronyTurnNewCity extends ABaronyTurn {
  readonly action: "newCity";
  land: BaronyLandCoordinates;
}
export interface BaronyTurnExpedition extends ABaronyTurn {
  readonly action: "expedition";
  land: BaronyLandCoordinates;
}
export interface BaronyTurnNobleTitle extends ABaronyTurn {
  readonly action: "nobleTitle";
  discardedResources: BaronyResourceType[];
}
export type BaronyTurn =
  | BaronyTurnRectruitment
  | BaronyTurnMovement
  | BaronyTurnConstruction
  | BaronyTurnNewCity
  | BaronyTurnExpedition
  | BaronyTurnNobleTitle;

export interface BaronyFinalScores {
  victoryPointsByPlayer: Record<string, number>;
  winnerPlayer: string;
}
