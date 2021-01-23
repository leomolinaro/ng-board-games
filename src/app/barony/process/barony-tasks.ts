import { BaronyAction, BaronyLandTile, BaronyLandTileCoordinates, BaronyLandType, BaronyPawnType, BaronyPlayer, BaronyResource } from "../models";
import { BaronyContext } from "../logic";
import { IBaronyProcess, IBaronyProcessStep, IBaronyProcessTask, IBaronySubProcess } from "./barony-process.interfaces";

export type BaronyProcessTask = BaronySetupPlacement | BaronyTurn;

export interface IHasBaronySetupPlacement { afterPlacement (placement: BaronySetupPlacementResult, context: BaronyContext): IBaronyProcessStep; }
export interface BaronySetupPlacementData { player: BaronyPlayer; validLandTiles: BaronyLandTile[]; }
export interface BaronySetupPlacementResult { choosenLandTileCoordinates: BaronyLandTileCoordinates; }
export class BaronySetupPlacement implements IBaronyProcessTask<BaronySetupPlacementData, BaronySetupPlacementResult> {
  constructor (public readonly data: BaronySetupPlacementData, public readonly parent: IHasBaronySetupPlacement & IBaronySubProcess) { }
  readonly type = "task";
  readonly taskName = "setupPlacement";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterPlacement (this.result as BaronySetupPlacementResult, context); }
  public result: BaronySetupPlacementResult | null = null;
} // BaronySetupPlacement

export interface IHasBaronyTurn { afterTurn (result: BaronyTurnResult, context: BaronyContext): IBaronyProcessStep; }
export interface BaronyTurnData { player: BaronyPlayer; validActions: BaronyAction[]; }

export interface BaronyMovement {
  fromLandTileCoordinates: BaronyLandTileCoordinates;
  toLandTileCoordinates: BaronyLandTileCoordinates;
} // BaronyMovement
export interface BaronyContruction {
  landTileCoordinates: BaronyLandTileCoordinates;
  building: Extract<BaronyPawnType, "village" | "stronghold">;
} // BaronyContruction
interface ABaornyTurnResult {
  readonly choosenAction: BaronyAction;
} // ABaornyTurnResult
export interface BaronyTurnRectruitmentResult extends ABaornyTurnResult {
  readonly choosenAction: "recruitment";
  landTileCoordinates: BaronyLandTileCoordinates;
  numberOfKnights: number;
} // BaronyTurnRectruitmentResult
export interface BaronyTurnMovementResult extends ABaornyTurnResult {
  readonly choosenAction: "movement";
  movements: BaronyMovement[];
  gainedResources: (BaronyLandType | null)[];
} // BaronyTurnRectruitmentResult
export interface BaronyTurnConstructionResult extends ABaornyTurnResult {
  readonly choosenAction: "construction";
  constructions: BaronyContruction[];
} // BaronyTurnConstructionResult
export interface BaronyTurnNewCityResult extends ABaornyTurnResult {
  readonly choosenAction: "newCity";
  landTileCoordinates: BaronyLandTileCoordinates;
} // BaronyTurnNewCityResult
export interface BaronyTurnExpeditionResult extends ABaornyTurnResult {
  readonly choosenAction: "expedition";
  landTileCoordinates: BaronyLandTileCoordinates;
} // BaronyTurnExpeditionResult
export interface BaronyTurnNobleTiltleResult extends ABaornyTurnResult {
  readonly choosenAction: "nobleTitle";
  discardedResources: BaronyLandType[];
} // BaronyTurnNobleTiltleResult
export type BaronyTurnResult = BaronyTurnRectruitmentResult
  | BaronyTurnMovementResult
  | BaronyTurnConstructionResult
  | BaronyTurnNewCityResult
  | BaronyTurnExpeditionResult
  | BaronyTurnNobleTiltleResult;

export class BaronyTurn implements IBaronyProcessTask<BaronyTurnData> {
  constructor (public readonly data: BaronyTurnData, public readonly parent: IHasBaronyTurn & IBaronyProcess) { }
  readonly type = "task";
  readonly taskName = "turn";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterTurn (this.result as BaronyTurnResult, context); }
  public result: BaronyTurnResult | null = null;
} // BaronyTurn
