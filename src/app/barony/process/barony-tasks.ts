import { BaronyActionsComponent } from "../barony-actions/barony-actions.component";
import { BaronyAction, BaronyLandTile, BaronyLandTileCoordinates } from "../models";
import { BaronyContext } from "./barony-context";
import { IBaronyProcessStep, IBaronyProcessTask, IBaronySubProcess } from "./barony-process.interfaces";

export type BaronyProcessTask = BaronySetupPlacement | BaronyChooseAction;

export interface IHasBaronySetupPlacement { afterPlacement (placement: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep; }
export interface IHasBaronyChooseAction { afterChooseAction (chooseAction: BaronyChooseAction, context: BaronyContext): IBaronyProcessStep; }

export interface BaronySetupPlacementAction {
  landTileCoordinates: BaronyLandTileCoordinates;
} // BaronySetupPlacementAction

export interface BaronyChooseActionAction {
  action: BaronyAction;
} // BaronyChooseActionAction

export class BaronySetupPlacement implements IBaronyProcessTask<BaronySetupPlacementAction> {

  constructor (
    public readonly playerIndex: number,
    public readonly candidateLandTiles: BaronyLandTile[],
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

export class BaronyChooseAction implements IBaronyProcessTask<BaronyChooseActionAction> {
  
  constructor (
    public readonly playerIndex: number,
    public readonly candidateActions: BaronyAction[],
    public readonly parent: IHasBaronyChooseAction & IBaronySubProcess
  ) { }
  
  readonly type = "task";
  readonly taskName = "chooseAction";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterChooseAction (this, context); }

  public action: BaronyAction | null = null;

  resolve (action: BaronyChooseActionAction): void {
    this.action = action.action;
  } // resolve

} // BaronyChooseAction
