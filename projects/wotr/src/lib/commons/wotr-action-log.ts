import { WotrCompanionId } from "../companion/wotr-companion.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrMinionId } from "../minion/wotr-minion.models";
import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrRegionId } from "../region/wotr-region.models";

export interface WotrFragmentCreator<F> {
  player (front: WotrFrontId): F;
  region (region: WotrRegionId): F;
  nation (nation: WotrNationId): F;
  companion (companionId: WotrCompanionId): F;
  minion (minionId: WotrMinionId): F;
  huntTile (huntTile: WotrHuntTileId): F;
}
export type WotrActionLogger<A, F = any> = (action: A, front: WotrFrontId, f: WotrFragmentCreator<F>) => F[];

export type WotrActionLoggerMap<A extends { type: string }> = { [key in A["type"]]: WotrActionLogger<{ type: key } & A> };
