import { Injectable } from "@angular/core";
import { BgUser } from "@bg-services";
import { arrayUtil, BgStore, immutableUtil } from "@bg-utils";
import { BRIT_AREAS } from "../brit-constants";
import { BritArea, BritAreaId, BritLog, BritNation, BritNationId, BritPlayer, BritUnit, BritUnitId } from "../brit-models";

interface BritGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: Record<string, BritPlayer>,
    ids: string[]
  };
  areas: Record<BritAreaId, BritArea>;
  nations: Record<BritNationId, BritNation>;
  units: Record<BritUnitId, BritUnit>;
  logs: BritLog[];
} // BritGameState

@Injectable ()
export class BritGameStore extends BgStore<BritGameState> {

  constructor () {
    super ({
      gameId: "",
      gameOwner: null as any,
      players: null as any,
      areas: null as any,
      nations: null as any,
      units: null as any,
      logs: []
    }, "Britannia Game");
  } // constructor

  setInitialState (
    players: BritPlayer[],
    nations: BritNation[],
    areas: BritArea[],
    units: BritUnit[],
    gameId: string,
    gameOwner: BgUser
  ) {
    this.update ("Initial state", s => ({
      ...s,
      gameId: gameId,
      gameOwner: gameOwner,
      players: {
        map: arrayUtil.toMap (players, p => p.id),
        ids: players.map (p => p.id)
      },
      areas: arrayUtil.toMap (areas, a => a.id) as Record<BritAreaId, BritArea>,
      nations: arrayUtil.toMap (nations, n => n.id) as Record<BritNationId, BritNation>,
      units: arrayUtil.toMap (units, u => u.id)
    }));
  } // setInitialState

  private notTemporaryState: BritGameState | null = null;
  isTemporaryState () { return !!this.notTemporaryState; }
  startTemporaryState () {
    this.notTemporaryState = this.get ();
  } // startTemporaryState
  endTemporaryState () {
    if (this.notTemporaryState) {
      const state = this.notTemporaryState;
      this.update ("End temporary state", s => ({ ...state }));
      this.notTemporaryState = null;
    } else {
      throw new Error ("endTemporaryState without startTemporaryState");
    } // if - else
  } // endTemporaryState

  selectAreas$ () {
    return this.select$ (this.select$ (s => s.areas), areas => {
      return areas ? BRIT_AREAS.map (id => areas[id]) : [];
    });
  } // selectAreas$

  selectUnitsMap$ () { return this.select$ (s => s.units); }

  selectPlayers$ () {
    return this.select$ (this.select$ (s => s.players), players => {
      return players ? players.ids.map (id => players.map[id]) : [];
    });
  } // selectPlayers$

  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): BritPlayer[] { return this.get (s => s.players.ids.map (id => s.players.map[id])); }
  getPlayer (id: string): BritPlayer { return this.get (s => s.players.map[id]); }
  // // isLocalPlayer (id: string): boolean { return !this.getPlayer (id).isAi && !this.getPlayer (id).isRemote; }
  // getPlayerIds () { return this.get (s => s.players.ids); }
  // getPlayerMap () { return this.get (s => s.players.map); }
  // getNumberOfPlayers (): number { return this.getPlayers ().length; }
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

  private updatePlayer (playerId: string, updater: (p: BritPlayer) => BritPlayer, s: BritGameState) {
    return {
      ...s,
      players: {
        ...s.players,
        map: {
          ...s.players.map,
          [playerId]: updater (s.players.map[playerId])
        }
      }
    };
  } // updatePlayer

  private updateArea (areaId: BritAreaId, updater: (a: BritArea) => BritArea, s: BritGameState) {
    return {
      ...s,
      areas: {
        ...s.areas,
        [areaId]: updater (s.areas[areaId])
      }
    };
  } // updateArea

  private updateNation (nationId: BritNationId, updater: (a: BritNation) => BritNation, s: BritGameState) {
    return {
      ...s,
      nations: {
        ...s.nations,
        [nationId]: updater (s.nations[nationId])
      }
    };
  } // updateNation

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
  
  addUnitToArea (unitId: BritUnitId, areaId: BritAreaId, s: BritGameState): BritGameState {
    return this.updateArea (areaId, area => ({
      ...area,
      units: immutableUtil.listPush ([unitId], area.units)
    }), s);
  } // addUnitToArea

  private removeInfantryFromNation (nationId: BritNationId, s: BritGameState): [BritUnitId, BritGameState] {
    const unitId = s.nations[nationId].infantries[0];
    return [
      unitId,
      this.updateNation (nationId, n => ({
        ...n,
        infantries: immutableUtil.listRemoveByIndex (0, n.infantries)
      }), s)
    ];
  } // removeInfantryFromNation

  applySetup (setup: Record<BritAreaId, [BritNationId, number] | BritNationId | null | null>) {
    this.update ("Setup", s =>
      BRIT_AREAS.reduce ((state, areaId) => {
        const areaSetup = setup[areaId];
        if (areaSetup) {
          const [nationId, nInfantries] = typeof areaSetup === "string" ? [areaSetup, 1] : [areaSetup[0], areaSetup[1]];
          for (let i = 0; i < nInfantries; i++) {
            let [infantryId, newState] = this.removeInfantryFromNation (nationId, state);
            state = this.addUnitToArea (infantryId, areaId, newState);
          } // for
        } // if
        return state;
      }, s)
    );
  } // applySetup


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
