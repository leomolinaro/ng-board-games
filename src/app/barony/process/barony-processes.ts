import { BaronyGameStore } from "../logic";
import { BaronyConstruction, BaronyLandCoordinates, BaronyMovement, BaronyResourceType } from "../models";
import { IBaronySubProcess, IBaronyProcessStep, BARONY_PROCESS_END_EVENT, IBaronyProcess } from "./barony-process.interfaces";
import { BaronyTurnTask, BaronySetupPlacementTask, BaronySetupPlacement, IHasBaronySetupPlacement, IHasBaronyTurn, BaronyTurn } from "./barony-tasks";

export interface IHasBaronySetup { afterSetup (setup: BaronySetup, game: BaronyGameStore): IBaronyProcessStep; }

export class BaronyPlay implements IBaronyProcess, IHasBaronySetup, IHasBaronyTurn {
  
  readonly type = "process";
  private player!: string;

  start (game: BaronyGameStore): IBaronyProcessStep {
    return new BaronySetup (this);
  } // start

  afterSetup (setup: BaronySetup, game: BaronyGameStore): IBaronyProcessStep {
    const player = game.getPlayers ()[0];
    this.player = player.id;
    game.logTurn (this.player);
    return new BaronyTurnTask ({ player: this.player }, this);
  } // afterSetup

  afterTurn (result: BaronyTurn, game: BaronyGameStore): IBaronyProcessStep {
    switch (result.action) {
      case "recruitment": this.recruitment (result.numberOfKnights, result.land, this.player, game); break;
      case "construction": this.construction (result.constructions, this.player, game); break;
      case "expedition": this.expedition (result.land, this.player, game); break;
      case "movement": this.movement (result.movements, this.player, game); break;
      case "newCity": this.newCity (result.land, this.player, game); break;
      case "nobleTitle": this.nobleTitle (result.discardedResources, this.player, game); break;
    } // switch
    const playerIndex = game.getPlayerIds ().indexOf (this.player);
    const nextPlayerIndex = (playerIndex + 1) % game.getNumberOfPlayers ();
    this.player = game.getPlayers ()[nextPlayerIndex].id;
    game.logTurn (this.player);
    return new BaronyTurnTask ({ player: this.player }, this);
  } // afterTurn

  private recruitment (numberOfKnights: number, landTileCoordinates: BaronyLandCoordinates, player: string, game: BaronyGameStore) {
    for (let i = 0; i < numberOfKnights; i++) {
      game.applyRecruitment (landTileCoordinates, player);
      game.logRecuitment (landTileCoordinates, player);
    } // for
  } // recruitment

  private construction (constructions: BaronyConstruction[], player: string, game: BaronyGameStore) {
    constructions.forEach (construction => {
      game.applyConstruction (construction, player);
      game.logConstruction (construction, player);
    });
  } // construction

  private expedition (land: BaronyLandCoordinates, player: string, game: BaronyGameStore) {
    game.applyExpedition (land, player);
    game.logExpedition (land, player);
  } // expedition

  private movement (movements: BaronyMovement[], player: string, game: BaronyGameStore) {
    movements.forEach ((movement) => {
      game.applyMovement (movement, player);
      game.logMovement (movement, player);
    });
  } // movement

  private newCity (land: BaronyLandCoordinates, player: string, game: BaronyGameStore) {
    game.applyNewCity (land, player);
    game.logNewCity (land, player);
  } // newCity

  private nobleTitle (resources: BaronyResourceType[], player: string, game: BaronyGameStore) {
    game.applyNobleTitle (resources, player);
    game.logNobleTitle (resources, player);
  } // nobleTitle

} // BaronyPlay

export class BaronySetup implements IBaronySubProcess, IHasBaronySetupPlacement {

  constructor (
    public readonly parent: IHasBaronySetup & IBaronyProcess
  ) { }

  readonly type = "sub-process";
  next (game: BaronyGameStore): IBaronyProcessStep { return this.parent.afterSetup (this, game); }
  private placementPlayerIds: string[] = [];
  private player!: string;

  start (game: BaronyGameStore): IBaronyProcessStep {
    const players = game.getPlayers ();
    for (const p of players) {
      this.placementPlayerIds.push (p.id);
    } // for
    for (let i = players.length - 1; i >= 0; i--) {
      this.placementPlayerIds.push (players[i].id);
      this.placementPlayerIds.push (players[i].id);
    } // for
    this.player = this.placementPlayerIds.shift () as string;
    game.logSetup ();
    return new BaronySetupPlacementTask ({ player: this.player }, this);
  } // start
  
  afterPlacement (result: BaronySetupPlacement, game: BaronyGameStore): IBaronyProcessStep {
    if (result.land) {
      game.applySetup (result.land, this.player);
      game.logSetupPlacement (result.land, this.player);
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
