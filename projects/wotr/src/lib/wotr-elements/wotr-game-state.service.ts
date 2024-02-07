import { Injectable } from "@angular/core";
import { WotrCompanion, WotrCompanionId } from "./wotr-companion.models";
import { WotrFellowship } from "./wotr-fellowhip.models";
import { WotrFront, WotrFrontId } from "./wotr-front.models";
import { WotrGameState } from "./wotr-game.state";
import { WotrHuntState } from "./wotr-hunt.state";
import { WotrMinion, WotrMinionId } from "./wotr-minion.models";
import { WotrNation, WotrNationId } from "./wotr-nation.models";
import { WotrRegion, WotrRegionId } from "./wotr-region.models";

@Injectable ({
  providedIn: "root"
})
export class WotrGameStateService {

  updateFront (frontId: WotrFrontId, updater: (a: WotrFront) => WotrFront, s: WotrGameState): WotrGameState {
    return { ...s, frontState: { ...s.frontState, map: { ...s.frontState.map, [frontId]: updater (s.frontState.map[frontId]) } } };
  }
  
  updateRegion (regionId: WotrRegionId, updater: (a: WotrRegion) => WotrRegion, s: WotrGameState): WotrGameState {
    return { ...s, regionState: { ...s.regionState, map: { ...s.regionState.map, [regionId]: updater (s.regionState.map[regionId]) } } };
  }

  updateNation (nationId: WotrNationId, updater: (a: WotrNation) => WotrNation, s: WotrGameState): WotrGameState {
    return { ...s, nationState: { ...s.nationState, map: { ...s.nationState.map, [nationId]: updater (s.nationState.map[nationId]) } } };
  }

  updateCompanion (companionId: WotrCompanionId, updater: (a: WotrCompanion) => WotrCompanion, s: WotrGameState): WotrGameState {
    return { ...s, companionState: { ...s.companionState, map: { ...s.companionState.map, [companionId]: updater (s.companionState.map[companionId]) } } };
  }

  updateMinion (minionId: WotrMinionId, updater: (a: WotrMinion) => WotrMinion, s: WotrGameState): WotrGameState {
    return { ...s, minionState: { ...s.minionState, map: { ...s.minionState.map, [minionId]: updater (s.minionState.map[minionId]) } } };
  }

  updateFellowship (updater: (a: WotrFellowship) => WotrFellowship, s: WotrGameState): WotrGameState {
    return { ...s, fellowhip: updater (s.fellowhip) };
  }

  updateHunt (updater: (a: WotrHuntState) => WotrHuntState, s: WotrGameState): WotrGameState {
    return { ...s, hunt: updater (s.hunt) };
  }

}
