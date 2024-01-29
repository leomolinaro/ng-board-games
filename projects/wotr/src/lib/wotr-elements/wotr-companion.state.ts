import { WotrCompanion, WotrCompanionId } from "./wotr-companion.models";

export interface WotrCompanionState {
  ids: WotrCompanionId[];
  map: Record<WotrCompanionId, WotrCompanion>;
}

export function initCompanionState (): WotrCompanionState {
  return {
    ids: [
      "gandalf-the-grey", "strider", "boromir", "legolas",
      "gimli", "meriadoc", "peregrin", "aragorn", "gandalf-the-white"
    ],
    map: {
      "gandalf-the-grey": initCompanion ("gandalf-the-grey", "Gandalf the Grey", 3, 1),
      strider: initCompanion ("strider", "Strider", 3, 1),
      boromir: initCompanion ("boromir", "Boromir", 2, 1),
      legolas: initCompanion ("legolas", "Legolas", 2, 1),
      gimli: initCompanion ("gimli", "Gimli", 2, 1),
      meriadoc: initCompanion ("meriadoc", "Meriadoc", 1, 1),
      peregrin: initCompanion ("peregrin", "Peregrin", 1, 1),
      aragorn: initCompanion ("aragorn", "Aragorn", 3, 2),
      "gandalf-the-white": initCompanion ("gandalf-the-white", "Gandalf the White", 3, 1)
    }
  };
}

function initCompanion (
  id: WotrCompanionId, name: string,
  level: number, leadership: number
): WotrCompanion {
  return { id, name, level, leadership, status: "available" };
}

export function getCompanion (id: WotrCompanionId, state: WotrCompanionState) { return state.map[id]; }
export function getCompanions (state: WotrCompanionState) { return state.ids.map (id => state.map[id]); }
