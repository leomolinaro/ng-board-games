import { BgUser } from "@leobg/commons";
import { WotrCompanionState } from "./wotr-companion.state";
import { WotrFellowship } from "./wotr-fellowhip.models";
import { WotrFrontId } from "./wotr-front.models";
import { WotrFrontState } from "./wotr-front.state";
import { WotrLog } from "./wotr-log.models";
import { WotrMinionState } from "./wotr-minion.state";
import { WotrNationState } from "./wotr-nation.state";
import { WotrPlayer } from "./wotr-player.models";
import { WotrRegionState } from "./wotr-region.state";

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
  fellowhip: WotrFellowship;
  companionState: WotrCompanionState;
  minionState: WotrMinionState;
  logs: WotrLog[];
}
