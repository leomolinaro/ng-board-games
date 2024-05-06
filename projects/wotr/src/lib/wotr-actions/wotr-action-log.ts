import { WotrCompanionId } from "../wotr-elements/companion/wotr-companion.models";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrHuntTileId } from "../wotr-elements/hunt/wotr-hunt.models";
import { WotrNationId } from "../wotr-elements/nation/wotr-nation.models";
import { WotrRegionId } from "../wotr-elements/region/wotr-region.models";

export interface WotrFragmentCreator<F> {
  player (front: WotrFrontId): F;
  region (region: WotrRegionId): F;
  nation (nation: WotrNationId): F;
  companion (companionId: WotrCompanionId): F;
  huntTile (huntTile: WotrHuntTileId): F;
}
export type WotrActionLogger<A, F = any> = (action: A, front: WotrFrontId, f: WotrFragmentCreator<F>) => F[];

export type WotrActionLoggerMap<A extends { type: string }> = { [key in A["type"]]: WotrActionLogger<{ type: key } & A> };
