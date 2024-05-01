import { WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrHuntTile } from "../wotr-elements/wotr-hunt.models";
import { WotrRegionId } from "../wotr-elements/wotr-region.models";

interface WotrFragmentCreator<F> {
  player (front: WotrFrontId): F;
  region (region: WotrRegionId): F;
  string (label: string): F;
  companion (companionId: WotrCompanionId): F;
  huntTile (huntTile: WotrHuntTile): F;
}
export type WotrActionLogger<A, F = any> = (action: A, front: WotrFrontId, f: WotrFragmentCreator<F>) => F[];

export type WotrActionLoggerMap<A extends { type: string }> = { [key in A["type"]]: WotrActionLogger<{ type: key } & A> };
