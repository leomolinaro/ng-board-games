import { WotrFrontId } from "../front/wotr-front.models";

export type WotrActionApplier<A> = (action: A, front: WotrFrontId) => Promise<void>;

export type WotrActionApplierMap<A extends { type: string }> = { [key in A["type"]]: WotrActionApplier<{ type: key } & A> };