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
import { WotrSetup } from "../wotr-rules/wotr-rules-setup.service";
import { WotrAction } from "../wotr-story.models";
import { WotrCompanionState, WotrCompanionStore } from "./wotr-companion.store";
import { WotrFellowship } from "./wotr-fellowhip.models";
import { WotrFellowshipStore } from "./wotr-fellowship.store";
import { WotrFrontId } from "./wotr-front.models";
import { WotrFrontState, WotrFrontStore } from "./wotr-front.store";
import { WotrHuntState, WotrHuntStore } from "./wotr-hunt.store";
import { WotrLog } from "./wotr-log.models";
import { WotrMinionState, WotrMinionStore } from "./wotr-minion.store";
import { WotrNation, WotrNationId } from "./wotr-nation.models";
import { WotrNationState, WotrNationStore } from "./wotr-nation.store";
import { WotrPhase } from "./wotr-phase.models";
import { WotrPlayer } from "./wotr-player.models";
import { WotrRegion, WotrRegionId } from "./wotr-region.models";
import { WotrRegionState, WotrRegionStore } from "./wotr-region.store";

export interface WotrGameState {
  gameId: string;
  gameOwner: BgUser;
  players: {
    map: Record<WotrFrontId, WotrPlayer>;
    ids: WotrFrontId[];
  };
  frontState: WotrFrontState;
  regionState: WotrRegionState;
  nationState: WotrNationState;
  companionState: WotrCompanionState;
  minionState: WotrMinionState;
  fellowship: WotrFellowship;
  hunt: WotrHuntState;
  logs: WotrLog[];
}

@Injectable ()
export class WotrGameStore extends BgStore<WotrGameState> {
  
  constructor (
    private frontStore: WotrFrontStore,
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    private companionStore: WotrCompanionStore,
    private minionStore: WotrMinionStore,
    private fellowshipStore: WotrFellowshipStore,
    private huntStore: WotrHuntStore,
  ) {
    super ({
      gameId: "",
      gameOwner: null as any,
      players: {
        map: { } as any,
        ids: []
      },
      frontState: frontStore.init (),
      regionState: regionStore.init (),
      nationState: nationStore.init (),
      companionState: companionStore.init (),
      minionState: minionStore.init (),
      fellowship: fellowshipStore.init (),
      hunt: huntStore.init (),
      logs: [],
    }, "War of the Ring Game");
    frontStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, frontState: updater (s.frontState) }));
    regionStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, regionState: updater (s.regionState) }));
    nationStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, nationState: updater (s.nationState) }));
    companionStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, companionState: updater (s.companionState) }));
    minionStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, minionState: updater (s.minionState) }));
    fellowshipStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, fellowship: updater (s.fellowship) }));
    huntStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, hunt: updater (s.hunt) }));
  }

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
  regions = computed (() => this.regionStore.getRegions (this.regionState ()));
  getRegion (regionId: WotrRegionId): WotrRegion { return this.regionState ().map[regionId]; }

  private companionState = toSignal (this.select$ (s => s.companionState), { requireSync: true });
  companionById = computed (() => this.companionState ().map);
  companions = computed (() => this.companionStore.getCompanions (this.companionState ()));

  private minionState = toSignal (this.select$ (s => s.minionState), { requireSync: true });
  minionById = computed (() => this.minionState ().map);
  minions = computed (() => this.minionStore.getMinions (this.minionState ()));

  logs$ = this.select$ (s => s.logs);
  
  private nationState = toSignal (this.select$ (s => s.nationState), { requireSync: true });
  freePeopleNations = computed (() => this.nationStore.getFreePeopleNations (this.nationState ()));
  shadowNations = computed (() => this.nationStore.getShadowNations (this.nationState ()));
  nationById = computed (() => this.nationState ().map);
  getNation (nationId: WotrNationId): WotrNation { return this.nationState ().map[nationId]; }

  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): WotrPlayer[] { return this.get (s => s.players.ids.map (front => s.players.map[front])); }
  getPlayer (id: WotrFrontId): WotrPlayer { return this.get (s => s.players.map[id]); }

  applySetup (setup: WotrSetup) {

    for (const d of setup.decks) {
      this.frontStore.setCharacterDeck (d.characterDeck, d.front);
      this.frontStore.setStrategyDeck (d.strategyDeck, d.front);
    }

    this.addLog ("Add log setup", { type: "setup" });
    
    for (const r of setup.regions) {
      const frontId = this.nationById ()[r.nation].front;
      if (r.nRegulars) {
        this.nationStore.removeRegularsFromReinforcements (r.nRegulars, r.nation);
        this.regionStore.addRegularsToRegion (r.nation, frontId, r.nRegulars, r.region);
      }
      if (r.nElites) {
        this.nationStore.removeElitesFromReinforcements (r.nElites, r.nation);
        this.regionStore.addElitesToRegion (r.nation, frontId, r.nElites, r.region);
      }
      if (r.nLeaders) {
        this.nationStore.removeLeadersFromReinforcements (r.nLeaders, r.nation);
        this.regionStore.addLeadersToRegion (r.nation, r.nLeaders, r.region);
      }
      if (r.nNazgul) {
        this.nationStore.removeNazgulFromReinforcements (r.nNazgul);
        this.regionStore.addNazgulToRegion (r.nNazgul, r.region);
      }
    }
    for (const nationSetup of setup.nations) {
      this.nationStore.setActive (nationSetup.active, nationSetup.nation);
      this.nationStore.setPoliticalStep (nationSetup.politicalStep, nationSetup.nation);
    }
    this.fellowshipStore.setCompanions (setup.fellowship.companions);
    this.fellowshipStore.setGuide (setup.fellowship.guide);
    this.regionStore.addFellowshipToRegion (setup.fellowship.region);
  }

  applyActions (actions: WotrAction[], front: WotrFrontId) {
    actions.forEach (action => this.applyAction (action, front));
  }

  private applyAction (action: WotrAction, front: WotrFrontId) {
    this.addLog (`Log action [${action.type}]`, { type: "action", action, front });
    this.actionAppliers[action.type] (action, front);
  }

  private addLog (actionName: string, log: WotrLog) {
    return this.update (actionName, s => ({ ...s, logs: [...s.logs, log] }));
  }

  logSetup () { this.addLog ("Log setup", { type: "setup" }); }
  logRound (roundNumber: number) { this.addLog ("Log round", { type: "round", roundNumber }); }
  logPhase (phase: WotrPhase) { this.addLog ("Log phase", { type: "phase", phase: phase }); }
  logEndGame () { this.addLog ("Log end game", { type: "endGame" }); }
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
