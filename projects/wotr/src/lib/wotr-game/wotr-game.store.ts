import { Injectable, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BgUser } from "@leobg/commons";
import { BgStore, arrayUtil } from "@leobg/commons/utils";
import { WotrActionApplier } from "../wotr-actions/wotr-action-applier";
import { WotrActionDiceActionsService } from "../wotr-actions/wotr-action-dice-actions.service";
import { WotrArmyActionsService } from "../wotr-actions/wotr-army-actions.service";
import { WotrCardActionsService } from "../wotr-actions/wotr-card-actions.service";
import { WotrCombatActionsService } from "../wotr-actions/wotr-combat-actions.service";
import { WotrCompanionActionsService } from "../wotr-actions/wotr-companion-actions.service";
import { WotrFellowshipActionsService } from "../wotr-actions/wotr-fellowship-actions.service";
import { WotrHuntActionsService } from "../wotr-actions/wotr-hunt-actions.service";
import { WotrMinionActionsService } from "../wotr-actions/wotr-minion-actions.service";
import { WotrPoliticalActionsService } from "../wotr-actions/wotr-political-actions.service";
import * as fromCompanion from "../wotr-elements/wotr-companion.state";
import * as fromFellowhip from "../wotr-elements/wotr-fellowship.state";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import * as fromFront from "../wotr-elements/wotr-front.state";
import { WotrGameStateService } from "../wotr-elements/wotr-game-state.service";
import { WotrGameState } from "../wotr-elements/wotr-game.state";
import * as fromHunt from "../wotr-elements/wotr-hunt.state";
import { WotrLog } from "../wotr-elements/wotr-log.models";
import * as fromMinion from "../wotr-elements/wotr-minion.state";
import { WotrNation, WotrNationId } from "../wotr-elements/wotr-nation.models";
import * as fromNation from "../wotr-elements/wotr-nation.state";
import { WotrPhase } from "../wotr-elements/wotr-phase.models";
import { WotrPlayer } from "../wotr-elements/wotr-player.models";
import { WotrRegion, WotrRegionId } from "../wotr-elements/wotr-region.models";
import * as fromRegion from "../wotr-elements/wotr-region.state";
import { WotrSetup } from "../wotr-rules/wotr-rules-setup.service";
import { WotrAction } from "../wotr-story.models";

@Injectable ()
export class WotrGameStore extends BgStore<WotrGameState> {
  
  constructor () {
    super ({
      gameId: "",
      gameOwner: null as any,
      players: {
        map: { } as any,
        ids: []
      },
      frontState: fromFront.initFrontState (),
      regionState: fromRegion.initRegionState (),
      nationState: fromNation.initNationState (),
      companionState: fromCompanion.initCompanionState (),
      minionState: fromMinion.initMinionState (),
      fellowhip: fromFellowhip.initFellowshipState (),
      hunt: fromHunt.initHuntState (),
      logs: [],
    }, "War of the Ring Game");
  }

  private gameState = inject (WotrGameStateService);

  private cardActions = inject (WotrCardActionsService);
  private fellowshipActions = inject (WotrFellowshipActionsService);
  private huntActions = inject (WotrHuntActionsService);
  private actionDiceActions = inject (WotrActionDiceActionsService);
  private companionActions = inject (WotrCompanionActionsService);
  private minionActions = inject (WotrMinionActionsService);
  private armyActions = inject (WotrArmyActionsService);
  private politicalActions = inject (WotrPoliticalActionsService);
  private combatActions = inject (WotrCombatActionsService);
  private actionAppliers: Record<WotrAction["type"], WotrActionApplier<WotrAction>> = {
    ...this.cardActions.getActionAppliers (),
    ...this.fellowshipActions.getActionAppliers (),
    ...this.huntActions.getActionAppliers (),
    ...this.actionDiceActions.getActionAppliers (),
    ...this.companionActions.getActionAppliers (),
    ...this.minionActions.getActionAppliers (),
    ...this.armyActions.getActionAppliers (),
    ...this.politicalActions.getActionAppliers (),
    ...this.combatActions.getActionAppliers (),
  } as any;

  initGameState (players: WotrPlayer[], gameId: string, gameOwner: BgUser) {
    this.update ("Initial state", s => ({
      ...s,
      gameId: gameId,
      gameOwner: gameOwner,
      players: {
        map: arrayUtil.toMap (players, p => p.id) as Record<WotrFrontId, WotrPlayer>,
        ids: players.map (p => p.id)
      }
    }));
  }

  private notTemporaryState: WotrGameState | null = null;
  isTemporaryState () { return !!this.notTemporaryState; }
  startTemporaryState () { this.notTemporaryState = this.get (); }
  endTemporaryState () {
    if (this.notTemporaryState) {
      const state = this.notTemporaryState;
      this.update ("End temporary state", s => ({ ...state }));
      this.notTemporaryState = null;
    } else {
      throw new Error ("endTemporaryState without startTemporaryState");
    }
  }

  playerMap$ = this.select$ (s => s.players.map);
  players$ = this.select$ (this.select$ (s => s.players), (players) => players.ids.map (id => players.map[id]));

  private frontState = toSignal (this.select$ (s => s.frontState), { requireSync: true });
  freePeopleFront = computed (() => this.frontState ().map["free-peoples"]);
  shadowFront = computed (() => this.frontState ().map.shadow);
  getFrontIds () { return this.get (s => s.frontState.ids); }

  private regionState = toSignal (this.select$ (s => s.regionState), { requireSync: true });
  regions = computed (() => fromRegion.getRegions (this.regionState ()));
  getRegion (regionId: WotrRegionId): WotrRegion { return this.regionState ().map[regionId]; }

  private companionState = toSignal (this.select$ (s => s.companionState), { requireSync: true });
  companionById = computed (() => this.companionState ().map);
  companions = computed (() => fromCompanion.getCompanions (this.companionState ()));

  private minionState = toSignal (this.select$ (s => s.minionState), { requireSync: true });
  minionById = computed (() => this.minionState ().map);
  minions = computed (() => fromMinion.getMinions (this.minionState ()));

  logs$ = this.select$ (s => s.logs);
  
  private nationState = toSignal (this.select$ (s => s.nationState), { requireSync: true });
  freePeopleNations = computed (() => fromNation.getFreePeopleNations (this.nationState ()));
  shadowNations = computed (() => fromNation.getShadowNations (this.nationState ()));
  nationById = computed (() => this.nationState ().map);
  getNation (nationId: WotrNationId): WotrNation { return this.nationState ().map[nationId]; }

  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): WotrPlayer[] { return this.get (s => s.players.ids.map (front => s.players.map[front])); }
  getPlayer (id: WotrFrontId): WotrPlayer { return this.get (s => s.players.map[id]); }

  // // // isLocalPlayer (id: string): boolean { return !this.getPlayer (id).isAi && !this.getPlayer (id).isRemote; }
  // // getPlayerIds () { return this.get (s => s.players.ids); }
  // // getPlayerMap () { return this.get (s => s.players.map); }
  // // getNumberOfPlayers (): number { return this.getPlayers ().length; }
  // // getLand (land: WotrLandCoordinates) { return this.get (s => s.lands.map[landCoordinatesToId (land)]); }
  // // getLands (): WotrLand[] {
  // //   const map = this.get (s => s.lands.map);
  // //   const coordinates = this.get (s => s.lands.coordinates);
  // //   return coordinates.map (coordinate => map[landCoordinatesToId (coordinate)]);
  // // }
  // // getLandOrNull (land: WotrLandCoordinates): WotrLand | null { return this.getLand (land) || null; }

  // // private selectLandTileMap$ () { return this.select$ (s => s.lands.map); }
  // // private selectLandTileKeys$ () { return this.select$ (s => s.lands.coordinates); }
  // // selectLands$ (): Observable<WotrLand[]> {
  // //   return this.select$ (
  // //     this.selectLandTileMap$ (),
  // //     this.selectLandTileKeys$ (),
  // //     (map, keys) => keys.map (k => map[landCoordinatesToId (k)])
  // //   );
  // // }
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
  // }

  applySetup (setup: WotrSetup) {
    this.logSetup ();
    this.update ("Setup", state => {
      for (const d of setup.decks) {
        state = this.gameState.updateFront (d.front, front => {
          front = fromFront.setCharacterDeck (d.characterDeck, front);
          front = fromFront.setStrategyDeck (d.strategyDeck, front);
          return front;
        }, state);
      }
      for (const r of setup.regions) {
        const frontId = state.nationState.map[r.nation].front;
        if (r.nRegulars) {
          state = this.gameState.updateNation (r.nation, nation => fromNation.removeRegularsFromReinforcements (r.nRegulars, nation), state);
          state = this.gameState.updateRegion (r.region, region => fromRegion.addRegularsToRegion (r.nation, frontId, r.nRegulars, region), state);
        }
        if (r.nElites) {
          state = this.gameState.updateNation (r.nation, nation => fromNation.removeElitesFromReinforcements (r.nElites, nation), state);
          state = this.gameState.updateRegion (r.region, region => fromRegion.addElitesToRegion (r.nation, frontId, r.nElites, region), state);
        }
        if (r.nLeaders) {
          state = this.gameState.updateNation (r.nation, nation => fromNation.removeLeadersFromReinforcements (r.nLeaders, nation), state);
          state = this.gameState.updateRegion (r.region, region => fromRegion.addLeadersToRegion (r.nation, r.nLeaders, region), state);
        }
        if (r.nNazgul) {
          state = this.gameState.updateNation (r.nation, nation => fromNation.removeNazgulFromReinforcements (r.nNazgul, nation), state);
          state = this.gameState.updateRegion (r.region, region => fromRegion.addNazgulToRegion (r.nNazgul, region), state);
        }
      }
      for (const nationSetup of setup.nations) {
        state = this.gameState.updateNation (nationSetup.nation, nation => {
          nation = fromNation.setActive (nationSetup.active, nation);
          nation = fromNation.setPoliticalStep (nationSetup.politicalStep, nation);
          return nation;
        }, state);
      }
      state = this.gameState.updateFellowship (f => ({
        ...f,
        companions: setup.fellowship.companions,
        guide: setup.fellowship.guide
      }), state);
      state = this.gameState.updateRegion (setup.fellowship.region, region => fromRegion.addFellowshipToRegion (region), state);
      return state;
    });
  }

  applyActions (actions: WotrAction[], front: WotrFrontId) {
    actions.forEach (action => this.applyAction (action, front));
  }

  private applyAction (action: WotrAction, front: WotrFrontId) {
    this.update (`Action [${action.type}]`, state => {
      state = { ...state, logs: [...state.logs, { type: "action", action, front }] };
      return this.actionAppliers[action.type] (action, front, state);
    });
  }

  private addLog (log: WotrLog) {
    this.update ("Add log", s => ({ ...s, logs: [...s.logs, log] }));
  }

  logSetup () { this.addLog ({ type: "setup" }); }
  logRound (roundNumber: number) { this.addLog ({ type: "round", roundNumber }); }
  logPhase (phase: WotrPhase) { this.addLog ({ type: "phase", phase: phase }); }
  logEndGame () { this.addLog ({ type: "endGame" }); }
  // logAction (action: WotrAction, front: WotrFrontId) { this.addLog ({ type: "action", action, front }); }
  // logNationTurn (nationId: WotrNationId) { this.addLog ({ type: "nation-turn", nationId: nationId }); }
  // logPopulationMarkerSet (populationMarker: number | null) { this.addLog ({ type: "population-marker-set", populationMarker }); }
  // logInfantryPlacement (landId: WotrLandRegionId, quantity: number) { this.addLog ({ type: "infantry-placement", landId, quantity }); }
  // logInfantryReinforcements (regionId: WotrRegionId, quantity: number) { this.addLog ({ type: "infantry-reinforcement", regionId, quantity }); }
  // // logMovement (movement: WotrMovement, player: string) { this.addLog ({ type: "movement", movement: movement, player: player }); }
  // // logExpedition (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "expedition", land: land, player: player }); }
  // // logNobleTitle (resources: WotrResourceType[], player: string) { this.addLog ({ type: "nobleTitle", resources: resources, player: player }); }
  // // logNewCity (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "newCity", land: land, player: player }); }
  // // logConstruction (construction: WotrConstruction, player: string) { this.addLog ({ type: "construction", construction: construction, player: player }); }
  // // logRecuitment (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "recruitment", land: land, player: player }); }
  // // logSetupPlacement (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "setupPlacement", land: land, player: player }); }

}
