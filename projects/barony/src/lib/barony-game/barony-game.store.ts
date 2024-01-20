import { Injectable } from "@angular/core";
import { BgUser } from "@leobg/commons";
import { BgStore, arrayUtil, immutableUtil } from "@leobg/commons/utils";
import { Observable } from "rxjs";
import {
  BaronyColor,
  BaronyConstruction,
  BaronyFinalScores,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyLog,
  BaronyMovement,
  BaronyPawn,
  BaronyPawnType,
  BaronyPlayer,
  BaronyResourceType,
  landCoordinatesToId,
} from "../barony-models";

interface BaronyGameBox {
  removedPawns: BaronyPawn[];
} // BaronyGameBox

interface BaronyGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: { [id in BaronyColor]?: BaronyPlayer };
    ids: BaronyColor[];
  };
  lands: {
    map: { [id: string]: BaronyLand };
    coordinates: BaronyLandCoordinates[];
  };
  gameBox: BaronyGameBox;
  logs: BaronyLog[];
  endGame: boolean;
} // BaronyGameState

@Injectable ()
export class BaronyGameStore extends BgStore<BaronyGameState> {
  constructor () {
    super (
      {
        gameId: "",
        gameOwner: null as any,
        players: { map: {}, ids: [] },
        lands: { map: {}, coordinates: [] },
        gameBox: { removedPawns: [] },
        logs: [],
        endGame: false,
      },
      "Barony Game"
    );
  } // constructor

  setInitialState (
    players: BaronyPlayer[],
    lands: BaronyLand[],
    gameId: string,
    gameOwner: BgUser
  ) {
    this.update ("Initial state", (s) => ({
      gameId: gameId,
      gameOwner: gameOwner,
      players: {
        map: arrayUtil.toMap (players, (p) => p.id),
        ids: players.map ((p) => p.id),
      },
      lands: {
        map: arrayUtil.toMap (lands, (l) => l.id),
        coordinates: lands.map ((l) => l.coordinates),
      },
      gameBox: {
        removedPawns: [],
      },
      logs: [],
      endGame: false,
    }));
  } // setState

  private notTemporaryState: BaronyGameState | null = null;
  isTemporaryState () {
    return !!this.notTemporaryState;
  }
  startTemporaryState () {
    this.notTemporaryState = this.get ();
  } // startTemporaryState
  endTemporaryState () {
    if (this.notTemporaryState) {
      const state = this.notTemporaryState;
      this.update ("End temporary state", (s) => ({ ...state }));
      this.notTemporaryState = null;
    } else {
      throw new Error ("endTemporaryState without startTemporaryState");
    } // if - else
  } // endTemporaryState

  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): BaronyPlayer[] { return this.get (s => s.players.ids.map ((id) => s.players.map[id]!)); }
  getPlayer (id: BaronyColor): BaronyPlayer { return this.get (s => s.players.map[id]!); }
  // isLocalPlayer (id: string): boolean { return !this.getPlayer (id).isAi && !this.getPlayer (id).isRemote; }
  getPlayerIds () { return this.get (s => s.players.ids); }
  getPlayerMap () { return this.get (s => s.players.map); }
  getNumberOfPlayers (): number { return this.getPlayers ().length; }
  getLandCoordinates (): BaronyLandCoordinates[] { return this.get (s => s.lands.coordinates); }
  getLand (land: BaronyLandCoordinates) { return this.get (s => s.lands.map[landCoordinatesToId (land)]); }
  getLands (): BaronyLand[] {
    const map = this.get (s => s.lands.map);
    const coordinates = this.get (s => s.lands.coordinates);
    return coordinates.map (
      (coordinate) => map[landCoordinatesToId (coordinate)]
    );
  } // getLandTiles
  getLandOrNull (land: BaronyLandCoordinates): BaronyLand | null { return this.getLand (land) || null; }

  private selectLandTileMap$ () { return this.select$ ((s) => s.lands.map); }
  private selectLandTileKeys$ () { return this.select$ ((s) => s.lands.coordinates); }
  selectLands$ (): Observable<BaronyLand[]> {
    return this.select$ (
      this.selectLandTileMap$ (),
      this.selectLandTileKeys$ (),
      (map, keys) => keys.map ((k) => map[landCoordinatesToId (k)])
    );
  } // selectLandTiles$
  selectPlayerIds$ () { return this.select$ ((s) => s.players.ids); }
  selectPlayerMap$ () { return this.select$ ((s) => s.players.map); }
  selectLogs$ () { return this.select$ ((s) => s.logs); }
  selectEndGame$ () { return this.select$ ((s) => s.endGame); }

  private updatePlayer (actionName: string, playerId: BaronyColor, updater: (p: BaronyPlayer) => BaronyPlayer) {
    this.update (actionName, (s) => ({
      ...s,
      players: {
        ...s.players,
        map: {
          ...s.players.map,
          [playerId]: updater (s.players.map[playerId]!),
        },
      },
    }));
  } // updatePlayer

  private updateGameBox (actionName: string, updater: (gameBox: BaronyGameBox) => BaronyGameBox) {
    this.update (actionName, (s) => ({
      ...s,
      gameBox: updater (s.gameBox),
    }));
  } // updateGameBox

  private updateLand (actionName: string, land: BaronyLandCoordinates, updater: (lt: BaronyLand) => BaronyLand) {
    const key = landCoordinatesToId (land);
    this.update (actionName, (s) => ({
      ...s,
      lands: {
        ...s.lands,
        map: {
          ...s.lands.map,
          [key]: updater (s.lands.map[key]),
        },
      },
    }));
  } // updatePlayer

  private addPawnToPlayer (pawnType: BaronyPawnType, playerId: BaronyColor) {
    this.updatePlayer ("Add pawn to player", playerId, (p) => ({
      ...p,
      pawns: {
        ...p.pawns,
        [pawnType]: p.pawns[pawnType] + 1,
      },
    }));
  } // addPawnToPlayer

  private removePawnFromPlayer (pawnType: BaronyPawnType, playerId: BaronyColor) {
    this.updatePlayer ("Remove pawn from player", playerId, (p) => ({
      ...p,
      pawns: {
        ...p.pawns,
        [pawnType]: p.pawns[pawnType] - 1,
      },
    }));
  } // removePawnFromPlayer

  private addPawnToLandTile (
    pawnType: BaronyPawnType,
    pawnColor: BaronyColor,
    land: BaronyLandCoordinates
  ) {
    this.updateLand ("Add pawn to land tile", land, (lt) => ({
      ...lt,
      pawns: immutableUtil.listPush (
        [{ color: pawnColor, type: pawnType }],
        lt.pawns
      ),
    }));
  } // addPawnToLandTile

  private removePawnFromLandTile (
    pawnType: BaronyPawnType,
    pawnColor: BaronyColor,
    land: BaronyLandCoordinates
  ) {
    this.updateLand ("Remove pawn from land tile", land, (lt) => ({
      ...lt,
      pawns: immutableUtil.listRemoveFirst (
        (p) => p.type === pawnType && p.color === pawnColor,
        lt.pawns
      ),
    }));
  } // removePawnFromLandTile

  private addResourceToPlayer (resource: BaronyResourceType, playerId: BaronyColor) {
    this.updatePlayer ("Add resource to player", playerId, (p) => ({
      ...p,
      resources: {
        ...p.resources,
        [resource]: p.resources[resource] + 1,
      },
    }));
  } // addResourceToPlayer

  private removeResourceFromPlayer (resource: BaronyResourceType, playerId: BaronyColor) {
    this.updatePlayer ("Remove resource from player", playerId, (p) => ({
      ...p,
      resources: {
        ...p.resources,
        [resource]: p.resources[resource] - 1,
      },
    }));
  } // addResourceToPlayer

  private getResourceFromLand (landCoordinates: BaronyLandCoordinates): BaronyResourceType {
    const land = this.getLand (landCoordinates);
    return land?.type as BaronyResourceType;
  } // getResourceFromLand

  private addVictoryPoints (victoryPoints: number, playerId: BaronyColor) {
    this.updatePlayer ("Add victory points", playerId, (p) => ({
      ...p,
      score: p.score + victoryPoints,
    }));
  } // addVictoryPoints

  private addPawnToGameBox (pawnType: BaronyPawnType, pawnColor: BaronyColor) {
    this.updateGameBox ("Add pawn to gameBox", (gameBox) => ({
      ...gameBox,
      removedPawns: immutableUtil.listPush (
        [{ color: pawnColor, type: pawnType }],
        gameBox.removedPawns
      ),
    }));
  } // addPawnToGameBox

  private addLog (actionName: string, log: BaronyLog) {
    this.update (actionName, (s) => ({
      ...s,
      logs: [...s.logs, log],
    }));
  } // addLog

  applySetup (land: BaronyLandCoordinates, player: BaronyColor) {
    this.removePawnFromPlayer ("knight", player);
    this.addPawnToLandTile ("knight", player, land);
    this.removePawnFromPlayer ("city", player);
    this.addPawnToLandTile ("city", player, land);
  } // applySetup

  applyRecruitment (land: BaronyLandCoordinates, playerId: BaronyColor) {
    this.removePawnFromPlayer ("knight", playerId);
    this.addPawnToLandTile ("knight", playerId, land);
  } // applyRecruitment

  applyMovement (movement: BaronyMovement, playerId: BaronyColor) {
    this.removePawnFromLandTile ("knight", playerId, movement.fromLand);
    this.addPawnToLandTile ("knight", playerId, movement.toLand);
    if (movement.conflict) {
      const land = this.getLand (movement.toLand);
      let villagePlayer: BaronyPlayer | null = null;
      land.pawns
        .filter ((pawn) => pawn.color !== playerId)
        .forEach ((pawn) => {
          const pawnPlayer = this.getPlayers ().find (
            (p) => p.id === pawn.color
          ) as BaronyPlayer;
          this.removePawnFromLandTile (pawn.type, pawn.color, land.coordinates);
          this.addPawnToPlayer (pawn.type, pawnPlayer.id);
          if (pawn.type === "village") {
            villagePlayer = pawnPlayer;
          } // if
        });
      if (villagePlayer && movement.gainedResource) {
        this.removeResourceFromPlayer (
          movement.gainedResource,
          (villagePlayer as BaronyPlayer).id
        );
        this.addResourceToPlayer (movement.gainedResource, playerId);
      } // if
    } // if
  } // applyMovement

  applyConstruction (construction: BaronyConstruction, playerId: BaronyColor) {
    this.removePawnFromLandTile ("knight", playerId, construction.land);
    this.removePawnFromPlayer (construction.building, playerId);
    this.addPawnToLandTile (construction.building, playerId, construction.land);
    this.addPawnToPlayer ("knight", playerId);
    const resource = this.getResourceFromLand (construction.land);
    this.addResourceToPlayer (resource, playerId);
  } // applyConstruction

  applyNewCity (land: BaronyLandCoordinates, playerId: BaronyColor) {
    this.removePawnFromLandTile ("village", playerId, land);
    this.addPawnToLandTile ("city", playerId, land);
    this.addPawnToPlayer ("village", playerId);
    this.removePawnFromPlayer ("city", playerId);
    this.addVictoryPoints (10, playerId);
  } // applyNewCity

  applyExpedition (land: BaronyLandCoordinates, playerId: BaronyColor) {
    this.removePawnFromPlayer ("knight", playerId);
    this.addPawnToLandTile ("knight", playerId, land);
    this.removePawnFromPlayer ("knight", playerId);
    this.addPawnToGameBox ("knight", playerId);
  } // applyExpedition

  applyEndGame (finalScores: BaronyFinalScores) {
    this.update ("Set end game", (s) => ({
      ...s,
      players: {
        ...s.players,
        map: arrayUtil.toMap (
          s.players.ids,
          (id) => id,
          (id) => ({
            ...s.players.map[id],
            victoryPoints: finalScores.victoryPointsByPlayer[id],
            winner: finalScores.winnerPlayer === id,
          })
        ),
      },
      endGame: true,
    }));
  } // applyEndGame

  discardResource (resource: BaronyResourceType, playerId: BaronyColor) {
    this.removeResourceFromPlayer (resource, playerId);
  } // discardResource

  applyNobleTitle (resources: BaronyResourceType[], playerId: BaronyColor) {
    resources.forEach (resource => this.discardResource (resource, playerId));
    this.addVictoryPoints (15, playerId);
  } // applyNobleTitle

  logMovement (movement: BaronyMovement, player: BaronyColor) {
    this.addLog ("Log movement", { type: "movement", movement: movement, player: player });
  }
  logExpedition (land: BaronyLandCoordinates, player: BaronyColor) {
    this.addLog ("Log expedition", { type: "expedition", land: land, player: player });
  }
  logNobleTitle (resources: BaronyResourceType[], player: BaronyColor) {
    this.addLog ("Log nobleTitle", { type: "nobleTitle", resources: resources, player: player });
  }
  logNewCity (land: BaronyLandCoordinates, player: BaronyColor) {
    this.addLog ("Log newCity", { type: "newCity", land: land, player: player });
  }
  logConstruction (construction: BaronyConstruction, player: BaronyColor) {
    this.addLog ("Log construction", { type: "construction", construction: construction, player: player });
  }
  logRecuitment (land: BaronyLandCoordinates, player: BaronyColor) {
    this.addLog ("Log recuitment", { type: "recruitment", land: land, player: player });
  }
  logTurn (player: BaronyColor) { this.addLog ("Log turn", { type: "turn", player: player }); }
  logSetupPlacement (land: BaronyLandCoordinates, player: BaronyColor) {
    this.addLog ("Log setupPlacement", { type: "setupPlacement", land: land, player: player });
  }
  logSetup () { this.addLog ("Log setup", { type: "setup" }); }

}
