import { Injectable } from "@angular/core";
import { BgUser } from "@bg-services";
import { arrayUtil, BgStore } from "@bg-utils";
import { BritArea, BritAreaId, BritLog, BritNation, BritNationId, BritPlayer, BritUnit } from "../brit-models";

interface BritGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: { [id: string]: BritPlayer },
    ids: string[]
  };
  areas: {
    map: { [id: string]: BritArea };
    ids: BritAreaId[];
  };
  nations: {
    map: { [id: string]: BritNation };
    ids: BritNationId[];
  };
  units: {
    map: { [id: string]: BritUnit };
    ids: string[];
  };
  logs: BritLog[];
} // BritGameState

@Injectable ()
export class BritGameStore extends BgStore<BritGameState> {

  constructor () {
    super ({
      gameId: "",
      gameOwner: null as any,
      players: { map: { }, ids: [] },
      areas: { map: { }, ids: [] },
      nations: { map: { }, ids: [] },
      units: { map: { }, ids: [] },
      logs: []
    });
  } // constructor

  setInitialState (
    players: BritPlayer[],
    nations: BritNation[],
    areas: BritArea[],
    units: BritUnit[],
    gameId: string,
    gameOwner: BgUser
  ) {
    this.update (s => ({
      gameId: gameId,
      gameOwner: gameOwner,
      players: {
        map: arrayUtil.toMap (players, p => p.id),
        ids: players.map (p => p.id)
      },
      areas: {
        map: arrayUtil.toMap (areas, a => a.id),
        ids: areas.map (a => a.id)
      },
      nations: {
        map: arrayUtil.toMap (nations, n => n.id),
        ids: nations.map (n => n.id)
      },
      units: {
        map: arrayUtil.toMap (units, u => u.id),
        ids: units.map (u => u.id)
      },
      logs: []
    }));
  } // setInitialState

  // private notTemporaryState: BritGameState | null = null;
  // isTemporaryState () { return !!this.notTemporaryState; }
  // startTemporaryState () {
  //   this.notTemporaryState = this.get ();
  // } // startTemporaryState
  // endTemporaryState () {
  //   if (this.notTemporaryState) {
  //     const state = this.notTemporaryState;
  //     this.update (s => ({ ...state }));
  //     this.notTemporaryState = null;
  //   } else {
  //     throw new Error ("endTemporaryState without startTemporaryState");
  //   } // if - else
  // } // endTemporaryState

  selectAreas$ () {
    return this.select$ (this.select$ (s => s.areas), areas => {
      return areas.ids.map (id => areas.map[id]);
    });
  } // selectAreas$

  selectPlayers$ () {
    return this.select$ (this.select$ (s => s.players), players => {
      return players.ids.map (id => players.map[id]);
    });
  } // selectPlayers$

  // getGameId (): string { return this.get (s => s.gameId); }
  // getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  // getPlayers (): BritPlayer[] { return this.get (s => s.players.ids.map (id => s.players.map[id])); }
  // getPlayer (id: string): BritPlayer { return this.get (s => s.players.map[id]); }
  // // isLocalPlayer (id: string): boolean { return !this.getPlayer (id).isAi && !this.getPlayer (id).isRemote; }
  // getPlayerIds () { return this.get (s => s.players.ids); }
  // getPlayerMap () { return this.get (s => s.players.map); }
  // getNumberOfPlayers (): number { return this.getPlayers ().length; }
  // getLandCoordinates (): BritLandCoordinates[] {
  //   return this.get (s => s.lands.coordinates);
  // } // getLandCoordinates
  // getLand (land: BritLandCoordinates) { return this.get (s => s.lands.map[landCoordinatesToId (land)]); }
  // getLands (): BritLand[] {
  //   const map = this.get (s => s.lands.map);
  //   const coordinates = this.get (s => s.lands.coordinates);
  //   return coordinates.map (coordinate => map[landCoordinatesToId (coordinate)]);
  // } // getLandTiles
  // getLandOrNull (land: BritLandCoordinates): BritLand | null { return this.getLand (land) || null; }

  // private selectLandTileMap$ () { return this.select$ (s => s.lands.map); }
  // private selectLandTileKeys$ () { return this.select$ (s => s.lands.coordinates); }
  // selectLands$ (): Observable<BritLand[]> {
  //   return this.select$ (
  //     this.selectLandTileMap$ (),
  //     this.selectLandTileKeys$ (),
  //     (map, keys) => keys.map (k => map[landCoordinatesToId (k)])
  //   );
  // } // selectLandTiles$
  // selectPlayerIds$ () { return this.select$ (s => s.players.ids); }
  // selectPlayerMap$ () { return this.select$ (s => s.players.map); }
  // selectLogs$ () { return this.select$ (s => s.logs); }

  // private updatePlayer (playerId: string, updater: (p: BritPlayer) => BritPlayer) {
  //   this.update (s => ({
  //     ...s,
  //     players: {
  //       ...s.players,
  //       map: {
  //         ...s.players.map,
  //         [playerId]: updater (s.players.map[playerId])
  //       }
  //     }
  //   }));
  // } // updatePlayer

  // private updateGameBox (updater: (gameBox: BritGameBox) => BritGameBox) {
  //   this.update (s => ({
  //     ...s,
  //     gameBox: updater (s.gameBox)
  //   }));
  // } // updateGameBox

  // private updateLand (land: BritLandCoordinates, updater: (lt: BritLand) => BritLand) {
  //   const key = landCoordinatesToId (land);
  //   this.update (s => ({
  //     ...s,
  //     lands: {
  //       ...s.lands,
  //       map: {
  //         ...s.lands.map,
  //         [key]: updater (s.lands.map[key])
  //       }
  //     }
  //   }));
  // } // updatePlayer

  // private addPawnToPlayer (pawnType: BritPawnType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     pawns: {
  //       ...p.pawns,
  //       [pawnType]: p.pawns[pawnType] + 1
  //     }
  //   }));
  // } // addPawnToPlayer

  // private removePawnFromPlayer (pawnType: BritPawnType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     pawns: {
  //       ...p.pawns,
  //       [pawnType]: p.pawns[pawnType] - 1
  //     }
  //   }));
  // } // removePawnFromPlayer

  // private addPawnToLandTile (pawnType: BritPawnType, pawnColor: BritColor, land: BritLandCoordinates) {
  //   this.updateLand (land, lt => ({
  //     ...lt,
  //     pawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], lt.pawns)
  //   }));
  // } // addPawnToLandTile
  
  // private removePawnFromLandTile (pawnType: BritPawnType, pawnColor: BritColor, land: BritLandCoordinates) {
  //   this.updateLand (land, lt => ({
  //     ...lt,
  //     pawns: immutableUtil.listRemoveFirst (p => p.type === pawnType && p.color === pawnColor, lt.pawns)
  //   }));
  // } // removePawnFromLandTile

  // private addResourceToPlayer (resource: BritResourceType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     resources: {
  //       ...p.resources,
  //       [resource]: p.resources[resource] + 1
  //     }
  //   }));
  // } // addResourceToPlayer

  // private removeResourceFromPlayer (resource: BritResourceType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     resources: {
  //       ...p.resources,
  //       [resource]: p.resources[resource] - 1
  //     }
  //   }));
  // } // addResourceToPlayer

  // private getResourceFromLand (landCoordinates: BritLandCoordinates): BritResourceType {
  //   const land = this.getLand (landCoordinates);
  //   return land?.type as BritResourceType;
  // } // getResourceFromLand

  // private addVictoryPoints (victoryPoints: number, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     score: p.score + victoryPoints
  //   }));
  // } // addVictoryPoints

  // private addPawnToGameBox (pawnType: BritPawnType, pawnColor: BritColor) {
  //   this.updateGameBox (gameBox => ({
  //     ...gameBox,
  //     removedPawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], gameBox.removedPawns)
  //   }));
  // } // addPawnToGameBox

  // private addLog (log: BritLog) {
  //   this.update (s => ({
  //     ...s,
  //     logs: [...s.logs, log]
  //   }));
  // } // addLog

  // applySetup (land: BritLandCoordinates, player: string) {
  //   const playerColor = this.getPlayer (player).color;
  //   this.removePawnFromPlayer ("knight", player);
  //   this.addPawnToLandTile ("knight", playerColor, land);
  //   this.removePawnFromPlayer ("city", player);
  //   this.addPawnToLandTile ("city", playerColor, land);
  // } // applySetup

  // applyRecruitment (land: BritLandCoordinates, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromPlayer ("knight", player.id);
  //   this.addPawnToLandTile ("knight", player.color, land);
  // } // applyRecruitment

  // applyMovement (movement: BritMovement, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromLandTile ("knight", player.color, movement.fromLand);
  //   this.addPawnToLandTile ("knight", player.color, movement.toLand);
  //   if (movement.conflict) {
  //     const land = this.getLand (movement.toLand);
  //     let villagePlayer: BritPlayer | null = null;
  //     land.pawns
  //     .filter (pawn => pawn.color !== player.color)
  //     .forEach (pawn => {
  //       const pawnPlayer = this.getPlayers ().find (p => p.color === pawn.color) as BritPlayer;
  //       this.removePawnFromLandTile (pawn.type, pawn.color, land.coordinates);
  //       this.addPawnToPlayer (pawn.type, pawnPlayer.id);
  //       if (pawn.type === "village") {
  //         villagePlayer = pawnPlayer;
  //       } // if
  //     });
  //     if (villagePlayer && movement.gainedResource) {
  //       this.removeResourceFromPlayer (movement.gainedResource, (villagePlayer as BritPlayer).id);
  //       this.addResourceToPlayer (movement.gainedResource, playerId);
  //     } // if
  //   } // if
  // } // applyMovement

  // applyConstruction (construction: BritConstruction, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromLandTile ("knight", player.color, construction.land);
  //   this.removePawnFromPlayer (construction.building, player.id);
  //   this.addPawnToLandTile (construction.building, player.color, construction.land);
  //   this.addPawnToPlayer ("knight", player.id);
  //   const resource = this.getResourceFromLand (construction.land);
  //   this.addResourceToPlayer (resource, player.id);
  // } // applyConstruction
  
  // applyNewCity (land: BritLandCoordinates, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromLandTile ("village", player.color, land);
  //   this.addPawnToLandTile ("city", player.color, land);
  //   this.addPawnToPlayer ("village", playerId);
  //   this.removePawnFromPlayer ("city", playerId);
  //   this.addVictoryPoints (10, playerId);
  // } // applyNewCity

  // applyExpedition (land: BritLandCoordinates, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromPlayer ("knight", playerId);
  //   this.addPawnToLandTile ("knight", player.color, land);
  //   this.removePawnFromPlayer ("knight", playerId);
  //   this.addPawnToGameBox ("knight", player.color);
  // } // applyExpedition

  // discardResource (resource: BritResourceType, playerId: string) {
  //   this.removeResourceFromPlayer (resource, playerId);
  // } // discardResource

  // applyNobleTitle (resources: BritResourceType[], playerId: string) {
  //   resources.forEach (resource => this.discardResource (resource, playerId));
  //   this.addVictoryPoints (15, playerId);
  // } // applyNobleTitle

  // logMovement (movement: BritMovement, player: string) { this.addLog ({ type: "movement", movement: movement, player: player }); }
  // logExpedition (land: BritLandCoordinates, player: string) { this.addLog ({ type: "expedition", land: land, player: player }); }
  // logNobleTitle (resources: BritResourceType[], player: string) { this.addLog ({ type: "nobleTitle", resources: resources, player: player }); }
  // logNewCity (land: BritLandCoordinates, player: string) { this.addLog ({ type: "newCity", land: land, player: player }); }
  // logConstruction (construction: BritConstruction, player: string) { this.addLog ({ type: "construction", construction: construction, player: player }); }
  // logRecuitment (land: BritLandCoordinates, player: string) { this.addLog ({ type: "recruitment", land: land, player: player }); }
  // logTurn (player: string) { this.addLog ({ type: "turn", player: player }); }
  // logSetupPlacement (land: BritLandCoordinates, player: string) { this.addLog ({ type: "setupPlacement", land: land, player: player }); }
  // logSetup () { this.addLog ({ type: "setup" }); }

} // BritGameStore
