import { WotrMinion, WotrMinionId } from "./wotr-minion.models";

export interface WotrMinionState {
  ids: WotrMinionId[];
  map: Record<WotrMinionId, WotrMinion>;
}

export function initMinionState (): WotrMinionState {
  return {
    ids: ["saruman", "the-mouth-of-sauron", "the-witch-king"],
    map: {
      saruman: initMinion ("saruman", "Saruman", 0, 1),
      "the-mouth-of-sauron": initMinion ("the-mouth-of-sauron", "The Mouth of Sauron", 3, 2),
      "the-witch-king": initMinion ("the-witch-king", "The Witch King", -1, 2),
    }
  };
}

function initMinion (
  id: WotrMinionId, name: string,
  level: number, leadership: number
): WotrMinion {
  return { id, name, level, leadership, status: "available" };
}

export function getMinion (id: WotrMinionId, state: WotrMinionState) { return state.map[id]; }
export function getMinions (state: WotrMinionState) { return state.ids.map (id => state.map[id]); }
