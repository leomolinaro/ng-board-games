import { Injectable } from "@angular/core";
import { BgUser } from "@leobg/commons";
import { BgStore, arrayUtil, immutableUtil } from "@leobg/commons/utils";
import { isCharacterCard, isStrategyCard } from "../wotr-components/card.models";
import { WotrCompanionComponentsService } from "../wotr-components/companion.service";
import { WotrFront } from "../wotr-components/front.models";
import { WotrFrontComponentsService } from "../wotr-components/front.service";
import { WotrMinionComponentsService } from "../wotr-components/minion.service";
import { WotrArmyUnitType, WotrCompanionId, WotrMinionId, WotrNationId } from "../wotr-components/nation.models";
import { WotrNationComponentsService } from "../wotr-components/nation.service";
import { WotrPhase } from "../wotr-components/phase.models";
import { WotrRegionId } from "../wotr-components/region.models";
import { WotrRegionComponentsService } from "../wotr-components/region.service";
import { WotrCompanionState, WotrFellowshipState, WotrFrontState, WotrGameState, WotrLog, WotrMinionState, WotrNationState, WotrPlayer, WotrPlayerId, WotrRegionState, WotrSetup } from "../wotr-game-state.models";
import { WotrDiscardCards, WotrDrawCards } from "../wotr-story.models";

@Injectable ()
export class WotrGameStore extends BgStore<WotrGameState> {

  constructor (
    fronts: WotrFrontComponentsService,
    regions: WotrRegionComponentsService,
    nations: WotrNationComponentsService,
    companions: WotrCompanionComponentsService,
    minions: WotrMinionComponentsService,
  ) {
    super ({
      gameId: "",
      gameOwner: null as any,
      players: { map: {}, ids: [] },
      fronts: fronts.toMap<WotrFrontState> (front => ({
        characterDeck: [],
        strategyDeck: [],
        handCards: [],
        tableCards: [],
        characterDiscardPile: [],
        strategyDiscardPile: []
      })),
      regions: regions.toMap<WotrRegionState> (regionId => ({
        fellowship: false,
        armyUnits: [],
        leaders: [],
        nNazgul: 0,
        companions: [],
        minions: []
      })),
      nations: nations.toMap<WotrNationState> (nationId => {
        const nation = nations.get (nationId);
        return {
          reinforcements: { regular: nation.nRegulars, elite: nation.nElites, leader: nation.nLeaders, nazgul: nation.nNazgul },
          eliminated: { regular: 0, elite: 0, leader: 0 },
          active: false,
          politicalStep: 3
        };
      }),
      companions: companions.toMap<WotrCompanionState> (companionId => ({ status: "available" })),
      minions: minions.toMap<WotrMinionState> (minionId => ({ status: "available" })),
      fellowhip: { status: "hidden", companions: [], guide: "gandalf-the-grey" },
      logs: [],
    }, "War of the Ring Game");
  } // constructor

  initGameState (players: WotrPlayer[], gameId: string, gameOwner: BgUser) {
    this.update ("Initial state", s => ({
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
      this.update ("End temporary state", s => ({ ...state }));
      this.notTemporaryState = null;
    } else {
      throw new Error ("endTemporaryState without startTemporaryState");
    } // if - else
  } // endTemporaryState

  selectRegions$ () { return this.select$ (s => s.regions); }
  selectNations$ () { return this.select$ (s => s.nations); }
  selectPlayerMap$ () { return this.select$ (s => s.players.map); }
  selectPlayers$ () {
    return this.select$ (
      this.select$ (s => s.players),
      (players) => players ? players.ids.map ((id) => players.map[id]) : []
    );
  } // selectPlayers$
  selectLogs$ () { return this.select$ (s => s.logs); }

  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): WotrPlayer[] { return this.get (s => s.players.ids.map ((id) => s.players.map[id])); }
  getPlayer (id: string): WotrPlayer { return this.get (s => s.players.map[id]); }
  getPlayerIdByFront (front: WotrFront): WotrPlayerId { return this.get (s => front === "free-peoples" ? s.players.ids[0] : s.players.ids[1]); }
  getNation (nationId: WotrNationId): WotrNationState { return this.get (s => s.nations[nationId]); }
  getRegion (regionId: WotrRegionId): WotrRegionState { return this.get (s => s.regions[regionId]); }

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

  private updateFront (front: WotrFront, updater: (a: WotrFrontState) => WotrFrontState, s: WotrGameState): WotrGameState {
    return { ...s, fronts: { ...s.fronts, [front]: updater (s.fronts[front]) } };
  }

  private updateRegion (regionId: WotrRegionId, updater: (a: WotrRegionState) => WotrRegionState, s: WotrGameState): WotrGameState {
    return { ...s, regions: { ...s.regions, [regionId]: updater (s.regions[regionId]) } };
  }

  private updateNation (nationId: WotrNationId, updater: (a: WotrNationState) => WotrNationState, s: WotrGameState): WotrGameState {
    return { ...s, nations: { ...s.nations, [nationId]: updater (s.nations[nationId]) } };
  }

  private updateCompanion (companionId: WotrCompanionId, updater: (a: WotrCompanionState) => WotrCompanionState, s: WotrGameState): WotrGameState {
    return { ...s, companions: { ...s.companions, [companionId]: updater (s.companions[companionId]) } };
  }

  private updateMinion (minionId: WotrMinionId, updater: (a: WotrMinionState) => WotrMinionState, s: WotrGameState): WotrGameState {
    return { ...s, minions: { ...s.minions, [minionId]: updater (s.minions[minionId]) } };
  }

  private updateFellowship (updater: (a: WotrFellowshipState) => WotrFellowshipState, s: WotrGameState): WotrGameState {
    return { ...s, fellowhip: updater (s.fellowhip) };
  }

  private addRegularsToRegion (nationId: WotrNationId, regionId: WotrRegionId, quantity: number, s: WotrGameState): WotrGameState {
    return this.addArmyUnitsToRegion ("regular", nationId, regionId, quantity, s);
  }

  private addElitesToRegion (nationId: WotrNationId, regionId: WotrRegionId, quantity: number, s: WotrGameState): WotrGameState {
    return this.addArmyUnitsToRegion ("elite", nationId, regionId, quantity, s);
  }

  private addArmyUnitsToRegion (unitType: WotrArmyUnitType, nationId: WotrNationId, regionId: WotrRegionId, quantity: number, s: WotrGameState): WotrGameState {
    return this.updateRegion (regionId, (region) => {
      const index = region.armyUnits.findIndex ((u) => u.type === unitType && u.nationId === nationId);
      if (index >= 0) {
        const unit = region.armyUnits[index];
        return {
          ...region,
          armyUnits: immutableUtil.listReplaceByIndex (index, { ...unit, quantity: unit.quantity + quantity }, region.armyUnits),
        };
      } else {
        return {
          ...region,
          armyUnits: immutableUtil.listPush ([{ type: unitType, nationId, quantity }], region.armyUnits),
        };
      } // if - else
    }, s);
  }

  private addLeadersToRegion (nationId: WotrNationId, regionId: WotrRegionId, quantity: number, s: WotrGameState): WotrGameState {
    return this.updateRegion (regionId, (region) => {
      const index = region.leaders.findIndex ((u) => u.nationId === nationId);
      if (index >= 0) {
        const unit = region.leaders[index];
        return {
          ...region,
          leaders: immutableUtil.listReplaceByIndex (index, { ...unit, quantity: unit.quantity + quantity }, region.leaders),
        };
      } else {
        return {
          ...region,
          leaders: immutableUtil.listPush ([{ nationId, quantity, type: "leader" }], region.leaders),
        };
      } // if - else
    }, s);
  }

  private addNazgulToRegion (regionId: WotrRegionId, quantity: number, s: WotrGameState): WotrGameState {
    return this.updateRegion (regionId, (region) => ({ ...region, nNazgul: region.nNazgul + quantity }), s);
  }

  private addFellowshipToRegion (regionId: WotrRegionId, s: WotrGameState): WotrGameState {
    return this.updateRegion (regionId, (region) => ({ ...region, fellowship: true }), s);
  }

  private removeRegularsFromReinforcements (nationId: WotrNationId, quantity: number, s: WotrGameState): WotrGameState {
    return this.updateNation (nationId, n => ({ ...n, reinforcements: { ...n.reinforcements, regular: n.reinforcements.regular - quantity } }), s);
  }

  private removeElitesFromReinforcements (nationId: WotrNationId, quantity: number, s: WotrGameState): WotrGameState {
    return this.updateNation (nationId, n => ({ ...n, reinforcements: { ...n.reinforcements, elite: n.reinforcements.elite - quantity } }), s);
  }

  private removeLeadersFromReinforcements (nationId: WotrNationId, quantity: number, s: WotrGameState): WotrGameState {
    return this.updateNation (nationId, n => ({ ...n, reinforcements: { ...n.reinforcements, leader: n.reinforcements.leader - quantity } }), s);
  }

  private removeNazgulFromReinforcements (nationId: WotrNationId, quantity: number, s: WotrGameState): WotrGameState {
    return this.updateNation (nationId, n => ({ ...n, reinforcements: { ...n.reinforcements, nazgul: n.reinforcements.nazgul - quantity } }), s);
  }

  applySetup (setup: WotrSetup) {
    this.update ("Setup", state => {
      for (const d of setup.decks) {
        state = this.updateFront (d.front, front => ({
          ...front,
          characterDeck: d.characterDeck,
          strategyDeck: d.strategyDeck
        }), state);
      }
      for (const r of setup.regions) {
        if (r.nRegulars) {
          state = this.removeRegularsFromReinforcements (r.nation, r.nRegulars, state);
          state = this.addRegularsToRegion (r.nation, r.region, r.nRegulars, state);
        }
        if (r.nElites) {
          state = this.removeElitesFromReinforcements (r.nation, r.nElites, state);
          state = this.addElitesToRegion (r.nation, r.region, r.nElites, state);
        }
        if (r.nLeaders) {
          state = this.removeLeadersFromReinforcements (r.nation, r.nLeaders, state);
          state = this.addLeadersToRegion (r.nation, r.region, r.nLeaders, state);
        }
        if (r.nNazgul) {
          state = this.removeNazgulFromReinforcements (r.nation, r.nNazgul, state);
          state = this.addNazgulToRegion (r.region, r.nNazgul, state);
        }
      }
      for (const n of setup.nations) {
        state = this.updateNation (n.nation, nation => ({
          ...nation,
          active: nation.active,
          politicalStep: nation.politicalStep
        }), state);
      }
      state = this.updateFellowship (f => ({
        ...f,
        companions: setup.fellowship.companions,
        guide: setup.fellowship.guide
      }), state);
      state = this.addFellowshipToRegion (setup.fellowship.region, state);
      return state;
    });
  } // applySetup

  applyDrawCards (action: WotrDrawCards, front: WotrFront) {
    this.update ("Draw cards", state => this.updateFront (front, f => ({
      ...f,
      handCards: immutableUtil.listPush (action.cards, f.handCards)
    }), state));
  }

  applyDiscardCards (action: WotrDiscardCards, front: WotrFront) {
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
  } // addLog

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

} // WotrGameStore
