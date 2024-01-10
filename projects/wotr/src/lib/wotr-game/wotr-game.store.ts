import { Injectable } from "@angular/core";
import { BgUser } from "@leobg/commons";
import { BgStore, arrayUtil } from "@leobg/commons/utils";
import { WotrNationId, WotrRegionId } from "../wotr-components.models";
import { WotrComponentsService } from "../wotr-components.service";
import { WotrGameState, WotrNationState, WotrPlayer, WotrRegionState } from "../wotr-game-state.models";

@Injectable ()
export class WotrGameStore extends BgStore<WotrGameState> {

  constructor (components: WotrComponentsService) {
    
    // const map: Record<BritNationId, V> = {} as any;
    // this.NATION_IDS.forEach ((nationId) => (map[nationId] = getValue (nationId)));
    // return map;
    
    super ({
      gameId: "",
      gameOwner: null as any,
      players: { map: {}, ids: [] },
      regions: components.regionsToMap ((regionId) => ({ units: [] })),
      nations: components.nationsToMap ((nationId) => {
        const nation = components.NATION[nationId];
        const nationState: WotrNationState = {
          reinforcements: { regular: nation.nRegulars, elite: nation.nElites },
          eliminated: { regular: 0, elite: 0 },
          active: false,
          politicalTrack: 3
        };
        return nationState;
      }),
      logs: [],
    }, "War of the Ring Game");
  } // constructor

  initGameState (players: WotrPlayer[], gameId: string, gameOwner: BgUser) {
    this.update ("Initial state", (s) => ({
      ...s,
      gameId: gameId,
      gameOwner: gameOwner,
      players: {
        map: arrayUtil.toMap (players, (p) => p.id),
        ids: players.map ((p) => p.id),
      },
    }));
  } // initGameState

  private notTemporaryState: WotrGameState | null = null;
  isTemporaryState () { return !!this.notTemporaryState; }
  startTemporaryState () { this.notTemporaryState = this.get (); }
  endTemporaryState () {
    if (this.notTemporaryState) {
      const state = this.notTemporaryState;
      this.update ("End temporary state", (s) => ({ ...state }));
      this.notTemporaryState = null;
    } else {
      throw new Error ("endTemporaryState without startTemporaryState");
    } // if - else
  } // endTemporaryState

  selectRegions$ () { return this.select$ ((s) => s.regions); }
  selectNations$ () { return this.select$ ((s) => s.nations); }
  selectPlayerMap$ () { return this.select$ ((s) => s.players.map); }
  selectPlayers$ () {
    return this.select$ (
      this.select$ ((s) => s.players),
      (players) => players ? players.ids.map ((id) => players.map[id]) : []
    );
  } // selectPlayers$
  selectLogs$ () { return this.select$ ((s) => s.logs); }

  getGameId (): string { return this.get ((s) => s.gameId); }
  getGameOwner (): BgUser { return this.get ((s) => s.gameOwner); }
  getPlayers (): WotrPlayer[] { return this.get ((s) => s.players.ids.map ((id) => s.players.map[id])); }
  getPlayer (id: string): WotrPlayer { return this.get ((s) => s.players.map[id]); }
  getNation (nationId: WotrNationId): WotrNationState { return this.get ((s) => s.nations[nationId]); }
  getRegion (regionId: WotrRegionId): WotrRegionState { return this.get ((s) => s.regions[regionId]); }

  // // // isLocalPlayer (id: string): boolean { return !this.getPlayer (id).isAi && !this.getPlayer (id).isRemote; }
  // // getPlayerIds () { return this.get (s => s.players.ids); }
  // // getPlayerMap () { return this.get (s => s.players.map); }
  // // getNumberOfPlayers (): number { return this.getPlayers ().length; }
  // // getLand (land: WotrLandCoordinates) { return this.get (s => s.lands.map[landCoordinatesToId (land)]); }
  // // getLands (): WotrLand[] {
  // //   const map = this.get (s => s.lands.map);
  // //   const coordinates = this.get (s => s.lands.coordinates);
  // //   return coordinates.map (coordinate => map[landCoordinatesToId (coordinate)]);
  // // } // getLandTiles
  // // getLandOrNull (land: WotrLandCoordinates): WotrLand | null { return this.getLand (land) || null; }

  // // private selectLandTileMap$ () { return this.select$ (s => s.lands.map); }
  // // private selectLandTileKeys$ () { return this.select$ (s => s.lands.coordinates); }
  // // selectLands$ (): Observable<WotrLand[]> {
  // //   return this.select$ (
  // //     this.selectLandTileMap$ (),
  // //     this.selectLandTileKeys$ (),
  // //     (map, keys) => keys.map (k => map[landCoordinatesToId (k)])
  // //   );
  // // } // selectLandTiles$
  // // selectPlayerIds$ () { return this.select$ (s => s.players.ids); }
  // // selectPlayerMap$ () { return this.select$ (s => s.players.map); }
  // // selectLogs$ () { return this.select$ (s => s.logs); }

  // private updatePlayer (
  //   playerId: string,
  //   updater: (p: WotrPlayer) => WotrPlayer,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return {
  //     ...s,
  //     players: {
  //       ...s.players,
  //       map: {
  //         ...s.players.map,
  //         [playerId]: updater (s.players.map[playerId]),
  //       },
  //     },
  //   };
  // } // updatePlayer

  // private updateRegion (
  //   regionId: WotrRegionId,
  //   updater: (a: WotrRegionState) => WotrRegionState,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return {
  //     ...s,
  //     regions: {
  //       ...s.regions,
  //       [regionId]: updater (s.regions[regionId]),
  //     },
  //   };
  // } // updateRegion

  // private updateNation (
  //   nationId: WotrNationId,
  //   updater: (a: WotrNationState) => WotrNationState,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return {
  //     ...s,
  //     nations: {
  //       ...s.nations,
  //       [nationId]: updater (s.nations[nationId]),
  //     },
  //   };
  // } // updateNation

  // // private addPawnToPlayer (pawnType: WotrPawnType, playerId: string) {
  // //   this.updatePlayer (playerId, p => ({
  // //     ...p,
  // //     pawns: {
  // //       ...p.pawns,
  // //       [pawnType]: p.pawns[pawnType] + 1
  // //     }
  // //   }));
  // // } // addPawnToPlayer

  // // private removePawnFromPlayer (pawnType: WotrPawnType, playerId: string) {
  // //   this.updatePlayer (playerId, p => ({
  // //     ...p,
  // //     pawns: {
  // //       ...p.pawns,
  // //       [pawnType]: p.pawns[pawnType] - 1
  // //     }
  // //   }));
  // // } // removePawnFromPlayer

  // // private addPawnToLandTile (pawnType: WotrPawnType, pawnColor: WotrColor, land: WotrLandCoordinates) {
  // //   this.updateLand (land, lt => ({
  // //     ...lt,
  // //     pawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], lt.pawns)
  // //   }));
  // // } // addPawnToLandTile

  // // private removePawnFromLandTile (pawnType: WotrPawnType, pawnColor: WotrColor, land: WotrLandCoordinates) {
  // //   this.updateLand (land, lt => ({
  // //     ...lt,
  // //     pawns: immutableUtil.listRemoveFirst (p => p.type === pawnType && p.color === pawnColor, lt.pawns)
  // //   }));
  // // } // removePawnFromLandTile

  // // private addResourceToPlayer (resource: WotrResourceType, playerId: string) {
  // //   this.updatePlayer (playerId, p => ({
  // //     ...p,
  // //     resources: {
  // //       ...p.resources,
  // //       [resource]: p.resources[resource] + 1
  // //     }
  // //   }));
  // // } // addResourceToPlayer

  // // private removeResourceFromPlayer (resource: WotrResourceType, playerId: string) {
  // //   this.updatePlayer (playerId, p => ({
  // //     ...p,
  // //     resources: {
  // //       ...p.resources,
  // //       [resource]: p.resources[resource] - 1
  // //     }
  // //   }));
  // // } // addResourceToPlayer

  // // private getResourceFromLand (landCoordinates: WotrLandCoordinates): WotrResourceType {
  // //   const land = this.getLand (landCoordinates);
  // //   return land?.type as WotrResourceType;
  // // } // getResourceFromLand

  // // private addVictoryPoints (victoryPoints: number, playerId: string) {
  // //   this.updatePlayer (playerId, p => ({
  // //     ...p,
  // //     score: p.score + victoryPoints
  // //   }));
  // // } // addVictoryPoints

  // // private addPawnToGameBox (pawnType: WotrPawnType, pawnColor: WotrColor) {
  // //   this.updateGameBox (gameBox => ({
  // //     ...gameBox,
  // //     removedPawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], gameBox.removedPawns)
  // //   }));
  // // } // addPawnToGameBox

  // private addLog (log: WotrLog) {
  //   this.update ("Add log", (s) => ({
  //     ...s,
  //     logs: [...s.logs, log],
  //   }));
  // } // addLog

  // private setNationPopulation (
  //   population: WotrPopulation | null,
  //   nationId: WotrNationId,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateNation (
  //     nationId,
  //     (nation) => ({
  //       ...nation,
  //       population: population,
  //     }),
  //     s
  //   );
  // } // setNationPopulation

  // private setNationActive (
  //   active: boolean,
  //   nationId: WotrNationId,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateNation (
  //     nationId,
  //     (nation) => ({
  //       ...nation,
  //       active: active,
  //     }),
  //     s
  //   );
  // } // setNationActive

  // private addUnitsToRegion (
  //   unitType: Exclude<WotrUnitType, "leader">,
  //   nationId: WotrNationId,
  //   regionId: WotrRegionId,
  //   quantity: number,
  //   nMovements: number,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateRegion (
  //     regionId,
  //     (region) => {
  //       const index = region.units.findIndex (
  //         (u) =>
  //           u.type === unitType &&
  //           u.nationId === nationId &&
  //           u.nMovements === nMovements
  //       );
  //       if (index >= 0) {
  //         const unit = region.units[index];
  //         if (unit.type === "leader") {
  //           return region;
  //         }
  //         return {
  //           ...region,
  //           units: immutableUtil.listReplaceByIndex (
  //             index,
  //             { ...unit, quantity: unit.quantity + quantity },
  //             region.units
  //           ),
  //         };
  //       } else {
  //         return {
  //           ...region,
  //           units: immutableUtil.listPush (
  //             [
  //               {
  //                 type: unitType,
  //                 nationId: nationId,
  //                 quantity: quantity,
  //                 regionId,
  //                 nMovements,
  //               },
  //             ],
  //             region.units
  //           ),
  //         };
  //       } // if - else
  //     },
  //     s
  //   );
  // } // addUnitsToRegion

  // private removeUnitsFromRegionByIndex (
  //   unitIndex: number,
  //   regionId: WotrRegionId,
  //   quantity: number,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateRegion (
  //     regionId,
  //     (region) => {
  //       const unit = region.units[unitIndex];
  //       if (unit.type === "leader") {
  //         return region;
  //       }
  //       if (unit.quantity <= quantity) {
  //         return {
  //           ...region,
  //           units: immutableUtil.listRemoveByIndex (unitIndex, region.units),
  //         };
  //       } else {
  //         return {
  //           ...region,
  //           units: immutableUtil.listReplaceByIndex (
  //             unitIndex,
  //             { ...unit, quantity: unit.quantity - quantity },
  //             region.units
  //           ),
  //         };
  //       } // if - else
  //     },
  //     s
  //   );
  // } // removeUnitsFromRegionByIndex

  // private addLeaderToRegion (
  //   leaderId: WotrLeaderId,
  //   nationId: WotrNationId,
  //   regionId: WotrRegionId,
  //   nMovements: number,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateRegion (
  //     regionId,
  //     (region) => ({
  //       ...region,
  //       units: immutableUtil.listPush (
  //         [
  //           {
  //             type: "leader",
  //             nationId: nationId,
  //             leaderId,
  //             regionId,
  //             nMovements,
  //           },
  //         ],
  //         region.units
  //       ),
  //     }),
  //     s
  //   );
  // } // addLeaderToRegion

  // private findRegionLeaderIndex (
  //   leader: WotrRegionLeader,
  //   regionId: WotrRegionId,
  //   s: WotrGameState
  // ): number {
  //   return s.regions[regionId].units.findIndex (
  //     (u) => u.type === "leader" && u.leaderId === leader.leaderId
  //   );
  // } // findRegionLeaderIndex

  // private findRegionUnitIndex (
  //   unit: Exclude<WotrRegionUnit, WotrRegionLeader>,
  //   regionId: WotrRegionId,
  //   s: WotrGameState
  // ): number {
  //   return s.regions[regionId].units.findIndex (
  //     (u) =>
  //       u.type === unit.type &&
  //       u.nationId === unit.nationId &&
  //       u.nMovements === unit.nMovements
  //   );
  // } // findRegionUnitIndex

  // private removeUnitFromRegionByIndex (
  //   unitIndex: number,
  //   regionId: WotrRegionId,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateRegion (
  //     regionId,
  //     (region) => ({
  //       ...region,
  //       units: immutableUtil.listRemoveByIndex (unitIndex, region.units),
  //     }),
  //     s
  //   );
  // } // removeUnitFromRegionByIndex

  // private removeUnitsFromNation (
  //   unitType: Exclude<WotrUnitType, "leader">,
  //   nationId: WotrNationId,
  //   quantity: number,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateNation (
  //     nationId,
  //     (n) => {
  //       switch (unitType) {
  //         case "infantry":
  //           return { ...n, nInfantries: n.nInfantries - quantity };
  //         case "cavalry":
  //           return { ...n, nCavalries: n.nCavalries - quantity };
  //         case "saxon-buhr":
  //         case "roman-fort":
  //           return { ...n, nBuildings: n.nBuildings - quantity };
  //       } // switch
  //     },
  //     s
  //   );
  // } // removeUnitsFromNation

  // private removeLeaderFromNation (
  //   leaderId: WotrLeaderId,
  //   nationId: WotrNationId,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateNation (
  //     nationId,
  //     (n) => ({
  //       ...n,
  //       leaderIds: immutableUtil.listRemoveFirst (
  //         (l) => l === leaderId,
  //         n.leaderIds
  //       ),
  //     }),
  //     s
  //   );
  // } // removeUnitFromNation

  // applySetup (setup: WotrSetup) {
  //   this.update ("Setup", (s) => {
  //     return this.components.REGION_IDS.reduce ((state, regionId) => {
  //       const regionSetup = setup.regions[regionId];
  //       if (regionSetup) {
  //         const [nationId, nInfantries] =
  //           typeof regionSetup === "string"
  //             ? [regionSetup, 1]
  //             : [regionSetup[0], regionSetup[1]];
  //         state = this.removeUnitsFromNation (
  //           "infantry",
  //           nationId,
  //           nInfantries,
  //           state
  //         );
  //         state = this.addUnitsToRegion (
  //           "infantry",
  //           nationId,
  //           regionId,
  //           nInfantries,
  //           0,
  //           state
  //         );
  //       } // if
  //       setup.populationMarkers.forEach ((nationId) => {
  //         state = this.setNationPopulation (0, nationId, state);
  //       });
  //       setup.activeNations.forEach ((nationId) => {
  //         state = this.setNationActive (true, nationId, state);
  //       });
  //       return state;
  //     }, s);
  //   });
  // } // applySetup

  // private placeInfantry (
  //   regionId: WotrRegionId,
  //   nationId: WotrNationId,
  //   s: WotrGameState
  // ): WotrGameState {
  //   s = this.removeUnitsFromNation ("infantry", nationId, 1, s);
  //   s = this.addUnitsToRegion ("infantry", nationId, regionId, 1, 0, s);
  //   return s;
  // } // placeInfantry

  // applyInfantryPlacement (regionId: WotrRegionId, nationId: WotrNationId) {
  //   this.update ("Apply infantry placement", (s) =>
  //     this.placeInfantry (regionId, nationId, s)
  //   );
  // } // applyInfantryPlacement

  // applyPopulationIncrease (
  //   population: WotrPopulation | null,
  //   infantryPlacement: { regionId: WotrRegionId; quantity: number }[],
  //   nationId: WotrNationId
  // ) {
  //   this.update ("Apply population increase", (s) => {
  //     s = this.setNationPopulation (population, nationId, s);
  //     for (const ip of infantryPlacement) {
  //       for (let i = 0; i < ip.quantity; i++) {
  //         s = this.placeInfantry (ip.regionId, nationId, s);
  //       } // for
  //     } // for
  //     return s;
  //   });
  // } // applyPopulationIncrease

  // applyArmyMovements (
  //   armyMovements: WotrArmyMovements,
  //   doCountMovements: boolean
  // ) {
  //   this.update ("Apply army movements", (s) => {
  //     for (const movement of armyMovements.movements) {
  //       s = this.armyMovement (movement, doCountMovements, s);
  //     } // for
  //     for (const movement of armyMovements.movements) {
  //       s = this.resetRegionNMovements (movement.toRegionId, s);
  //     } // for
  //     return s;
  //   });
  // } // applyArmyMovements

  // private resetRegionNMovements (
  //   regionId: WotrRegionId,
  //   s: WotrGameState
  // ): WotrGameState {
  //   return this.updateRegion (
  //     regionId,
  //     (region) => {
  //       const newUnits: WotrRegionUnit[] = [];
  //       for (const unit of region.units) {
  //         if (unit.type === "leader") {
  //           newUnits.push ({ ...unit, nMovements: 0 });
  //         } else {
  //           const newIndex = newUnits.findIndex (
  //             (u) => u.type === unit.type && u.nationId === unit.nationId
  //           );
  //           if (newIndex >= 0) {
  //             const newUnit = newUnits[newIndex];
  //             if (newUnit.type === "leader") {
  //               throw "Unexpected";
  //             }
  //             newUnit.quantity += unit.quantity;
  //           } else {
  //             newUnits.push ({ ...unit, nMovements: 0 });
  //           } // if - else
  //         } // if - else
  //       } // for
  //       return {
  //         ...region,
  //         units: newUnits,
  //       };
  //     },
  //     s
  //   );
  // } // resetRegionNMovements

  // applyArmyMovement (armyMovement: WotrArmyMovement, doCountMovements: boolean) {
  //   this.update ("Apply army movement", (s) =>
  //     this.armyMovement (armyMovement, doCountMovements, s)
  //   );
  // } // applyArmyMovement

  // private armyMovement (
  //   armyMovement: WotrArmyMovement,
  //   doCountMovements: boolean,
  //   s: WotrGameState
  // ): WotrGameState {
  //   for (const unit of armyMovement.units) {
  //     if (unit.type === "leader") {
  //       const regionLeaderIndex = this.findRegionLeaderIndex (unit, unit.regionId, s);
  //       const regionLeader = s.regions[unit.regionId].units[
  //         regionLeaderIndex
  //       ] as WotrRegionLeader;
  //       s = this.removeUnitFromRegionByIndex (regionLeaderIndex, unit.regionId, s);
  //       const nMovements = doCountMovements ? regionLeader.nMovements + 1 : 0;
  //       s = this.addLeaderToRegion (
  //         unit.leaderId,
  //         unit.nationId,
  //         armyMovement.toRegionId,
  //         nMovements,
  //         s
  //       );
  //     } else {
  //       const regionUnitIndex = this.findRegionUnitIndex (unit, unit.regionId, s);
  //       const regionUnit = s.regions[unit.regionId].units[regionUnitIndex] as Exclude<
  //       WotrRegionUnit,
  //       WotrRegionLeader
  //       >;
  //       s = this.removeUnitsFromRegionByIndex (
  //         regionUnitIndex,
  //         unit.regionId,
  //         unit.quantity,
  //         s
  //       );
  //       const nMovements = doCountMovements ? regionUnit.nMovements + 1 : 0;
  //       s = this.addUnitsToRegion (
  //         unit.type,
  //         unit.nationId,
  //         armyMovement.toRegionId,
  //         unit.quantity,
  //         nMovements,
  //         s
  //       );
  //     } // if - else
  //   } // for
  //   return s;
  // } // armyMovement

  // // applyRecruitment (land: WotrLandCoordinates, playerId: string) {
  // //   const player = this.getPlayer (playerId);
  // //   this.removePawnFromPlayer ("knight", player.id);
  // //   this.addPawnToLandTile ("knight", player.color, land);
  // // } // applyRecruitment

  // // applyMovement (movement: WotrMovement, playerId: string) {
  // //   const player = this.getPlayer (playerId);
  // //   this.removePawnFromLandTile ("knight", player.color, movement.fromLand);
  // //   this.addPawnToLandTile ("knight", player.color, movement.toLand);
  // //   if (movement.conflict) {
  // //     const land = this.getLand (movement.toLand);
  // //     let villagePlayer: WotrPlayer | null = null;
  // //     land.pawns
  // //     .filter (pawn => pawn.color !== player.color)
  // //     .forEach (pawn => {
  // //       const pawnPlayer = this.getPlayers ().find (p => p.color === pawn.color) as WotrPlayer;
  // //       this.removePawnFromLandTile (pawn.type, pawn.color, land.coordinates);
  // //       this.addPawnToPlayer (pawn.type, pawnPlayer.id);
  // //       if (pawn.type === "village") {
  // //         villagePlayer = pawnPlayer;
  // //       } // if
  // //     });
  // //     if (villagePlayer && movement.gainedResource) {
  // //       this.removeResourceFromPlayer (movement.gainedResource, (villagePlayer as WotrPlayer).id);
  // //       this.addResourceToPlayer (movement.gainedResource, playerId);
  // //     } // if
  // //   } // if
  // // } // applyMovement

  // // applyConstruction (construction: WotrConstruction, playerId: string) {
  // //   const player = this.getPlayer (playerId);
  // //   this.removePawnFromLandTile ("knight", player.color, construction.land);
  // //   this.removePawnFromPlayer (construction.building, player.id);
  // //   this.addPawnToLandTile (construction.building, player.color, construction.land);
  // //   this.addPawnToPlayer ("knight", player.id);
  // //   const resource = this.getResourceFromLand (construction.land);
  // //   this.addResourceToPlayer (resource, player.id);
  // // } // applyConstruction

  // // applyNewCity (land: WotrLandCoordinates, playerId: string) {
  // //   const player = this.getPlayer (playerId);
  // //   this.removePawnFromLandTile ("village", player.color, land);
  // //   this.addPawnToLandTile ("city", player.color, land);
  // //   this.addPawnToPlayer ("village", playerId);
  // //   this.removePawnFromPlayer ("city", playerId);
  // //   this.addVictoryPoints (10, playerId);
  // // } // applyNewCity

  // // applyExpedition (land: WotrLandCoordinates, playerId: string) {
  // //   const player = this.getPlayer (playerId);
  // //   this.removePawnFromPlayer ("knight", playerId);
  // //   this.addPawnToLandTile ("knight", player.color, land);
  // //   this.removePawnFromPlayer ("knight", playerId);
  // //   this.addPawnToGameBox ("knight", player.color);
  // // } // applyExpedition

  // // discardResource (resource: WotrResourceType, playerId: string) {
  // //   this.removeResourceFromPlayer (resource, playerId);
  // // } // discardResource

  // // applyNobleTitle (resources: WotrResourceType[], playerId: string) {
  // //   resources.forEach (resource => this.discardResource (resource, playerId));
  // //   this.addVictoryPoints (15, playerId);
  // // } // applyNobleTitle

  // // logSetup () { this.addLog ({ type: "setup" }); }
  // // logRound (roundId: WotrRoundId) { this.addLog ({ type: "round", roundId: roundId }); }
  // // logNationTurn (nationId: WotrNationId) { this.addLog ({ type: "nation-turn", nationId: nationId }); }
  // // logPhase (phase: WotrPhase) { this.addLog ({ type: "phase", phase: phase }); }
  // // logPopulationMarkerSet (populationMarker: number | null) { this.addLog ({ type: "population-marker-set", populationMarker }); }
  // // logInfantryPlacement (landId: WotrLandRegionId, quantity: number) { this.addLog ({ type: "infantry-placement", landId, quantity }); }
  // // logInfantryReinforcements (regionId: WotrRegionId, quantity: number) { this.addLog ({ type: "infantry-reinforcement", regionId, quantity }); }
  // // logArmyMovement (units: WotrRegionUnit[], toRegionId: WotrRegionId) { this.addLog ({ type: "army-movement", units, toRegionId }); }
  // // // logMovement (movement: WotrMovement, player: string) { this.addLog ({ type: "movement", movement: movement, player: player }); }
  // // // logExpedition (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "expedition", land: land, player: player }); }
  // // // logNobleTitle (resources: WotrResourceType[], player: string) { this.addLog ({ type: "nobleTitle", resources: resources, player: player }); }
  // // // logNewCity (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "newCity", land: land, player: player }); }
  // // // logConstruction (construction: WotrConstruction, player: string) { this.addLog ({ type: "construction", construction: construction, player: player }); }
  // // // logRecuitment (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "recruitment", land: land, player: player }); }
  // // // logSetupPlacement (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "setupPlacement", land: land, player: player }); }

} // WotrGameStore
