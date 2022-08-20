import { Injectable } from "@angular/core";
import { BgUser } from "@bg-services";
import { arrayUtil, BgStore, immutableUtil } from "@bg-utils";
import { BritAreaId, BritLandAreaId, BritNationId, BritPhase, BritPopulation, BritRoundId, BritUnitId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritAreaState, BritGameState, BritLog, BritNationState, BritPlayer, BritSetup } from "../brit-game-state.models";

@Injectable ()
export class BritGameStore extends BgStore<BritGameState> {

  constructor (
    private components: BritComponentsService
  ) {
    super ({
      gameId: "",
      gameOwner: null as any,
      players: { map: { }, ids: [] },
      areas: components.areasToMap (areaId => ({ unitIds: [] })),
      nations: components.nationsToMap (nationId => {
        const nation = components.NATION[nationId];
        return {
          active: false,
          population: null,
          infantryIds: [...nation.infantryIds],
          cavalryIds: [...nation.cavalryIds],
          buildingIds: [...nation.buildingIds],
          leaderIds: [...nation.leaderIds],
        };
      }),
      logs: []
    }, "Britannia Game");
  } // constructor

  initGameState (
    players: BritPlayer[],
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
      }
    }));
  } // initGameState

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

  selectAreas$ () { return this.select$ (s => s.areas); }
  selectNations$ () { return this.select$ (s => s.nations); }

  selectPlayerMap$ () { return this.select$ (s => s.players.map); }

  selectPlayers$ () {
    return this.select$ (this.select$ (s => s.players), players => {
      return players ? players.ids.map (id => players.map[id]) : [];
    });
  } // selectPlayers$

  selectLogs$ () { return this.select$ (s => s.logs); }

  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): BritPlayer[] { return this.get (s => s.players.ids.map (id => s.players.map[id])); }
  getPlayer (id: string): BritPlayer { return this.get (s => s.players.map[id]); }
  getNation (nationId: BritNationId): BritNationState { return this.get (s => s.nations[nationId]); }
  getArea (areaId: BritAreaId): BritAreaState { return this.get (s => s.areas[areaId]); }

  getPlayerByNation (nationId: BritNationId) {
    return this.getPlayers ().find (p => p.nationIds.some (n => n === nationId));
  } // getPlayerByNation

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

  private updatePlayer (playerId: string, updater: (p: BritPlayer) => BritPlayer, s: BritGameState): BritGameState {
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

  private updateArea (areaId: BritAreaId, updater: (a: BritAreaState) => BritAreaState, s: BritGameState): BritGameState {
    return {
      ...s,
      areas: {
        ...s.areas,
        [areaId]: updater (s.areas[areaId])
      }
    };
  } // updateArea

  private updateNation (nationId: BritNationId, updater: (a: BritNationState) => BritNationState, s: BritGameState): BritGameState {
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

  private addLog (log: BritLog) {
    this.update ("Add log", s => ({
      ...s,
      logs: [...s.logs, log]
    }));
  } // addLog

  private setNationPopulation (population: BritPopulation | null, nationId: BritNationId, s: BritGameState): BritGameState {
    return this.updateNation (nationId, nation => ({
      ...nation,
      population: population
    }), s);
  } // setNationPopulation

  private setNationActive (active: boolean, nationId: BritNationId, s: BritGameState): BritGameState {
    return this.updateNation (nationId, nation => ({
      ...nation,
      active: active
    }), s);
  } // setNationActive

  private addUnitToArea (unitId: BritUnitId, areaId: BritAreaId, s: BritGameState): BritGameState {
    return this.updateArea (areaId, area => ({
      ...area,
      unitIds: immutableUtil.listPush ([unitId], area.unitIds)
    }), s);
  } // addUnitToArea

  private removeInfantryFromNation (nationId: BritNationId, s: BritGameState): [BritUnitId, BritGameState] {
    const unitId = s.nations[nationId].infantryIds[0];
    return [
      unitId,
      this.updateNation (nationId, n => ({
        ...n,
        infantryIds: immutableUtil.listRemoveByIndex (0, n.infantryIds)
      }), s)
    ];
  } // removeInfantryFromNation

  applySetup (setup: BritSetup) {
    this.update ("Setup", s => {
      return this.components.AREA_IDS.reduce ((state, areaId) => {
        const areaSetup = setup.areas[areaId];
        if (areaSetup) {
          const [nationId, nInfantries] = typeof areaSetup === "string" ? [areaSetup, 1] : [areaSetup[0], areaSetup[1]];
          for (let i = 0; i < nInfantries; i++) {
            let [infantryId, newState] = this.removeInfantryFromNation (nationId, state);
            state = this.addUnitToArea (infantryId, areaId, newState);
          } // for
        } // if
        setup.populationMarkers.forEach (nationId => {
          state = this.setNationPopulation (0, nationId, state);
        });
        setup.activeNations.forEach (nationId => {
          state = this.setNationActive (true, nationId, state);
        });
        return state;
      }, s)
    });
  } // applySetup

  private placeInfantry (areaId: BritAreaId, nationId: BritNationId, s: BritGameState): BritGameState {
    const unitId = s.nations[nationId].infantryIds[0];
    s = this.updateNation (nationId, n => ({
      ...n,
      infantryIds: immutableUtil.listRemoveByIndex (0, n.infantryIds)
    }), s);
    s = this.updateArea (areaId, a => ({
      ...a,
      unitIds: immutableUtil.listPush ([unitId], a.unitIds)
    }), s);
    return s;
  } // placeInfantry

  applyInfantryPlacement (areaId: BritAreaId, nationId: BritNationId) {
    this.update ("Apply infantry placement", s => this.placeInfantry (areaId, nationId, s));
  } // applyInfantryPlacement

  applyPopulationIncrease (population: BritPopulation | null, infantryPlacement: { areaId: BritAreaId, quantity: number }[], nationId: BritNationId) {
    this.update ("Apply population increase", s => {
      s = this.setNationPopulation (population, nationId, s);
      for (const ip of infantryPlacement) {
        for (let i = 0; i < ip.quantity; i++) {
          s = this.placeInfantry (ip.areaId, nationId, s);
        } // for
      } // for
      return s;
    });
  } // applyPopulationIncrease

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

  logSetup () { this.addLog ({ type: "setup" }); }
  logRound (roundId: BritRoundId) { this.addLog ({ type: "round", roundId: roundId }); }
  logNationTurn (nationId: BritNationId) { this.addLog ({ type: "nation-turn", nationId: nationId }); }
  logPhase (phase: BritPhase) { this.addLog ({ type: "phase", phase: phase }); }
  logPopulationMarkerSet (populationMarker: number | null) { this.addLog ({ type: "population-marker-set", populationMarker }); }
  logInfantryPlacement (landId: BritLandAreaId, quantity: number) { this.addLog ({ type: "infantry-placement", landId, quantity }); }
  logInfantryReinforcements (areaId: BritAreaId, quantity: number) { this.addLog ({ type: "infantry-reinforcement", areaId, quantity }); }
  // logMovement (movement: BritMovement, player: string) { this.addLog ({ type: "movement", movement: movement, player: player }); }
  // logExpedition (land: BritLandCoordinates, player: string) { this.addLog ({ type: "expedition", land: land, player: player }); }
  // logNobleTitle (resources: BritResourceType[], player: string) { this.addLog ({ type: "nobleTitle", resources: resources, player: player }); }
  // logNewCity (land: BritLandCoordinates, player: string) { this.addLog ({ type: "newCity", land: land, player: player }); }
  // logConstruction (construction: BritConstruction, player: string) { this.addLog ({ type: "construction", construction: construction, player: player }); }
  // logRecuitment (land: BritLandCoordinates, player: string) { this.addLog ({ type: "recruitment", land: land, player: player }); }
  // logSetupPlacement (land: BritLandCoordinates, player: string) { this.addLog ({ type: "setupPlacement", land: land, player: player }); }

} // BritGameStore
