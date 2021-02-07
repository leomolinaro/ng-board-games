import { BaronyAction, BaronyConstruction, BaronyLandCoordinates, BaronyLandType, BaronyMovement, BaronyResourceType } from "../models";
import { BaronyContext } from "../logic";
import { IBaronyProcess, IBaronyProcessStep, IBaronyProcessTask, IBaronySubProcess } from "./barony-process.interfaces";

export type BaronyProcessTask = BaronySetupPlacementTask | BaronyTurnTask;

export interface IHasBaronySetupPlacement { afterPlacement (placement: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep; }
export interface BaronySetupPlacementData { player: string; }
export interface BaronySetupPlacement { land: BaronyLandCoordinates; }
export class BaronySetupPlacementTask implements IBaronyProcessTask<BaronySetupPlacementData, BaronySetupPlacement> {
  constructor (public readonly data: BaronySetupPlacementData, public readonly parent: IHasBaronySetupPlacement & IBaronySubProcess) { }
  readonly type = "task";
  readonly taskName = "setupPlacement";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterPlacement (this.result as BaronySetupPlacement, context); }
  public result: BaronySetupPlacement | null = null;
} // BaronySetupPlacementTask

export interface IHasBaronyTurn { afterTurn (result: BaronyTurn, context: BaronyContext): IBaronyProcessStep; }
export interface BaronyTurnTaskData { player: string; }
interface ABaronyTurn {
  readonly action: BaronyAction;
} // ABaronyTurn
export interface BaronyTurnRectruitment extends ABaronyTurn {
  readonly action: "recruitment";
  land: BaronyLandCoordinates;
  numberOfKnights: number;
} // BaronyTurnRectruitmentResult
export interface BaronyTurnMovement extends ABaronyTurn {
  readonly action: "movement";
  movements: BaronyMovement[];
} // BaronyTurnRectruitmentResult
export interface BaronyTurnConstruction extends ABaronyTurn {
  readonly action: "construction";
  constructions: BaronyConstruction[];
} // BaronyTurnConstructionResult
export interface BaronyTurnNewCity extends ABaronyTurn {
  readonly action: "newCity";
  land: BaronyLandCoordinates;
} // BaronyTurnNewCityResult
export interface BaronyTurnExpedition extends ABaronyTurn {
  readonly action: "expedition";
  land: BaronyLandCoordinates;
} // BaronyTurnExpeditionResult
export interface BaronyTurnNobleTiltle extends ABaronyTurn {
  readonly action: "nobleTitle";
  discardedResources: BaronyResourceType[];
} // BaronyTurnNobleTiltleResult
export type BaronyTurn = BaronyTurnRectruitment
  | BaronyTurnMovement
  | BaronyTurnConstruction
  | BaronyTurnNewCity
  | BaronyTurnExpedition
  | BaronyTurnNobleTiltle;
export class BaronyTurnTask implements IBaronyProcessTask<BaronyTurnTaskData> {
  constructor (public readonly data: BaronyTurnTaskData, public readonly parent: IHasBaronyTurn & IBaronyProcess) { }
  readonly type = "task";
  readonly taskName = "turn";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterTurn (this.result as BaronyTurn, context); }
  public result: BaronyTurn | null = null;
} // BaronyTurnTask
