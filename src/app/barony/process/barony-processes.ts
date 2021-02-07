import { BaronyContext } from "../logic";
import { BaronyConstruction, BaronyLandCoordinates, BaronyLandType, BaronyMovement, BaronyResourceType } from "../models";
import { IBaronySubProcess, IBaronyProcessStep, BARONY_PROCESS_END_EVENT, IBaronyProcess } from "./barony-process.interfaces";
import { BaronyTurnTask, BaronySetupPlacementTask, BaronySetupPlacement, IHasBaronySetupPlacement, IHasBaronyTurn, BaronyTurn } from "./barony-tasks";

export interface IHasBaronySetup { afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep; }

export class BaronyPlay implements IBaronyProcess, IHasBaronySetup, IHasBaronyTurn {
  
  readonly type = "process";
  private player!: string;

  start (context: BaronyContext): IBaronyProcessStep {
    return new BaronySetup (this);
  } // start

  afterSetup (setup: BaronySetup, context: BaronyContext): IBaronyProcessStep {
    const player = context.getPlayers ()[0];
    this.player = player.id;
    context.logTurn (this.player);
    return new BaronyTurnTask ({ player: this.player }, this);
  } // afterSetup

  afterTurn (result: BaronyTurn, context: BaronyContext): IBaronyProcessStep {
    switch (result.action) {
      case "recruitment": this.recruitment (result.numberOfKnights, result.land, this.player, context); break;
      case "construction": this.construction (result.constructions, this.player, context); break;
      case "expedition": this.expedition (result.land, this.player, context); break;
      case "movement": this.movement (result.movements, this.player, context); break;
      case "newCity": this.newCity (result.land, this.player, context); break;
      case "nobleTitle": this.nobleTitle (result.discardedResources, this.player, context); break;
    } // switch
    const playerIndex = context.getPlayerIds ().indexOf (this.player);
    const nextPlayerIndex = (playerIndex + 1) % context.getNumberOfPlayers ();
    this.player = context.getPlayers ()[nextPlayerIndex].id;
    context.logTurn (this.player);
    return new BaronyTurnTask ({ player: this.player }, this);
  } // afterTurn

  private recruitment (numberOfKnights: number, landTileCoordinates: BaronyLandCoordinates, player: string, context: BaronyContext) {
    for (let i = 0; i < numberOfKnights; i++) {
      context.applyRecruitment (landTileCoordinates, player);
      context.logRecuitment (landTileCoordinates, player);
    } // for
  } // recruitment

  private construction (constructions: BaronyConstruction[], player: string, context: BaronyContext) {
    constructions.forEach (construction => {
      context.applyConstruction (construction, player);
      context.logConstruction (construction, player);
    });
  } // construction

  private expedition (land: BaronyLandCoordinates, player: string, context: BaronyContext) {
    context.applyExpedition (land, player);
    context.logExpedition (land, player);
  } // expedition

  private movement (movements: BaronyMovement[], player: string, context: BaronyContext) {
    movements.forEach ((movement) => {
      context.applyMovement (movement, player);
      context.logMovement (movement, player);
    });
  } // movement

  private newCity (land: BaronyLandCoordinates, player: string, context: BaronyContext) {
    context.applyNewCity (land, player);
    context.logNewCity (land, player);
  } // newCity

  private nobleTitle (resources: BaronyResourceType[], player: string, context: BaronyContext) {
    context.applyNobleTitle (resources, player);
    context.logNobleTitle (resources, player);
  } // nobleTitle

} // BaronyPlay

export class BaronySetup implements IBaronySubProcess, IHasBaronySetupPlacement {

  constructor (
    public readonly parent: IHasBaronySetup & IBaronyProcess
  ) { }

  readonly type = "sub-process";
  next (context: BaronyContext): IBaronyProcessStep { return this.parent.afterSetup (this, context); }
  private placementPlayerIds: string[] = [];
  private player!: string;

  start (context: BaronyContext): IBaronyProcessStep {
    const players = context.getPlayers ();
    for (const p of players) {
      this.placementPlayerIds.push (p.id);
    } // for
    for (let i = players.length - 1; i >= 0; i--) {
      this.placementPlayerIds.push (players[i].id);
      this.placementPlayerIds.push (players[i].id);
    } // for
    this.player = this.placementPlayerIds.shift () as string;
    context.logSetup ();
    return new BaronySetupPlacementTask ({ player: this.player }, this);
  } // start
  
  afterPlacement (result: BaronySetupPlacement, context: BaronyContext): IBaronyProcessStep {
    if (result.land) {
      context.applySetup (result.land, this.player);
      context.logSetupPlacement (result.land, this.player);
      if (this.placementPlayerIds.length) {
        this.player = this.placementPlayerIds.shift () as string;
        return new BaronySetupPlacementTask ({ player: this.player }, this);
      } else {
        return BARONY_PROCESS_END_EVENT;
      } // if - else
    } else {
      return BARONY_PROCESS_END_EVENT;
    } // if - else
  } // afterPlacement

} // BaronySetup
