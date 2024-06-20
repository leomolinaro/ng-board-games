import { WotrCharacterId } from "../companion/wotr-character.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrHuntTileId } from "../hunt/wotr-hunt.models";
import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrRegionId } from "../region/wotr-region.models";

export interface WotrFragmentCreator<F> {
  player (front: WotrFrontId): F;
  region (region: WotrRegionId): F;
  nation (nation: WotrNationId): F;
  character (characterId: WotrCharacterId): F;
  huntTile (huntTile: WotrHuntTileId): F;
}
export type WotrActionLogger<A, F = any> = (action: A, front: WotrFrontId, f: WotrFragmentCreator<F>) => F[];
export type WotrEffectLogger<E, F = any> = (effect: E, f: WotrFragmentCreator<F>) => F[];

export type WotrActionLoggerMap<A extends { type: string }> = { [key in A["type"]]: WotrActionLogger<{ type: key } & A> };
export type WotrEffectLoggerMap<E extends { type: string }> = { [key in E["type"]]: WotrEffectLogger<{ type: key } & E> };
