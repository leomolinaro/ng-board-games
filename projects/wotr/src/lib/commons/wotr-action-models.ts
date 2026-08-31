import type { WotrCharacterId } from '../character/wotr-character-models';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrHuntTileId } from '../hunt/wotr-hunt-models';
import type { WotrNationId } from '../nation/wotr-nation-models';
import type { WotrRegionId } from '../region/wotr-region-models';

export interface WotrAction {
  type: string;
}

export function findAction<A extends WotrAction>(
  actions: WotrAction[],
  ...actionTypes: A['type'][]
): A | undefined {
  const foundAction = actions.find((a) => actionTypes.includes(a.type)) as A;
  if (foundAction) return foundAction;
  return undefined;
}

export function findActions<A extends WotrAction>(
  actions: WotrAction[],
  ...actionTypes: A['type'][]
): A[] {
  return actions.filter((a) => actionTypes.includes(a.type)) as A[];
}

export interface WotrFragmentCreator<F> {
  player(front: WotrFrontId): F;
  region(region: WotrRegionId): F;
  nation(nation: WotrNationId): F;
  character(characterId: WotrCharacterId): F;
  huntTile(huntTile: WotrHuntTileId, options?: { hideFor?: WotrFrontId }): F;
}

export type WotrActionLogger<A, F = any> = (
  action: A,
  front: WotrFrontId,
  f: WotrFragmentCreator<F>,
) => F[];
export type WotrActionLoggerMap<A extends WotrAction> = {
  [key in A['type']]: WotrActionLogger<{ type: key } & A>;
};

export type WotrEffectLogger<E, F = any> = (
  effect: E,
  f: WotrFragmentCreator<F>,
) => F[];
export type WotrEffectLoggerMap<E extends WotrAction> = {
  [key in E['type']]: WotrEffectLogger<{ type: key } & E>;
};

export type WotrActionApplier<A extends WotrAction> = (
  action: A,
  front: WotrFrontId,
) => void | Promise<void>;
export type WotrActionApplierMap<A extends WotrAction> = {
  [key in A['type']]: WotrActionApplier<{ type: key } & A>;
};

export type WotrStoryApplier<S extends WotrStory> = (
  story: S,
  front: WotrFrontId,
) => void | Promise<void>;

export type WotrStoryApplierMap<S extends WotrStory> = {
  [key in S['type']]: WotrStoryApplier<{ type: key } & S>;
};

export interface WotrStory {
  type: string;
}
