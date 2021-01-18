import { baronyRules, BaronyContext } from "../logic";
import { BaronyPlayer } from "../models";
import { IBaronySubProcess, IBaronyProcessStep, BARONY_PROCESS_END_EVENT, IBaronyProcess } from "./barony-process.interfaces";
import { BaronyTurn, BaronySetupPlacement, BaronySetupPlacementResult, IHasBaronySetupPlacement, IHasBaronyTurn, BaronyTurnResult } from "./barony-tasks";

export interface IHasBaronySetup { afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep; }

export class BaronyPlay implements IBaronyProcess, IHasBaronySetup, IHasBaronyTurn {
  
  readonly type = "process";
  private turnPlayer!: BaronyPlayer;

  start (context: BaronyContext): IBaronyProcessStep {
    return new BaronySetup (this);
  } // start

  afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep {
    this.turnPlayer = context.getPlayerByIndex (0);
    const availableActions = baronyRules.getAvailableActions (this.turnPlayer, context);
    return new BaronyTurn ({ player: this.turnPlayer, availableActions: availableActions }, this);
  } // afterSetup

  afterTurn (result: BaronyTurnResult, context: BaronyContext): IBaronyProcessStep {
    const turnPlayerIndex = (this.turnPlayer.index + 1) % context.getNumberOfPlayers ();
    this.turnPlayer = context.getPlayerByIndex (turnPlayerIndex);
    const availableActions = baronyRules.getAvailableActions (this.turnPlayer, context);
    return new BaronyTurn ({ player: this.turnPlayer, availableActions: availableActions }, this);
  } // afterTurn

} // BaronyPlay

export class BaronySetup implements IBaronySubProcess, IHasBaronySetupPlacement {

  constructor (
    public readonly parent: IHasBaronySetup & IBaronyProcess
  ) { }

  readonly type = "sub-process";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterSetup (this, context); }
  private placementPlayerIndexes: number[] = [];
  private turnPlayer!: BaronyPlayer;

  start (context: BaronyContext): IBaronyProcessStep {
    const numPlayers = context.getNumberOfPlayers ();
    for (let i = 0; i < numPlayers; i++) {
      this.placementPlayerIndexes.push (i);
    } // for
    for (let i = numPlayers - 1; i >= 0; i--) {
      this.placementPlayerIndexes.push (i);
      this.placementPlayerIndexes.push (i);
    } // for
    const turnPlayerIndex = this.placementPlayerIndexes.shift () as number;
    this.turnPlayer = context.getPlayerByIndex (turnPlayerIndex);
    const availableLandTiles = baronyRules.getAvailableLandTilesForSetupPlacement (context);
    return new BaronySetupPlacement ({ player: this.turnPlayer, availableLandTiles }, this);
  } // start
  
  afterPlacement (result: BaronySetupPlacementResult, context: BaronyContext): IBaronyProcessStep {
    if (result.choosenLandTileCoordinates) {
      context.placePawns (["knight", "city"], this.turnPlayer.index, result.choosenLandTileCoordinates);
      if (this.placementPlayerIndexes.length) {
        const turnPlayerIndex = this.placementPlayerIndexes.shift () as number;
        this.turnPlayer = context.getPlayerByIndex (turnPlayerIndex);
        const availableLandTiles = baronyRules.getAvailableLandTilesForSetupPlacement (context);
        return new BaronySetupPlacement ({ player: this.turnPlayer, availableLandTiles }, this);
      } else {
        return BARONY_PROCESS_END_EVENT;
      } // if - else
    } else {
      return BARONY_PROCESS_END_EVENT;
    } // if - else
  } // afterPlacement

} // BaronySetup
