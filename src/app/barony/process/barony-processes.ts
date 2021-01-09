import { BaronyContext } from "./barony-context";
import { IBaronySubProcess, IBaronyProcessStep, BARONY_PROCESS_END_EVENT, IBaronyProcess } from "./barony-process.interfaces";
import { BaronySetupPlacement, IHasBaronySetupPlacement } from "./barony-tasks";

export interface IHasBaronySetup { afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep; }

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
    context.placePawns (["knight", "village"], placement.playerIndex, placement.landTileCoordinates!);
    if (this.placementPlayerIndexes.length) {
      const playerIndex = this.placementPlayerIndexes.shift ()!;
      return new BaronySetupPlacement (playerIndex, this);
    } else {
      return BARONY_PROCESS_END_EVENT;
    } // if - else
  } // afterPlacement

} // BaronySetup
