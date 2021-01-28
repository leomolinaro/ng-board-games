import { baronyRules, BaronyContext } from "../logic";
import { BaronyConstruction, BaronyLandTile, BaronyLandTileCoordinates, BaronyLandType, BaronyMovement, BaronyPlayer, BaronyResourceType } from "../models";
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
    const validActions = baronyRules.getValidActions (this.turnPlayer, context);
    return new BaronyTurn ({ player: this.turnPlayer, validActions: validActions }, this);
  } // afterSetup

  afterTurn (result: BaronyTurnResult, context: BaronyContext): IBaronyProcessStep {
    switch (result.choosenAction) {
      case "recruitment": this.recruitment (result.numberOfKnights, result.landTileCoordinates, this.turnPlayer, context); break;
      case "construction": this.construction (result.constructions, this.turnPlayer, context); break;
      case "expedition": this.expedition (result.landTileCoordinates, this.turnPlayer, context); break;
      case "movement": this.movement (result.movements, result.gainedResources, this.turnPlayer, context); break;
      case "newCity": this.newCity (result.landTileCoordinates, this.turnPlayer, context); break;
      case "nobleTitle": this.nobleTitle (result.discardedResources, this.turnPlayer, context); break;
    } // switch
    const turnPlayerIndex = (this.turnPlayer.index + 1) % context.getNumberOfPlayers ();
    this.turnPlayer = context.getPlayerByIndex (turnPlayerIndex);
    const validActions = baronyRules.getValidActions (this.turnPlayer, context);
    return new BaronyTurn ({ player: this.turnPlayer, validActions: validActions }, this);
  } // afterTurn

  private recruitment (numberOfKnights: number, landTileCoordinates: BaronyLandTileCoordinates, player: BaronyPlayer, context: BaronyContext) {
    for (let i = 0; i < numberOfKnights; i++) {
      context.applyRecruitment (landTileCoordinates, player);
    } // for
  } // recruitment

  private construction (constructions: BaronyConstruction[], player: BaronyPlayer, context: BaronyContext) {
    constructions.forEach (construction => {
      context.applyConstruction (construction, player);
    });
  } // construction

  private expedition (landTileCoordinates: BaronyLandTileCoordinates, player: BaronyPlayer, context: BaronyContext) {
    console.error ("TODO");
  } // expedition

  private movement (movements: BaronyMovement[], gainedResources: (BaronyResourceType | null)[], player: BaronyPlayer, context: BaronyContext) {
    movements.forEach ((movement, index) => {
      context.applyMovement (movement, gainedResources[index], player);
    });
  } // movement

  private newCity (landTileCoordinates: BaronyLandTileCoordinates, player: BaronyPlayer, context: BaronyContext) {
    console.error ("TODO");
  } // newCity

  private nobleTitle (discardedResources: BaronyLandType[], player: BaronyPlayer, context: BaronyContext) {
    console.error ("TODO");
  } // nobleTitle

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
    const validLandTiles = baronyRules.getValidLandTilesForSetupPlacement (context);
    return new BaronySetupPlacement ({ player: this.turnPlayer, validLandTiles }, this);
  } // start
  
  afterPlacement (result: BaronySetupPlacementResult, context: BaronyContext): IBaronyProcessStep {
    if (result.choosenLandTileCoordinates) {
      context.applySetup (result.choosenLandTileCoordinates, this.turnPlayer);
      if (this.placementPlayerIndexes.length) {
        const turnPlayerIndex = this.placementPlayerIndexes.shift () as number;
        this.turnPlayer = context.getPlayerByIndex (turnPlayerIndex);
        const validLandTiles = baronyRules.getValidLandTilesForSetupPlacement (context);
        return new BaronySetupPlacement ({ player: this.turnPlayer, validLandTiles }, this);
      } else {
        return BARONY_PROCESS_END_EVENT;
      } // if - else
    } else {
      return BARONY_PROCESS_END_EVENT;
    } // if - else
  } // afterPlacement

} // BaronySetup
