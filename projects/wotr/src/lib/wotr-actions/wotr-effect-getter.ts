import { Observable } from "rxjs";
import { WotrGameActionsService } from "./wotr-game-actions.service";

export type WotrEffectGetter<A> = (action: A, gameActions: WotrGameActionsService/* , front: WotrFrontId */) => Observable<unknown>;

export type WotrEffectGetterMap<A extends { type: string }> = { [key in A["type"]]: WotrEffectGetter<{ type: key } & A> };
