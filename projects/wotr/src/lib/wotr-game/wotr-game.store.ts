import { Injectable, computed } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BgUser } from "@leobg/commons";
import { BgStore, arrayUtil, immutableUtil } from "@leobg/commons/utils";
import { isCharacterCard, isStrategyCard } from "../wotr-components/wotr-card.models";
import { WotrCompanion, WotrCompanionId } from "../wotr-components/wotr-companion.models";
import * as fromCompanion from "../wotr-components/wotr-companion.state";
import { WotrFront, WotrFrontId } from "../wotr-components/wotr-front.models";
import * as fromFront from "../wotr-components/wotr-front.state";
import { WotrMinion, WotrMinionId } from "../wotr-components/wotr-minion.models";
import * as fromMinion from "../wotr-components/wotr-minion.state";
import { WotrNation, WotrNationId } from "../wotr-components/wotr-nation.models";
import * as fromNation from "../wotr-components/wotr-nation.state";
import { WotrPhase } from "../wotr-components/wotr-phase.models";
import { WotrRegion, WotrRegionId } from "../wotr-components/wotr-region.models";
import * as fromRegion from "../wotr-components/wotr-region.state";
import { WotrFellowshipState, WotrGameState, WotrLog, WotrPlayer, WotrSetup } from "../wotr-game-state.models";
import { WotrDiscardCards, WotrDrawCards } from "../wotr-story.models";

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
      fellowhip: { status: "hidden", companions: [], guide: "gandalf-the-grey" },
      logs: [],
    }, "War of the Ring Game");
  }

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

  private updateFront (frontId: WotrFrontId, updater: (a: WotrFront) => WotrFront, s: WotrGameState): WotrGameState {
    return { ...s, frontState: { ...s.frontState, map: { ...s.frontState.map, [frontId]: updater (s.frontState.map[frontId]) } } };
  }
  
  private updateRegion (regionId: WotrRegionId, updater: (a: WotrRegion) => WotrRegion, s: WotrGameState): WotrGameState {
    return { ...s, regionState: { ...s.regionState, map: { ...s.regionState.map, [regionId]: updater (s.regionState.map[regionId]) } } };
  }

  private updateNation (nationId: WotrNationId, updater: (a: WotrNation) => WotrNation, s: WotrGameState): WotrGameState {
    return { ...s, nationState: { ...s.nationState, map: { ...s.nationState.map, [nationId]: updater (s.nationState.map[nationId]) } } };
  }

  private updateCompanion (companionId: WotrCompanionId, updater: (a: WotrCompanion) => WotrCompanion, s: WotrGameState): WotrGameState {
    return { ...s, companionState: { ...s.companionState, map: { ...s.companionState.map, [companionId]: updater (s.companionState.map[companionId]) } } };
  }

  private updateMinion (minionId: WotrMinionId, updater: (a: WotrMinion) => WotrMinion, s: WotrGameState): WotrGameState {
    return { ...s, minionState: { ...s.minionState, map: { ...s.minionState.map, [minionId]: updater (s.minionState.map[minionId]) } } };
  }

  private updateFellowship (updater: (a: WotrFellowshipState) => WotrFellowshipState, s: WotrGameState): WotrGameState {
    return { ...s, fellowhip: updater (s.fellowhip) };
  }

  applySetup (setup: WotrSetup) {
    this.update ("Setup", state => {
      for (const d of setup.decks) {
        state = this.updateFront (d.front, front => {
          front = fromFront.setCharacterDeck (d.characterDeck, front);
          front = fromFront.setStrategyDeck (d.strategyDeck, front);
          return front;
        }, state);
      }
      for (const r of setup.regions) {
        const frontId = state.nationState.map[r.nation].front;
        if (r.nRegulars) {
          state = this.updateNation (r.nation, nation => fromNation.removeRegularsFromReinforcements (r.nRegulars, nation), state);
          state = this.updateRegion (r.region, region => fromRegion.addRegularsToRegion (r.nation, frontId, r.nRegulars, region), state);
        }
        if (r.nElites) {
          state = this.updateNation (r.nation, nation => fromNation.removeElitesFromReinforcements (r.nElites, nation), state);
          state = this.updateRegion (r.region, region => fromRegion.addElitesToRegion (r.nation, frontId, r.nElites, region), state);
        }
        if (r.nLeaders) {
          state = this.updateNation (r.nation, nation => fromNation.removeLeadersFromReinforcements (r.nLeaders, nation), state);
          state = this.updateRegion (r.region, region => fromRegion.addLeadersToRegion (r.nation, r.nLeaders, region), state);
        }
        if (r.nNazgul) {
          state = this.updateNation (r.nation, nation => fromNation.removeNazgulFromReinforcements (r.nNazgul, nation), state);
          state = this.updateRegion (r.region, region => fromRegion.addNazgulToRegion (r.nNazgul, region), state);
        }
      }
      for (const nationSetup of setup.nations) {
        state = this.updateNation (nationSetup.nation, nation => {
          nation = fromNation.setActive (nationSetup.active, nation);
          nation = fromNation.setPoliticalStep (nationSetup.politicalStep, nation);
          return nation;
        }, state);
      }
      state = this.updateFellowship (f => ({
        ...f,
        companions: setup.fellowship.companions,
        guide: setup.fellowship.guide
      }), state);
      state = this.updateRegion (setup.fellowship.region, region => fromRegion.addFellowshipToRegion (region), state);


      // Esempi
      state = this.updateFront ("free-peoples", f => ({ ...f, handCards: ["fpcha03", "fpstr14"] }), state);
      state = this.updateFront ("shadow", f => ({ ...f, handCards: ["scha21", "scha13", "sstr23"] }), state);
      state = this.updateFront ("free-peoples", f => ({ ...f, actionDice: ["character", "will-of-the-west", "event"] }), state);
      state = this.updateFront ("shadow", f => ({ ...f, actionDice: ["muster-army", "army", "character", "character", "event", "muster"] }), state);

      return state;
    });
  }

  applyDrawCards (action: WotrDrawCards, front: WotrFrontId) {
    this.update ("Draw cards", state => this.updateFront (front, f => ({
      ...f,
      handCards: immutableUtil.listPush (action.cards, f.handCards)
    }), state));
  }

  applyDiscardCards (action: WotrDiscardCards, front: WotrFrontId) {
    this.update ("Discard cards", state => this.updateFront (front, f => {
      let characterDiscardPile = f.characterDiscardPile;
      let strategyDiscardPile = f.strategyDiscardPile;
      let handCards = f.handCards;
      for (const card of action.cards) {
        handCards = immutableUtil.listRemoveFirst (c => c === card, handCards);
        if (isCharacterCard (card)) { characterDiscardPile = immutableUtil.listPush ([card], characterDiscardPile); }
        if (isStrategyCard (card)) { strategyDiscardPile = immutableUtil.listPush ([card], strategyDiscardPile); }
      }
      return {
        ...f,
        handCards,
        characterDiscardPile,
        strategyDiscardPile
      };
    }, state));
  }

  private addLog (log: WotrLog) {
    this.update ("Add log", s => ({ ...s, logs: [...s.logs, log] }));
  }

  logSetup () { this.addLog ({ type: "setup" }); }
  logRound (roundNumber: number) { this.addLog ({ type: "round", roundNumber }); }
  logPhase (phase: WotrPhase) { this.addLog ({ type: "phase", phase: phase }); }
  logEndGame () { this.addLog ({ type: "endGame" }); }
  // logNationTurn (nationId: WotrNationId) { this.addLog ({ type: "nation-turn", nationId: nationId }); }
  // logPopulationMarkerSet (populationMarker: number | null) { this.addLog ({ type: "population-marker-set", populationMarker }); }
  // logInfantryPlacement (landId: WotrLandRegionId, quantity: number) { this.addLog ({ type: "infantry-placement", landId, quantity }); }
  // logInfantryReinforcements (regionId: WotrRegionId, quantity: number) { this.addLog ({ type: "infantry-reinforcement", regionId, quantity }); }
  // logArmyMovement (units: WotrRegionUnit[], toRegionId: WotrRegionId) { this.addLog ({ type: "army-movement", units, toRegionId }); }
  // // logMovement (movement: WotrMovement, player: string) { this.addLog ({ type: "movement", movement: movement, player: player }); }
  // // logExpedition (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "expedition", land: land, player: player }); }
  // // logNobleTitle (resources: WotrResourceType[], player: string) { this.addLog ({ type: "nobleTitle", resources: resources, player: player }); }
  // // logNewCity (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "newCity", land: land, player: player }); }
  // // logConstruction (construction: WotrConstruction, player: string) { this.addLog ({ type: "construction", construction: construction, player: player }); }
  // // logRecuitment (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "recruitment", land: land, player: player }); }
  // // logSetupPlacement (land: WotrLandCoordinates, player: string) { this.addLog ({ type: "setupPlacement", land: land, player: player }); }

}
