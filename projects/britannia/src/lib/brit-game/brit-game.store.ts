import { Injectable, inject } from "@angular/core";
import { BgUser } from "@leobg/commons";
import { BgStore, arrayUtil, immutableUtil } from "@leobg/commons/utils";
import { BritAreaId, BritColor, BritLandAreaId, BritLeaderId, BritNationId, BritPhase, BritPopulation, BritRoundId, BritUnitType } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritAreaLeader, BritAreaState, BritAreaUnit, BritGameState, BritLog, BritNationState, BritPlayer, BritSetup } from "../brit-game-state.models";
import { BritArmyMovement, BritArmyMovements } from "../brit-story.models";

@Injectable ()
export class BritGameStore extends BgStore<BritGameState> {
  
  private components: BritComponentsService;

  constructor () {
    const components = inject (BritComponentsService);

    super (
      {
        gameId: "",
        gameOwner: null as any,
        players: { map: { }, colors: [] },
        areas: components.areasToMap ((areaId) => ({ units: [] })),
        nations: components.nationsToMap ((nationId) => {
          const nation = components.NATION[nationId];
          return {
            active: false,
            population: null,
            nInfantries: nation.nInfantries,
            nCavalries: nation.nCavalries,
            nBuildings: nation.nBuildings,
            leaderIds: [...nation.leaderIds],
          };
        }),
        logs: [],
      },
      "Britannia Game"
    );
  
    this.components = components;
  } // constructor

  initGameState (players: BritPlayer[], gameId: string, gameOwner: BgUser) {
    this.update ("Initial state", (s) => ({
      ...s,
      gameId: gameId,
      gameOwner: gameOwner,
      players: {
        map: arrayUtil.toMap (players, p => p.id) as Record<BritColor, BritPlayer>,
        colors: players.map (p => p.id),
      },
    }));
  } // initGameState

  private notTemporaryState: BritGameState | null = null;
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

  selectAreas$ () {
    return this.select$ ((s) => s.areas);
  }
  selectNations$ () {
    return this.select$ ((s) => s.nations);
  }

  selectPlayerMap$ () {
    return this.select$ ((s) => s.players.map);
  }

  selectPlayers$ () {
    return this.select$ (
      this.select$ ((s) => s.players),
      (players) => {
        return players ? players.colors.map ((id) => players.map[id]) : [];
      }
    );
  } // selectPlayers$

  selectLogs$ () { return this.select$ (s => s.logs); }

  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): BritPlayer[] { return this.get (s => s.players.colors.map (color => s.players.map[color]!)); }
  getPlayer (color: BritColor): BritPlayer { return this.get (s => s.players.map[color]!); }
  getNation (nationId: BritNationId) { return this.get (s => s.nations[nationId]); }
  getArea (areaId: BritAreaId) { return this.get (s => s.areas[areaId]); }
  getPlayerByNation (nationId: BritNationId) { return this.getPlayers ().find (p => p.nationIds.some (n => n === nationId)); }

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

  private updatePlayer (color: BritColor, updater: (p: BritPlayer) => BritPlayer, s: BritGameState): BritGameState {
    return {
      ...s,
      players: {
        ...s.players,
        map: {
          ...s.players.map,
          [color]: updater (s.players.map[color]!),
        },
      },
    };
  } // updatePlayer

  private updateArea (areaId: BritAreaId, updater: (a: BritAreaState) => BritAreaState, s: BritGameState): BritGameState {
    return {
      ...s,
      areas: {
        ...s.areas,
        [areaId]: updater (s.areas[areaId]),
      },
    };
  } // updateArea

  private updateNation (nationId: BritNationId, updater: (a: BritNationState) => BritNationState, s: BritGameState): BritGameState {
    return {
      ...s,
      nations: {
        ...s.nations,
        [nationId]: updater (s.nations[nationId]),
      },
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
    this.update ("Add log", (s) => ({
      ...s,
      logs: [...s.logs, log],
    }));
  } // addLog

  private setNationPopulation (population: BritPopulation | null, nationId: BritNationId, s: BritGameState): BritGameState {
    return this.updateNation (
      nationId,
      (nation) => ({
        ...nation,
        population: population,
      }),
      s
    );
  } // setNationPopulation

  private setNationActive (active: boolean, nationId: BritNationId, s: BritGameState): BritGameState {
    return this.updateNation (
      nationId,
      (nation) => ({
        ...nation,
        active: active,
      }),
      s
    );
  } // setNationActive

  private addUnitsToArea (
    unitType: Exclude<BritUnitType, "leader">,
    nationId: BritNationId,
    areaId: BritAreaId,
    quantity: number,
    nMovements: number,
    s: BritGameState
  ): BritGameState {
    return this.updateArea (
      areaId,
      (area) => {
        const index = area.units.findIndex (
          (u) =>
            u.type === unitType &&
            u.nationId === nationId &&
            u.nMovements === nMovements
        );
        if (index >= 0) {
          const unit = area.units[index];
          if (unit.type === "leader") {
            return area;
          }
          return {
            ...area,
            units: immutableUtil.listReplaceByIndex (
              index,
              { ...unit, quantity: unit.quantity + quantity },
              area.units
            ),
          };
        } else {
          return {
            ...area,
            units: immutableUtil.listPush (
              [
                {
                  type: unitType,
                  nationId: nationId,
                  quantity: quantity,
                  areaId,
                  nMovements,
                },
              ],
              area.units
            ),
          };
        } // if - else
      },
      s
    );
  } // addUnitsToArea

  private removeUnitsFromAreaByIndex (unitIndex: number, areaId: BritAreaId, quantity: number, s: BritGameState): BritGameState {
    return this.updateArea (
      areaId,
      (area) => {
        const unit = area.units[unitIndex];
        if (unit.type === "leader") {
          return area;
        }
        if (unit.quantity <= quantity) {
          return {
            ...area,
            units: immutableUtil.listRemoveByIndex (unitIndex, area.units),
          };
        } else {
          return {
            ...area,
            units: immutableUtil.listReplaceByIndex (
              unitIndex,
              { ...unit, quantity: unit.quantity - quantity },
              area.units
            ),
          };
        } // if - else
      },
      s
    );
  } // removeUnitsFromAreaByIndex

  private addLeaderToArea (
    leaderId: BritLeaderId,
    nationId: BritNationId,
    areaId: BritAreaId,
    nMovements: number,
    s: BritGameState
  ): BritGameState {
    return this.updateArea (
      areaId,
      (area) => ({
        ...area,
        units: immutableUtil.listPush (
          [
            {
              type: "leader",
              nationId: nationId,
              leaderId,
              areaId,
              nMovements,
            },
          ],
          area.units
        ),
      }),
      s
    );
  } // addLeaderToArea

  private findAreaLeaderIndex (
    leader: BritAreaLeader,
    areaId: BritAreaId,
    s: BritGameState
  ): number {
    return s.areas[areaId].units.findIndex (
      (u) => u.type === "leader" && u.leaderId === leader.leaderId
    );
  } // findAreaLeaderIndex

  private findAreaUnitIndex (
    unit: Exclude<BritAreaUnit, BritAreaLeader>,
    areaId: BritAreaId,
    s: BritGameState
  ): number {
    return s.areas[areaId].units.findIndex (
      (u) =>
        u.type === unit.type &&
        u.nationId === unit.nationId &&
        u.nMovements === unit.nMovements
    );
  } // findAreaUnitIndex

  private removeUnitFromAreaByIndex (
    unitIndex: number,
    areaId: BritAreaId,
    s: BritGameState
  ): BritGameState {
    return this.updateArea (
      areaId,
      (area) => ({
        ...area,
        units: immutableUtil.listRemoveByIndex (unitIndex, area.units),
      }),
      s
    );
  } // removeUnitFromAreaByIndex

  private removeUnitsFromNation (
    unitType: Exclude<BritUnitType, "leader">,
    nationId: BritNationId,
    quantity: number,
    s: BritGameState
  ): BritGameState {
    return this.updateNation (
      nationId,
      (n) => {
        switch (unitType) {
          case "infantry":
            return { ...n, nInfantries: n.nInfantries - quantity };
          case "cavalry":
            return { ...n, nCavalries: n.nCavalries - quantity };
          case "saxon-buhr":
          case "roman-fort":
            return { ...n, nBuildings: n.nBuildings - quantity };
        } // switch
      },
      s
    );
  } // removeUnitsFromNation

  private removeLeaderFromNation (
    leaderId: BritLeaderId,
    nationId: BritNationId,
    s: BritGameState
  ): BritGameState {
    return this.updateNation (
      nationId,
      (n) => ({
        ...n,
        leaderIds: immutableUtil.listRemoveFirst (
          (l) => l === leaderId,
          n.leaderIds
        ),
      }),
      s
    );
  } // removeUnitFromNation

  applySetup (setup: BritSetup) {
    this.update ("Setup", (s) => {
      return this.components.AREA_IDS.reduce ((state, areaId) => {
        const areaSetup = setup.areas[areaId];
        if (areaSetup) {
          const [nationId, nInfantries] =
            typeof areaSetup === "string"
              ? [areaSetup, 1]
              : [areaSetup[0], areaSetup[1]];
          state = this.removeUnitsFromNation (
            "infantry",
            nationId,
            nInfantries,
            state
          );
          state = this.addUnitsToArea (
            "infantry",
            nationId,
            areaId,
            nInfantries,
            0,
            state
          );
        } // if
        setup.populationMarkers.forEach ((nationId) => {
          state = this.setNationPopulation (0, nationId, state);
        });
        setup.activeNations.forEach ((nationId) => {
          state = this.setNationActive (true, nationId, state);
        });
        return state;
      }, s);
    });
  } // applySetup

  private placeInfantry (
    areaId: BritAreaId,
    nationId: BritNationId,
    s: BritGameState
  ): BritGameState {
    s = this.removeUnitsFromNation ("infantry", nationId, 1, s);
    s = this.addUnitsToArea ("infantry", nationId, areaId, 1, 0, s);
    return s;
  } // placeInfantry

  applyInfantryPlacement (areaId: BritAreaId, nationId: BritNationId) {
    this.update ("Apply infantry placement", (s) =>
      this.placeInfantry (areaId, nationId, s)
    );
  } // applyInfantryPlacement

  applyPopulationIncrease (
    population: BritPopulation | null,
    infantryPlacement: { areaId: BritAreaId; quantity: number }[],
    nationId: BritNationId
  ) {
    this.update ("Apply population increase", (s) => {
      s = this.setNationPopulation (population, nationId, s);
      for (const ip of infantryPlacement) {
        for (let i = 0; i < ip.quantity; i++) {
          s = this.placeInfantry (ip.areaId, nationId, s);
        } // for
      } // for
      return s;
    });
  } // applyPopulationIncrease

  applyArmyMovements (
    armyMovements: BritArmyMovements,
    doCountMovements: boolean
  ) {
    this.update ("Apply army movements", (s) => {
      for (const movement of armyMovements.movements) {
        s = this.armyMovement (movement, doCountMovements, s);
      } // for
      for (const movement of armyMovements.movements) {
        s = this.resetAreaNMovements (movement.toAreaId, s);
      } // for
      return s;
    });
  } // applyArmyMovements

  private resetAreaNMovements (
    areaId: BritAreaId,
    s: BritGameState
  ): BritGameState {
    return this.updateArea (
      areaId,
      (area) => {
        const newUnits: BritAreaUnit[] = [];
        for (const unit of area.units) {
          if (unit.type === "leader") {
            newUnits.push ({ ...unit, nMovements: 0 });
          } else {
            const newIndex = newUnits.findIndex (
              (u) => u.type === unit.type && u.nationId === unit.nationId
            );
            if (newIndex >= 0) {
              const newUnit = newUnits[newIndex];
              if (newUnit.type === "leader") {
                throw "Unexpected";
              }
              newUnit.quantity += unit.quantity;
            } else {
              newUnits.push ({ ...unit, nMovements: 0 });
            } // if - else
          } // if - else
        } // for
        return {
          ...area,
          units: newUnits,
        };
      },
      s
    );
  } // resetAreaNMovements

  applyArmyMovement (armyMovement: BritArmyMovement, doCountMovements: boolean) {
    this.update ("Apply army movement", (s) =>
      this.armyMovement (armyMovement, doCountMovements, s)
    );
  } // applyArmyMovement

  private armyMovement (
    armyMovement: BritArmyMovement,
    doCountMovements: boolean,
    s: BritGameState
  ): BritGameState {
    for (const unit of armyMovement.units) {
      if (unit.type === "leader") {
        const areaLeaderIndex = this.findAreaLeaderIndex (unit, unit.areaId, s);
        const areaLeader = s.areas[unit.areaId].units[
          areaLeaderIndex
        ] as BritAreaLeader;
        s = this.removeUnitFromAreaByIndex (areaLeaderIndex, unit.areaId, s);
        const nMovements = doCountMovements ? areaLeader.nMovements + 1 : 0;
        s = this.addLeaderToArea (
          unit.leaderId,
          unit.nationId,
          armyMovement.toAreaId,
          nMovements,
          s
        );
      } else {
        const areaUnitIndex = this.findAreaUnitIndex (unit, unit.areaId, s);
        const areaUnit = s.areas[unit.areaId].units[areaUnitIndex] as Exclude<
        BritAreaUnit,
        BritAreaLeader
        >;
        s = this.removeUnitsFromAreaByIndex (
          areaUnitIndex,
          unit.areaId,
          unit.quantity,
          s
        );
        const nMovements = doCountMovements ? areaUnit.nMovements + 1 : 0;
        s = this.addUnitsToArea (
          unit.type,
          unit.nationId,
          armyMovement.toAreaId,
          unit.quantity,
          nMovements,
          s
        );
      } // if - else
    } // for
    return s;
  } // armyMovement

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

  logSetup () {
    this.addLog ({ type: "setup" });
  }
  logRound (roundId: BritRoundId) {
    this.addLog ({ type: "round", roundId: roundId });
  }
  logNationTurn (nationId: BritNationId) {
    this.addLog ({ type: "nation-turn", nationId: nationId });
  }
  logPhase (phase: BritPhase) {
    this.addLog ({ type: "phase", phase: phase });
  }
  logPopulationMarkerSet (populationMarker: number | null) {
    this.addLog ({ type: "population-marker-set", populationMarker });
  }
  logInfantryPlacement (landId: BritLandAreaId, quantity: number) {
    this.addLog ({ type: "infantry-placement", landId, quantity });
  }
  logInfantryReinforcements (areaId: BritAreaId, quantity: number) {
    this.addLog ({ type: "infantry-reinforcement", areaId, quantity });
  }
  logArmyMovement (units: BritAreaUnit[], toAreaId: BritAreaId) {
    this.addLog ({ type: "army-movement", units, toAreaId });
  }
  // logMovement (movement: BritMovement, player: string) { this.addLog ({ type: "movement", movement: movement, player: player }); }
  // logExpedition (land: BritLandCoordinates, player: string) { this.addLog ({ type: "expedition", land: land, player: player }); }
  // logNobleTitle (resources: BritResourceType[], player: string) { this.addLog ({ type: "nobleTitle", resources: resources, player: player }); }
  // logNewCity (land: BritLandCoordinates, player: string) { this.addLog ({ type: "newCity", land: land, player: player }); }
  // logConstruction (construction: BritConstruction, player: string) { this.addLog ({ type: "construction", construction: construction, player: player }); }
  // logRecuitment (land: BritLandCoordinates, player: string) { this.addLog ({ type: "recruitment", land: land, player: player }); }
  // logSetupPlacement (land: BritLandCoordinates, player: string) { this.addLog ({ type: "setupPlacement", land: land, player: player }); }
} // BritGameStore
