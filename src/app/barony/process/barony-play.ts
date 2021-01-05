import { BaronyContext } from "./barony-context";
import { IBaronySubProcess, IBaronyProcessStep, IBaronyProcessTask, BARONY_PROCESS_END_EVENT, IBaronyProcess } from "./barony-process.interfaces";

export interface IHasBaronySetup { afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep; }
export interface IHasBaronySetupPlacement { afterPlacement (placement: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep; }

export interface BaronySetupPlacementAction {
  playerIndex: number;
  tileX: number;
  tileY: number;
  tileZ: number;
} // BaronySetupPlacementAction

export class BaronyPlay implements IBaronyProcess, IHasBaronySetup {
  
  readonly type = "process";

  start (context: BaronyContext): IBaronyProcessStep {
    return new BaronySetup (this);
  } // start

  afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep {
    throw new Error ("Method not implemented.");
  } // afterSetup

} // BaronyPlay

export class BaronySetup implements IBaronySubProcess, IHasBaronySetupPlacement {

  constructor (
    public readonly parent: IHasBaronySetup & IBaronyProcess
  ) { }
  
  readonly type = "sub-process";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterSetup (this, context); }
  
  private placementPlayerIndexes: number[] = [];
  
  start (context: BaronyContext): IBaronyProcessStep {
    const numPlayers = context.getNumberOfPlayers ();
    for (let i = 0; i < numPlayers; i++) {
      this.placementPlayerIndexes.push (i);
    } // for
    for (let i = numPlayers - 1; i >= 0; i--) {
      this.placementPlayerIndexes.push (i);
      this.placementPlayerIndexes.push (i);
    } // for
    const playerIndex = this.placementPlayerIndexes.shift () as number;
    return new BaronySetupPlacement (playerIndex, this);
  } // start

  afterPlacement (placement: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep {
    if (this.placementPlayerIndexes.length) {
      const playerIndex = this.placementPlayerIndexes.shift () as number;
      return new BaronySetupPlacement (playerIndex, this);
    } else {
      return BARONY_PROCESS_END_EVENT;
    } // if - else
  } // afterPlacement

} // BaronySetup

export class BaronySetupPlacement implements IBaronyProcessTask {

  constructor (
    private playerIndex: number,
    public readonly parent: IHasBaronySetupPlacement & IBaronySubProcess
  ) { }
  
  readonly type = "task";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterPlacement (this, context); }
  
  resolve (action: any): void {
    throw new Error ("Method not implemented.");
  } // resolve

} // BaronySetupPlacement
