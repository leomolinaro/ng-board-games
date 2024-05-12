import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";

export type WotrActionEffect<A> = (action: A, front: WotrFrontId) => Promise<void>;

export type WotrActionEffectMap<A extends { type: string }> = { [key in A["type"]]: WotrActionEffect<{ type: key } & A> };
