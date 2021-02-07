import { immutableUtil } from "@bg-utils";
import { Observable } from "rxjs";
import { BgStore } from "src/app/bg-utils/store.util";
import { BaronyColor, BaronyConstruction, BaronyLand, BaronyLandCoordinates, BaronyMovement, BaronyPawn, BaronyPawnType, BaronyPlayer, BaronyResourceType, landCoordinatesToId } from "../models";
import { createPlayer, getRandomLands } from "./barony-initializer";

interface BaronyGameBox {
  removedPawns: BaronyPawn[];
} // BaronyGameBox

interface BaronyState {
  players: {
    map: { [id: string]: BaronyPlayer },
    ids: string[]
  };
  lands: {
    map: { [id: string]: BaronyLand };
    coordinates: BaronyLandCoordinates[];
  };
  gameBox: BaronyGameBox;
} // BaronyState

export class BaronyContext extends BgStore<BaronyState> {

  constructor (nPlayers: number) {
    super ({
      players: {
        map: {
          leo: createPlayer ("leo", "Leo", "blue"),
          nico: createPlayer ("nico", "Nico", "red"),
          rob: createPlayer ("rob", "Rob", "green"),
          salvatore: createPlayer ("salvatore", "Salvatore", "yellow"),
        },
        ids: ["leo", "nico", "rob", "salvatore"].filter ((v, index) => index < nPlayers)
      },
      lands: getRandomLands (nPlayers),
      gameBox: {
        removedPawns: []
      }
    });
  } // constructor

  private notTemporaryState: BaronyState | null = null;
  isTemporaryState () { return !!this.notTemporaryState; }
  startTemporaryState () {
    this.notTemporaryState = this.get ();
  } // startTemporaryState
  endTemporaryState () {
    if (this.notTemporaryState) {
      const state = this.notTemporaryState;
      this.update (s => ({ ...state }));
      this.notTemporaryState = null;
    } else {
      throw new Error ("endTemporaryState without startTemporaryState");
    } // if - else
  } // endTemporaryState

  getPlayers (): BaronyPlayer[] { return this.get (s => s.players.ids.map (id => s.players.map[id])); }
  getPlayer (id: string): BaronyPlayer { return this.get (s => s.players.map[id]); }
  getPlayerIds () { return this.get (s => s.players.ids); }
  getPlayerMap () { return this.get (s => s.players.map); }
  getNumberOfPlayers (): number { return this.getPlayers ().length; }
  getLandCoordinates (): BaronyLandCoordinates[] {
    return this.get (s => s.lands.coordinates);
  } // getLandCoordinates
  getLand (land: BaronyLandCoordinates) { return this.get (s => s.lands.map[landCoordinatesToId (land)]); }
  getLands (): BaronyLand[] {
    const map = this.get (s => s.lands.map);
    const coordinates = this.get (s => s.lands.coordinates);
    return coordinates.map (coordinate => map[landCoordinatesToId (coordinate)]);
  } // getLandTiles
  getLandOrNull (land: BaronyLandCoordinates): BaronyLand | null { return this.getLand (land) || null; }

  private selectLandTileMap$ () { return this.select$ (s => s.lands.map); }
  private selectLandTileKeys$ () { return this.select$ (s => s.lands.coordinates); }
  selectLands$ (): Observable<BaronyLand[]> {
    return this.select$ (
      this.selectLandTileMap$ (),
      this.selectLandTileKeys$ (),
      (map, keys) => keys.map (k => map[landCoordinatesToId (k)])
    );
  } // selectLandTiles$
  selectPlayerIds$ () { return this.select$ (s => s.players.ids); }
  selectPlayerMap$ () { return this.select$ (s => s.players.map); }

  private updatePlayer (playerId: string, updater: (p: BaronyPlayer) => BaronyPlayer) {
    this.update (s => ({
      ...s,
      players: {
        ...s.players,
        map: {
          ...s.players.map,
          [playerId]: updater (s.players.map[playerId])
        }
      }
    }));
  } // updatePlayer

  private updateGameBox (updater: (gameBox: BaronyGameBox) => BaronyGameBox) {
    this.update (s => ({
      ...s,
      gameBox: updater (s.gameBox)
    }));
  } // updateGameBox

  private updateLand (land: BaronyLandCoordinates, updater: (lt: BaronyLand) => BaronyLand) {
    const key = landCoordinatesToId (land);
    this.update (s => ({
      ...s,
      lands: {
        ...s.lands,
        map: {
          ...s.lands.map,
          [key]: updater (s.lands.map[key])
        }
      }
    }));
  } // updatePlayer

  private addPawnToPlayer (pawnType: BaronyPawnType, playerId: string) {
    this.updatePlayer (playerId, p => ({
      ...p,
      pawns: {
        ...p.pawns,
        [pawnType]: p.pawns[pawnType] + 1
      }
    }));
  } // addPawnToPlayer

  private removePawnFromPlayer (pawnType: BaronyPawnType, playerId: string) {
    this.updatePlayer (playerId, p => ({
      ...p,
      pawns: {
        ...p.pawns,
        [pawnType]: p.pawns[pawnType] - 1
      }
    }));
  } // removePawnFromPlayer

  private addPawnToLandTile (pawnType: BaronyPawnType, pawnColor: BaronyColor, land: BaronyLandCoordinates) {
    this.updateLand (land, lt => ({
      ...lt,
      pawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], lt.pawns)
    }));
  } // addPawnToLandTile
  
  private removePawnFromLandTile (pawnType: BaronyPawnType, pawnColor: BaronyColor, land: BaronyLandCoordinates) {
    this.updateLand (land, lt => ({
      ...lt,
      pawns: immutableUtil.listRemoveFirst (p => p.type === pawnType && p.color === pawnColor, lt.pawns)
    }));
  } // removePawnFromLandTile

  private addResourceToPlayer (resource: BaronyResourceType, playerId: string) {
    this.updatePlayer (playerId, p => ({
      ...p,
      resources: {
        ...p.resources,
        [resource]: p.resources[resource] + 1
      }
    }));
  } // addResourceToPlayer

  private removeResourceFromPlayer (resource: BaronyResourceType, playerId: string) {
    this.updatePlayer (playerId, p => ({
      ...p,
      resources: {
        ...p.resources,
        [resource]: p.resources[resource] - 1
      }
    }));
  } // addResourceToPlayer

  private getResourceFromLand (landCoordinates: BaronyLandCoordinates): BaronyResourceType {
    const land = this.getLand (landCoordinates);
    return land?.type as BaronyResourceType;
  } // getResourceFromLand

  private addVictoryPoints (victoryPoints: number, playerId: string) {
    this.updatePlayer (playerId, p => ({
      ...p,
      score: p.score + victoryPoints
    }));
  } // addVictoryPoints

  private addPawnToGameBox (pawnType: BaronyPawnType, pawnColor: BaronyColor) {
    this.updateGameBox (gameBox => ({
      ...gameBox,
      removedPawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], gameBox.removedPawns)
    }));
  } // addPawnToGameBox

  applySetup (land: BaronyLandCoordinates, player: string) {
    const playerColor = this.getPlayer (player).color;
    this.removePawnFromPlayer ("knight", player);
    this.addPawnToLandTile ("knight", playerColor, land);
    this.removePawnFromPlayer ("city", player);
    this.addPawnToLandTile ("city", playerColor, land);
  } // applySetup

  applyRecruitment (land: BaronyLandCoordinates, playerId: string) {
    const player = this.getPlayer (playerId);
    this.removePawnFromPlayer ("knight", player.id);
    this.addPawnToLandTile ("knight", player.color, land);
  } // applyRecruitment

  applyMovement (movement: BaronyMovement, playerId: string) {
    const player = this.getPlayer (playerId);
    this.removePawnFromLandTile ("knight", player.color, movement.fromLand);
    this.addPawnToLandTile ("knight", player.color, movement.toLand);
    if (movement.conflict) {
      const land = this.getLand (movement.toLand);
      let villagePlayer: BaronyPlayer | null = null;
      land.pawns
      .filter (pawn => pawn.color !== player.color)
      .forEach (pawn => {
        const pawnPlayer = this.getPlayers ().find (p => p.color === pawn.color) as BaronyPlayer;
        this.removePawnFromLandTile (pawn.type, pawn.color, land.coordinates);
        this.addPawnToPlayer (pawn.type, pawnPlayer.id);
        if (pawn.type === "village") {
          villagePlayer = pawnPlayer;
        } // if
      });
      if (villagePlayer && movement.gainedResource) {
        this.removeResourceFromPlayer (movement.gainedResource, (villagePlayer as BaronyPlayer).id);
        this.addResourceToPlayer (movement.gainedResource, playerId);
      } // if
    } // if
  } // applyMovement

  applyConstruction (construction: BaronyConstruction, playerId: string) {
    const player = this.getPlayer (playerId);
    this.removePawnFromLandTile ("knight", player.color, construction.land);
    this.removePawnFromPlayer (construction.building, player.id);
    this.addPawnToLandTile (construction.building, player.color, construction.land);
    this.addPawnToPlayer ("knight", player.id);
    const resource = this.getResourceFromLand (construction.land);
    this.addResourceToPlayer (resource, player.id);
  } // applyConstruction
  
  applyNewCity (land: BaronyLandCoordinates, playerId: string) {
    const player = this.getPlayer (playerId);
    this.removePawnFromLandTile ("village", player.color, land);
    this.addPawnToLandTile ("city", player.color, land);
    this.addPawnToPlayer ("village", playerId);
    this.removePawnFromPlayer ("city", playerId);
    this.addVictoryPoints (10, playerId);
  } // applyNewCity

  applyExpedition (land: BaronyLandCoordinates, playerId: string) {
    const player = this.getPlayer (playerId);
    this.removePawnFromPlayer ("knight", playerId);
    this.addPawnToLandTile ("knight", player.color, land);
    this.removePawnFromPlayer ("knight", playerId);
    this.addPawnToGameBox ("knight", player.color);
  } // applyExpedition

  discardResource (resource: BaronyResourceType, playerId: string) {
    this.removeResourceFromPlayer (resource, playerId);
  } // discardResource

  applyNobleTitle (resources: BaronyResourceType[], playerId: string) {
    resources.forEach (resource => this.discardResource (resource, playerId));
    this.addVictoryPoints (15, playerId);
  } // applyNobleTitle

} // BaronyContext
