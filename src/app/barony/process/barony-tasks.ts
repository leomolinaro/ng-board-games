import { BaronyAction, BaronyConstruction, BaronyLandCoordinates, BaronyLandType, BaronyMovement, BaronyResourceType } from "../models";
import { BaronyContext } from "../logic";
import { IBaronyProcess, IBaronyProcessStep, IBaronyProcessTask, IBaronySubProcess } from "./barony-process.interfaces";

export type BaronyProcessTask = BaronySetupPlacement | BaronyTurn;

export interface IHasBaronySetupPlacement { afterPlacement (placement: BaronySetupPlacementResult, context: BaronyContext): IBaronyProcessStep; }
export interface BaronySetupPlacementData { player: string; }
export interface BaronySetupPlacementResult { land: BaronyLandCoordinates; }
export class BaronySetupPlacement implements IBaronyProcessTask<BaronySetupPlacementData, BaronySetupPlacementResult> {
  constructor (public readonly data: BaronySetupPlacementData, public readonly parent: IHasBaronySetupPlacement & IBaronySubProcess) { }
  readonly type = "task";
  readonly taskName = "setupPlacement";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterPlacement (this.result as BaronySetupPlacementResult, context); }
  public result: BaronySetupPlacementResult | null = null;
} // BaronySetupPlacement

export interface IHasBaronyTurn { afterTurn (result: BaronyTurnResult, context: BaronyContext): IBaronyProcessStep; }
export interface BaronyTurnData { player: string; }
interface ABaornyTurnResult {
  readonly action: BaronyAction;
} // ABaornyTurnResult
export interface BaronyTurnRectruitmentResult extends ABaornyTurnResult {
  readonly action: "recruitment";
  land: BaronyLandCoordinates;
  numberOfKnights: number;
} // BaronyTurnRectruitmentResult
export interface BaronyTurnMovementResult extends ABaornyTurnResult {
  readonly action: "movement";
  movements: BaronyMovement[];
} // BaronyTurnRectruitmentResult
export interface BaronyTurnConstructionResult extends ABaornyTurnResult {
  readonly action: "construction";
  constructions: BaronyConstruction[];
} // BaronyTurnConstructionResult
export interface BaronyTurnNewCityResult extends ABaornyTurnResult {
  readonly action: "newCity";
  land: BaronyLandCoordinates;
} // BaronyTurnNewCityResult
export interface BaronyTurnExpeditionResult extends ABaornyTurnResult {
  readonly action: "expedition";
  land: BaronyLandCoordinates;
} // BaronyTurnExpeditionResult
export interface BaronyTurnNobleTiltleResult extends ABaornyTurnResult {
  readonly action: "nobleTitle";
  discardedResources: BaronyResourceType[];
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
