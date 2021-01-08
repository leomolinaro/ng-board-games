import { BaronyLandTileCoordinates } from "../models";
import { BaronyContext } from "./barony-context";
import { IBaronyProcessStep, IBaronyProcessTask, IBaronySubProcess } from "./barony-process.interfaces";

export type BaronyProcessTask = BaronySetupPlacement;

export interface IHasBaronySetupPlacement { afterPlacement (placement: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep; }

export interface BaronySetupPlacementAction {
  landTileCoordinates: BaronyLandTileCoordinates;
} // BaronySetupPlacementAction

export class BaronySetupPlacement implements IBaronyProcessTask<BaronySetupPlacementAction> {

  constructor (
    public playerIndex: number,
    public readonly parent: IHasBaronySetupPlacement & IBaronySubProcess
  ) { }
  
  readonly type = "task";
  readonly taskName = "setupPlacement";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterPlacement (this, context); }

  public landTileCoordinates: BaronyLandTileCoordinates | null = null;
  
  resolve (action: BaronySetupPlacementAction): void {
    this.landTileCoordinates = action.landTileCoordinates;
  } // resolve

} // BaronySetupPlacement
