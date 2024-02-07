import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrGameState } from "../wotr-elements/wotr-game.state";

export type WotrActionApplier<A> = (action: A, front: WotrFrontId, state: WotrGameState) => WotrGameState;
