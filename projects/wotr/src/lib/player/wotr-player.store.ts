import { Injectable, Signal, computed } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayer } from "./wotr-player.models";

export interface WotrPlayerState {
  map: Record<WotrFrontId, WotrPlayer>;
  ids: WotrFrontId[];
}

@Injectable ({
  providedIn: "root"
})
export class WotrPlayerStore {

  update!: (actionName: string, updater: (a: WotrPlayerState) => WotrPlayerState) => void;
  state!: Signal<WotrPlayerState>;

  init (): WotrPlayerState {
    return {
      map: { } as any,
      ids: []
    };
  }

  playerMap = computed (() => this.state ().map);
  players = computed (() => this.state ().ids.map (id => this.state ().map[id]));
  player (id: WotrFrontId): WotrPlayer { return this.state ().map[id]; }

}
