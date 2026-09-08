import type { WotrCharacterId } from '../character/wotr-character-models';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrHuntTileId } from '../hunt/wotr-hunt-models';
import type { WotrLogFragment } from '../log/wotr-log-models';
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

export class WotrFragmentCreator {
  player(front: WotrFrontId): WotrLogFragment {
    return { type: 'player', front };
  }
  region(region: WotrRegionId): WotrLogFragment {
    return { type: 'region', region };
  }
  nation(nation: WotrNationId): WotrLogFragment {
    return { type: 'nation', nation };
  }
  character(character: WotrCharacterId): WotrLogFragment {
    return { type: 'character', character };
  }
  huntTile(
    huntTile: WotrHuntTileId,
    _options?: { hideFor?: WotrFrontId },
  ): WotrLogFragment {
    return { type: 'hunt-tile', tile: huntTile };
  }
}

export type WotrActionLogger<A> = (
  action: A,
  front: WotrFrontId,
  f: WotrFragmentCreator,
) => WotrLogFragment[];
export type WotrActionLoggerMap<A extends WotrAction> = {
  [key in A['type'] & string]: WotrActionLogger<{ type: key } & A>;
};

export type WotrEffectLogger<E> = (
  effect: E,
  f: WotrFragmentCreator,
) => WotrLogFragment[];
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
