import { computed, Injectable } from '@angular/core';
import type { BgUser } from '@leobg/commons';
import { arrayUtil, immutableUtil } from '@leobg/commons/utils';
import { patchState, signalStore, withState } from '@ngrx/signals';
import type {
  BritAreaId,
  BritColor,
  BritLandAreaId,
  BritLeaderId,
  BritNationId,
  BritPhase,
  BritPopulation,
  BritRoundId,
  BritUnitType,
} from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type {
  BritAreaLeader,
  BritAreaState,
  BritAreaUnit,
  BritGameState,
  BritLog,
  BritNationState,
  BritPlayer,
  BritSetup,
} from '../brit-game-state.models';
import type { BritArmyMovement, BritArmyMovements } from '../brit-story.models';

function initialState(): BritGameState {
  const components = new BritComponents();
  return {
    gameId: '',
    gameOwner: undefined,
    players: { map: {}, colors: [] },
    areas: components.areasToMap(() => ({ units: [] })),
    nations: components.nationsToMap((nationId) => {
      const nation = components.NATION[nationId];
      return {
        active: false,
        population: undefined,
        nInfantries: nation.nInfantries,
        nCavalries: nation.nCavalries,
        nBuildings: nation.nBuildings,
        leaderIds: [...nation.leaderIds],
      };
    }),
    logs: [],
    backupState: undefined,
  };
}

@Injectable()
export class BritGameStore extends signalStore(
  { protectedState: false },
  withState<BritGameState>(initialState()),
) {
  initGameState(
    players: BritPlayer[],
    gameId: string,
    gameOwner: BgUser,
  ): void {
    patchState(
      this,
      (s) =>
        ({
          ...s,
          gameId: gameId,
          gameOwner: gameOwner,
          players: {
            map: arrayUtil.toMap(players, (p) => p.id),
            colors: players.map((p) => p.id),
          },
        }) satisfies BritGameState,
    );
  }

  isTemporaryState(): boolean {
    return !!this.backupState();
  }
  startTemporaryState(): void {
    patchState(this, (s) => ({ ...s, backupState: s }));
  }
  endTemporaryState(): void {
    if (this.backupState()) {
      patchState(this, (s) => ({ ...s.backupState, backupState: undefined }));
    } else {
      throw new Error('endTemporaryState without startTemporaryState');
    }
  }

  playerList = computed<BritPlayer[]>(() =>
    this.players.colors().map((color) => this.players.map()[color]!),
  );

  getPlayer(color: BritColor): BritPlayer {
    return this.players.map()[color]!;
  }
  getNation(nationId: BritNationId): BritNationState {
    return this.nations()[nationId];
  }
  getArea(areaId: BritAreaId): BritAreaState {
    return this.areas()[areaId];
  }
  getPlayerByNation(nationId: BritNationId): BritPlayer | undefined {
    return this.playerList().find((p) => p.nationIds.includes(nationId));
  }

  // // isLocalPlayer (id: string): boolean { return !this.getPlayer (id).isAi && !this.getPlayer (id).isRemote; }
  // getPlayerIds () { return this.get (s => s.players.ids); }
  // getPlayerMap () { return this.get (s => s.players.map); }
  // getNumberOfPlayers (): number { return this.getPlayers ().length; }
  // getLand (land: BritLandCoordinates) { return this.get (s => s.lands.map[landCoordinatesToId (land)]); }
  // getLands (): BritLand[] {
  //   const map = this.get (s => s.lands.map);
  //   const coordinates = this.get (s => s.lands.coordinates);
  //   return coordinates.map (coordinate => map[landCoordinatesToId (coordinate)]);
  // }
  // getLandOrundefined (land: BritLandCoordinates): BritLand | undefined { return this.getLand (land) || undefined; }

  // private selectLandTileMap$ () { return this.select$ (s => s.lands.map); }
  // private selectLandTileKeys$ () { return this.select$ (s => s.lands.coordinates); }
  // selectLands$ (): Observable<BritLand[]> {
  //   return this.select$ (
  //     this.selectLandTileMap$ (),
  //     this.selectLandTileKeys$ (),
  //     (map, keys) => keys.map (k => map[landCoordinatesToId (k)])
  //   );
  // }
  // selectPlayerIds$ () { return this.select$ (s => s.players.ids); }
  // selectPlayerMap$ () { return this.select$ (s => s.players.map); }
  // selectLogs$ () { return this.select$ (s => s.logs); }

  private updatePlayer(
    color: BritColor,
    updater: (p: BritPlayer) => BritPlayer,
    s: BritGameState,
  ): BritGameState {
    return {
      ...s,
      players: {
        ...s.players,
        map: {
          ...s.players.map,
          [color]: updater(s.players.map[color]!),
        },
      },
    };
  }

  private updateArea(
    areaId: BritAreaId,
    updater: (a: BritAreaState) => BritAreaState,
    s: BritGameState,
  ): BritGameState {
    return {
      ...s,
      areas: {
        ...s.areas,
        [areaId]: updater(s.areas[areaId]),
      },
    };
  }

  private updateNation(
    nationId: BritNationId,
    updater: (a: BritNationState) => BritNationState,
    s: BritGameState,
  ): BritGameState {
    return {
      ...s,
      nations: {
        ...s.nations,
        [nationId]: updater(s.nations[nationId]),
      },
    };
  }

  // private addPawnToPlayer (pawnType: BritPawnType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     pawns: {
  //       ...p.pawns,
  //       [pawnType]: p.pawns[pawnType] + 1
  //     }
  //   }));
  // }

  // private removePawnFromPlayer (pawnType: BritPawnType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     pawns: {
  //       ...p.pawns,
  //       [pawnType]: p.pawns[pawnType] - 1
  //     }
  //   }));
  // }

  // private addPawnToLandTile (pawnType: BritPawnType, pawnColor: BritColor, land: BritLandCoordinates) {
  //   this.updateLand (land, lt => ({
  //     ...lt,
  //     pawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], lt.pawns)
  //   }));
  // }

  // private removePawnFromLandTile (pawnType: BritPawnType, pawnColor: BritColor, land: BritLandCoordinates) {
  //   this.updateLand (land, lt => ({
  //     ...lt,
  //     pawns: immutableUtil.listRemoveFirst (p => p.type === pawnType && p.color === pawnColor, lt.pawns)
  //   }));
  // }

  // private addResourceToPlayer (resource: BritResourceType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     resources: {
  //       ...p.resources,
  //       [resource]: p.resources[resource] + 1
  //     }
  //   }));
  // }

  // private removeResourceFromPlayer (resource: BritResourceType, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     resources: {
  //       ...p.resources,
  //       [resource]: p.resources[resource] - 1
  //     }
  //   }));
  // }

  // private getResourceFromLand (landCoordinates: BritLandCoordinates): BritResourceType {
  //   const land = this.getLand (landCoordinates);
  //   return land?.type as BritResourceType;
  // }

  // private addVictoryPoints (victoryPoints: number, playerId: string) {
  //   this.updatePlayer (playerId, p => ({
  //     ...p,
  //     score: p.score + victoryPoints
  //   }));
  // }

  // private addPawnToGameBox (pawnType: BritPawnType, pawnColor: BritColor) {
  //   this.updateGameBox (gameBox => ({
  //     ...gameBox,
  //     removedPawns: immutableUtil.listPush ([{ color: pawnColor, type: pawnType }], gameBox.removedPawns)
  //   }));
  // }

  private addLog(log: BritLog): void {
    patchState(this, (s) => ({
      ...s,
      logs: [...s.logs, log],
    }));
  }

  private setNationPopulation(
    population: BritPopulation | undefined,
    nationId: BritNationId,
    s: BritGameState,
  ): BritGameState {
    return this.updateNation(
      nationId,
      (nation) => ({
        ...nation,
        population: population,
      }),
      s,
    );
  }

  private setNationActive(
    isActive: boolean,
    nationId: BritNationId,
    s: BritGameState,
  ): BritGameState {
    return this.updateNation(
      nationId,
      (nation) => ({
        ...nation,
        active: isActive,
      }),
      s,
    );
  }

  private addUnitsToArea(
    unitType: Exclude<BritUnitType, 'leader'>,
    nationId: BritNationId,
    areaId: BritAreaId,
    quantity: number,
    nMovements: number,
    s: BritGameState,
  ): BritGameState {
    return this.updateArea(
      areaId,
      (area) => {
        const index = area.units.findIndex(
          (u) =>
            u.type === unitType &&
            u.nationId === nationId &&
            u.nMovements === nMovements,
        );
        if (index === -1) {
          return {
            ...area,
            units: immutableUtil.listPush(
              [
                {
                  type: unitType,
                  nationId: nationId,
                  quantity: quantity,
                  areaId,
                  nMovements,
                },
              ],
              area.units,
            ),
          };
        }
        const unit = area.units[index];
        if (unit.type === 'leader') return area;
        return {
          ...area,
          units: immutableUtil.listReplaceByIndex(
            index,
            { ...unit, quantity: unit.quantity + quantity },
            area.units,
          ),
        };
      },
      s,
    );
  }

  private removeUnitsFromAreaByIndex(
    unitIndex: number,
    areaId: BritAreaId,
    quantity: number,
    s: BritGameState,
  ): BritGameState {
    return this.updateArea(
      areaId,
      (area) => {
        const unit = area.units[unitIndex];
        if (unit.type === 'leader') {
          return area;
        }
        return unit.quantity <= quantity
          ? {
              ...area,
              units: immutableUtil.listRemoveByIndex(unitIndex, area.units),
            }
          : {
              ...area,
              units: immutableUtil.listReplaceByIndex(
                unitIndex,
                { ...unit, quantity: unit.quantity - quantity },
                area.units,
              ),
            };
      },
      s,
    );
  }

  private addLeaderToArea(
    leaderId: BritLeaderId,
    nationId: BritNationId,
    areaId: BritAreaId,
    nMovements: number,
    s: BritGameState,
  ): BritGameState {
    return this.updateArea(
      areaId,
      (area) => ({
        ...area,
        units: immutableUtil.listPush(
          [
            {
              type: 'leader',
              nationId: nationId,
              leaderId,
              areaId,
              nMovements,
            },
          ],
          area.units,
        ),
      }),
      s,
    );
  }

  private findAreaLeaderIndex(
    leader: BritAreaLeader,
    areaId: BritAreaId,
    s: BritGameState,
  ): number {
    return s.areas[areaId].units.findIndex(
      (u) => u.type === 'leader' && u.leaderId === leader.leaderId,
    );
  }

  private findAreaUnitIndex(
    unit: Exclude<BritAreaUnit, BritAreaLeader>,
    areaId: BritAreaId,
    s: BritGameState,
  ): number {
    return s.areas[areaId].units.findIndex(
      (u) =>
        u.type === unit.type &&
        u.nationId === unit.nationId &&
        u.nMovements === unit.nMovements,
    );
  }

  private removeUnitFromAreaByIndex(
    unitIndex: number,
    areaId: BritAreaId,
    s: BritGameState,
  ): BritGameState {
    return this.updateArea(
      areaId,
      (area) => ({
        ...area,
        units: immutableUtil.listRemoveByIndex(unitIndex, area.units),
      }),
      s,
    );
  }

  private removeUnitsFromNation(
    unitType: Exclude<BritUnitType, 'leader'>,
    nationId: BritNationId,
    quantity: number,
    s: BritGameState,
  ): BritGameState {
    return this.updateNation(
      nationId,
      (n) => {
        switch (unitType) {
          case 'infantry':
            return { ...n, nInfantries: n.nInfantries - quantity };
          case 'cavalry':
            return { ...n, nCavalries: n.nCavalries - quantity };
          case 'saxon-buhr':
          case 'roman-fort':
            return { ...n, nBuildings: n.nBuildings - quantity };
        }
      },
      s,
    );
  }

  private removeLeaderFromNation(
    leaderId: BritLeaderId,
    nationId: BritNationId,
    s: BritGameState,
  ): BritGameState {
    return this.updateNation(
      nationId,
      (n) => ({
        ...n,
        leaderIds: immutableUtil.listRemoveFirst(
          (l) => l === leaderId,
          n.leaderIds,
        ),
      }),
      s,
    );
  }

  applySetup(setup: BritSetup): void {
    patchState(this, (s) => {
      const components = new BritComponents();
      let state = s;
      for (const areaId of components.AREA_IDS) {
        const areaSetup = setup.areas[areaId];
        if (areaSetup) {
          const [nationId, nInfantries] =
            typeof areaSetup === 'string'
              ? [areaSetup, 1]
              : [areaSetup[0], areaSetup[1]];
          state = this.removeUnitsFromNation(
            'infantry',
            nationId,
            nInfantries,
            state,
          );
          state = this.addUnitsToArea(
            'infantry',
            nationId,
            areaId,
            nInfantries,
            0,
            state,
          );
        }
        for (const nationId of setup.populationMarkers) {
          state = this.setNationPopulation(0, nationId, state);
        }
        for (const nationId of setup.activeNations) {
          state = this.setNationActive(true, nationId, state);
        }
      }
      return state;
    });
  }

  private placeInfantry(
    areaId: BritAreaId,
    nationId: BritNationId,
    s: BritGameState,
  ): BritGameState {
    s = this.removeUnitsFromNation('infantry', nationId, 1, s);
    s = this.addUnitsToArea('infantry', nationId, areaId, 1, 0, s);
    return s;
  }

  applyInfantryPlacement(areaId: BritAreaId, nationId: BritNationId): void {
    patchState(this, (s) => this.placeInfantry(areaId, nationId, s));
  }

  applyPopulationIncrease(
    population: BritPopulation | undefined,
    infantryPlacement: { areaId: BritAreaId; quantity: number }[],
    nationId: BritNationId,
  ): void {
    patchState(this, (s) => {
      s = this.setNationPopulation(population, nationId, s);
      for (const ip of infantryPlacement) {
        for (let i = 0; i < ip.quantity; i++) {
          s = this.placeInfantry(ip.areaId, nationId, s);
        }
      }
      return s;
    });
  }

  applyArmyMovements(
    armyMovements: BritArmyMovements,
    shouldCountMovements: boolean,
  ): void {
    patchState(this, (s) => {
      for (const movement of armyMovements.movements) {
        s = this.armyMovement(movement, shouldCountMovements, s);
      }
      for (const movement of armyMovements.movements) {
        s = this.resetAreaNMovements(movement.toAreaId, s);
      }
      return s;
    });
  }

  private resetAreaNMovements(
    areaId: BritAreaId,
    s: BritGameState,
  ): BritGameState {
    return this.updateArea(
      areaId,
      (area) => {
        const newUnits: BritAreaUnit[] = [];
        for (const unit of area.units) {
          if (unit.type === 'leader') {
            newUnits.push({ ...unit, nMovements: 0 });
          } else {
            const newIndex = newUnits.findIndex(
              (u) => u.type === unit.type && u.nationId === unit.nationId,
            );
            if (newIndex === -1) {
              newUnits.push({ ...unit, nMovements: 0 });
            } else {
              const newUnit = newUnits[newIndex];
              if (newUnit.type === 'leader') {
                throw new Error('Unexpected');
              }
              newUnit.quantity += unit.quantity;
            }
          }
        }
        return {
          ...area,
          units: newUnits,
        };
      },
      s,
    );
  }

  applyArmyMovement(
    armyMovement: BritArmyMovement,
    shouldCountMovements: boolean,
  ): void {
    patchState(this, (s) =>
      this.armyMovement(armyMovement, shouldCountMovements, s),
    );
  }

  private armyMovement(
    armyMovement: BritArmyMovement,
    shouldCountMovements: boolean,
    s: BritGameState,
  ): BritGameState {
    for (const unit of armyMovement.units) {
      if (unit.type === 'leader') {
        const areaLeaderIndex = this.findAreaLeaderIndex(unit, unit.areaId, s);
        const areaLeader = s.areas[unit.areaId].units[
          areaLeaderIndex
        ] as BritAreaLeader;
        s = this.removeUnitFromAreaByIndex(areaLeaderIndex, unit.areaId, s);
        const nMovements = shouldCountMovements ? areaLeader.nMovements + 1 : 0;
        s = this.addLeaderToArea(
          unit.leaderId,
          unit.nationId,
          armyMovement.toAreaId,
          nMovements,
          s,
        );
      } else {
        const areaUnitIndex = this.findAreaUnitIndex(unit, unit.areaId, s);
        const areaUnit = s.areas[unit.areaId].units[areaUnitIndex] as Exclude<
          BritAreaUnit,
          BritAreaLeader
        >;
        s = this.removeUnitsFromAreaByIndex(
          areaUnitIndex,
          unit.areaId,
          unit.quantity,
          s,
        );
        const nMovements = shouldCountMovements ? areaUnit.nMovements + 1 : 0;
        s = this.addUnitsToArea(
          unit.type,
          unit.nationId,
          armyMovement.toAreaId,
          unit.quantity,
          nMovements,
          s,
        );
      }
    }
    return s;
  }

  // applyRecruitment (land: BritLandCoordinates, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromPlayer ("knight", player.id);
  //   this.addPawnToLandTile ("knight", player.color, land);
  // }

  // applyMovement (movement: BritMovement, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromLandTile ("knight", player.color, movement.fromLand);
  //   this.addPawnToLandTile ("knight", player.color, movement.toLand);
  //   if (movement.conflict) {
  //     const land = this.getLand (movement.toLand);
  //     let villagePlayer: BritPlayer | undefined = undefined;
  //     land.pawns
  //     .filter (pawn => pawn.color !== player.color)
  //     .forEach (pawn => {
  //       const pawnPlayer = this.getPlayers ().find (p => p.color === pawn.color) as BritPlayer;
  //       this.removePawnFromLandTile (pawn.type, pawn.color, land.coordinates);
  //       this.addPawnToPlayer (pawn.type, pawnPlayer.id);
  //       if (pawn.type === "village") {
  //         villagePlayer = pawnPlayer;
  //       }
  //     });
  //     if (villagePlayer && movement.gainedResource) {
  //       this.removeResourceFromPlayer (movement.gainedResource, (villagePlayer as BritPlayer).id);
  //       this.addResourceToPlayer (movement.gainedResource, playerId);
  //     }
  //   }
  // }

  // applyConstruction (construction: BritConstruction, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromLandTile ("knight", player.color, construction.land);
  //   this.removePawnFromPlayer (construction.building, player.id);
  //   this.addPawnToLandTile (construction.building, player.color, construction.land);
  //   this.addPawnToPlayer ("knight", player.id);
  //   const resource = this.getResourceFromLand (construction.land);
  //   this.addResourceToPlayer (resource, player.id);
  // }

  // applyNewCity (land: BritLandCoordinates, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromLandTile ("village", player.color, land);
  //   this.addPawnToLandTile ("city", player.color, land);
  //   this.addPawnToPlayer ("village", playerId);
  //   this.removePawnFromPlayer ("city", playerId);
  //   this.addVictoryPoints (10, playerId);
  // }

  // applyExpedition (land: BritLandCoordinates, playerId: string) {
  //   const player = this.getPlayer (playerId);
  //   this.removePawnFromPlayer ("knight", playerId);
  //   this.addPawnToLandTile ("knight", player.color, land);
  //   this.removePawnFromPlayer ("knight", playerId);
  //   this.addPawnToGameBox ("knight", player.color);
  // }

  // discardResource (resource: BritResourceType, playerId: string) {
  //   this.removeResourceFromPlayer (resource, playerId);
  // }

  // applyNobleTitle (resources: BritResourceType[], playerId: string) {
  //   resources.forEach (resource => this.discardResource (resource, playerId));
  //   this.addVictoryPoints (15, playerId);
  // }

  logSetup(): void {
    this.addLog({ type: 'setup' });
  }
  logRound(roundId: BritRoundId): void {
    this.addLog({ type: 'round', roundId: roundId });
  }
  logNationTurn(nationId: BritNationId): void {
    this.addLog({ type: 'nation-turn', nationId: nationId });
  }
  logPhase(phase: BritPhase): void {
    this.addLog({ type: 'phase', phase: phase });
  }
  logPopulationMarkerSet(populationMarker: number | undefined): void {
    this.addLog({ type: 'population-marker-set', populationMarker });
  }
  logInfantryPlacement(landId: BritLandAreaId, quantity: number): void {
    this.addLog({ type: 'infantry-placement', landId, quantity });
  }
  logInfantryReinforcements(areaId: BritAreaId, quantity: number): void {
    this.addLog({ type: 'infantry-reinforcement', areaId, quantity });
  }
  logArmyMovement(units: BritAreaUnit[], toAreaId: BritAreaId): void {
    this.addLog({ type: 'army-movement', units, toAreaId });
  }
  // logMovement (movement: BritMovement, player: string) { this.addLog ({ type: "movement", movement: movement, player: player }); }
  // logExpedition (land: BritLandCoordinates, player: string) { this.addLog ({ type: "expedition", land: land, player: player }); }
  // logNobleTitle (resources: BritResourceType[], player: string) { this.addLog ({ type: "nobleTitle", resources: resources, player: player }); }
  // logNewCity (land: BritLandCoordinates, player: string) { this.addLog ({ type: "newCity", land: land, player: player }); }
  // logConstruction (construction: BritConstruction, player: string) { this.addLog ({ type: "construction", construction: construction, player: player }); }
  // logRecuitment (land: BritLandCoordinates, player: string) { this.addLog ({ type: "recruitment", land: land, player: player }); }
  // logSetupPlacement (land: BritLandCoordinates, player: string) { this.addLog ({ type: "setupPlacement", land: land, player: player }); }
}
