import { BaronyAction, baronyActions, BaronyLandTileCoordinates } from "../models";
import { BaronyContext } from "./barony-context";
import { IBaronySubProcess, IBaronyProcessStep, BARONY_PROCESS_END_EVENT, IBaronyProcess } from "./barony-process.interfaces";
import { BaronyChooseAction, BaronySetupPlacement, IHasBaronyChooseAction, IHasBaronySetupPlacement } from "./barony-tasks";

export interface IHasBaronySetup { afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep; }
export interface IHasBaronyTurn { afterTurn (turn: BaronyTurn, context: BaronyContext): IBaronyProcessStep; }

export class BaronyPlay implements IBaronyProcess, IHasBaronySetup, IHasBaronyTurn {
  
  readonly type = "process";

  start (context: BaronyContext): IBaronyProcessStep {
    return new BaronySetup (this);
  } // start

  afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep {
    const firstPlayerIndex = 0;
    return new BaronyTurn (firstPlayerIndex, this);
  } // afterSetup

  afterTurn (turn: BaronyTurn, context: BaronyContext): IBaronyProcessStep {
    const nextPlayerIndex = (turn.playerIndex + 1) % context.getNumberOfPlayers ();
    return new BaronyTurn (nextPlayerIndex, this);
  } // afterTurn

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
    const candidateLandTiles = this.getCandidateSetupPlacementLandTiles (context);
    return new BaronySetupPlacement (playerIndex, candidateLandTiles, this);
  } // start
  
  private getCandidateSetupPlacementLandTiles (context: BaronyContext) {
    const candidateLandTiles = context.getFilteredLandTiles (lt => {
      if (lt.type === "lake") { return false; }
      if (lt.type === "forest") { return false; }
      if (lt.pawns.length) { return false; }
      const nearbyLandTiles = context.getNearbyLandTiles (lt.coordinates);
      if (nearbyLandTiles.some (nlt => nlt.pawns.length)) { return false; }
      return true;
    });
    return candidateLandTiles;
  } // getCandidateSetupPlacementLandTiles
  
  afterPlacement (placement: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep {
    if (placement.landTileCoordinates) {
      context.placePawns (["knight", "city"], placement.playerIndex, placement.landTileCoordinates);
      if (this.placementPlayerIndexes.length) {
        const playerIndex = this.placementPlayerIndexes.shift () as number;
        const candidateLandTiles = this.getCandidateSetupPlacementLandTiles (context);
        return new BaronySetupPlacement (playerIndex, candidateLandTiles, this);
      } else {
        return BARONY_PROCESS_END_EVENT;
      } // if - else
    } else {
      return BARONY_PROCESS_END_EVENT;
    } // if - else
  } // afterPlacement

} // BaronySetup

export class BaronyTurn implements IBaronySubProcess, IHasBaronyChooseAction {
  
  constructor (
    public playerIndex: number,
    public readonly parent: IHasBaronyTurn & IBaronyProcess
  ) { }
  
  readonly type = "sub-process";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterTurn (this, context); }
  
  start (context: BaronyContext): IBaronyProcessStep {
    const candidateActions: BaronyAction[] = baronyActions;
    return new BaronyChooseAction (this.playerIndex, candidateActions, this);
  } // start
  
  afterChooseAction (chooseAction: BaronyChooseAction, context: BaronyContext): IBaronyProcessStep {
    return BARONY_PROCESS_END_EVENT;
  } // afterChooseAction

} // BaronyTurn
