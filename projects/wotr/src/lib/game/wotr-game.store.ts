import { Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BgUser } from "@leobg/commons";
import { BgStore, arrayUtil } from "@leobg/commons/utils";
import { WotrBattleState, WotrBattleStore } from "../battle/wotr-battle.store";
import { WotrCharacterState, WotrCharacterStore } from "../companion/wotr-character.store";
import { WotrFellowship } from "../fellowship/wotr-fellowhip.models";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrFrontState, WotrFrontStore } from "../front/wotr-front.store";
import { WotrHuntState, WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrLog } from "../log/wotr-log.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrNationState, WotrNationStore } from "../nation/wotr-nation.store";
import { WotrPlayer } from "../player/wotr-player.models";
import { WotrRegionState, WotrRegionStore } from "../region/wotr-region.store";

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
  companionState: WotrCharacterState;
  fellowship: WotrFellowship;
  hunt: WotrHuntState;
  logs: WotrLog[];
  battle: WotrBattleState;
}

@Injectable ()
export class WotrGameStore extends BgStore<WotrGameState> {
  
  constructor (
    frontStore: WotrFrontStore,
    regionStore: WotrRegionStore,
    nationStore: WotrNationStore,
    companionStore: WotrCharacterStore,
    fellowshipStore: WotrFellowshipStore,
    huntStore: WotrHuntStore,
    logStore: WotrLogStore,
    battleStore: WotrBattleStore
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
      fellowship: fellowshipStore.init (),
      hunt: huntStore.init (),
      logs: logStore.init (),
      battle: battleStore.init ()
    }, "War of the Ring Game");
    frontStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, frontState: updater (s.frontState) }));
    frontStore.state = toSignal (this.select$ (s => s.frontState), { requireSync: true });
    regionStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, regionState: updater (s.regionState) }));
    regionStore.state = toSignal (this.select$ (s => s.regionState), { requireSync: true });
    nationStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, nationState: updater (s.nationState) }));
    nationStore.state = toSignal (this.select$ (s => s.nationState), { requireSync: true });
    companionStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, companionState: updater (s.companionState) }));
    companionStore.state = toSignal (this.select$ (s => s.companionState), { requireSync: true });
    fellowshipStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, fellowship: updater (s.fellowship) }));
    fellowshipStore.state = toSignal (this.select$ (s => s.fellowship), { requireSync: true });
    huntStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, hunt: updater (s.hunt) }));
    huntStore.state = toSignal (this.select$ (s => s.hunt), { requireSync: true });
    logStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, logs: updater (s.logs) }));
    logStore.state = toSignal (this.select$ (s => s.logs), { requireSync: true });
    battleStore.update = (actionName, updater) => this.update (actionName, s => ({ ...s, battle: updater (s.battle) }));
    battleStore.state = toSignal (this.select$ (s => s.battle), { requireSync: true });
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
  getGameId (): string { return this.get (s => s.gameId); }
  getGameOwner (): BgUser { return this.get (s => s.gameOwner); }
  getPlayers (): WotrPlayer[] { return this.get (s => s.players.ids.map (front => s.players.map[front])); }
  getPlayer (id: WotrFrontId): WotrPlayer { return this.get (s => s.players.map[id]); }

}
