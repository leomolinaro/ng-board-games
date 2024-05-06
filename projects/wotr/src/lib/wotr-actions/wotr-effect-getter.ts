import { Observable } from "rxjs";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrGameActionsService } from "./wotr-game-actions.service";

export type WotrEffectGetter<A> = (action: A, front: WotrFrontId, gameActions: WotrGameActionsService) => Observable<unknown>;

export type WotrEffectGetterMap<A extends { type: string }> = { [key in A["type"]]: WotrEffectGetter<{ type: key } & A> };
