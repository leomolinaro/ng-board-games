import { Injectable, Signal, computed } from "@angular/core";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrCharacter, WotrCharacterId } from "./wotr-character-models";

export interface WotrCharacterState {
  ids: WotrCharacterId[];
  map: Record<WotrCharacterId, WotrCharacter>;
  messengerOfTheDarkTowerUsed: boolean;
}

export function initialeState(): WotrCharacterState {
  return {
    ids: [
      "gandalf-the-grey",
      "strider",
      "boromir",
      "legolas",
      "gimli",
      "meriadoc",
      "peregrin",
      "aragorn",
      "gandalf-the-white",
      "gollum",
      "saruman",
      "the-mouth-of-sauron",
      "the-witch-king"
    ],
    map: {
      "gandalf-the-grey": initialCompanion("gandalf-the-grey", "Gandalf the Grey", 3, 1, 0, "all"),
      "strider": initialCompanion("strider", "Strider", 3, 1, 0, "north"),
      "boromir": initialCompanion("boromir", "Boromir", 2, 1, 0, "gondor"),
      "legolas": initialCompanion("legolas", "Legolas", 2, 1, 0, "elves"),
      "gimli": initialCompanion("gimli", "Gimli", 2, 1, 0, "dwarves"),
      "meriadoc": initialCompanion("meriadoc", "Meriadoc", 1, 1, 0, "all"),
      "peregrin": initialCompanion("peregrin", "Peregrin", 1, 1, 0, "all"),
      "aragorn": initialCompanion("aragorn", "Aragorn", 3, 2, 1, "all"),
      "gandalf-the-white": initialCompanion(
        "gandalf-the-white",
        "Gandalf the White",
        3,
        1,
        1,
        "all"
      ),
      "gollum": initialCompanion("gollum", "Gollum", 0, 0, 0, null),
      "saruman": initialMinion("saruman", "Saruman", 0, 1, 1, false),
      "the-mouth-of-sauron": initialMinion(
        "the-mouth-of-sauron",
        "The Mouth of Sauron",
        3,
        2,
        1,
        false
      ),
      "the-witch-king": initialMinion(
        "the-witch-king",
        "The Witch King",
        Number.MAX_SAFE_INTEGER,
        2,
        1,
        true
      )
    },
    messengerOfTheDarkTowerUsed: false
  };
}

function initialCompanion(
  id: WotrCharacterId,
  name: string,
  level: number,
  leadership: number,
  actionDiceBonus: number,
  activationNation: WotrNationId | "all" | null
): WotrCharacter {
  const character: WotrCharacter = {
    id,
    name,
    level,
    leadership,
    status: "available",
    front: "free-peoples",
    flying: false
  };
  if (actionDiceBonus) {
    character.actionDiceBonus = actionDiceBonus;
  }
  if (activationNation) {
    character.activationNation = activationNation;
  }
  return character;
}

function initialMinion(
  id: WotrCharacterId,
  name: string,
  level: number,
  leadership: number,
  actionDiceBonus: number,
  flying: boolean
): WotrCharacter {
  const character: WotrCharacter = {
    id,
    name,
    level,
    leadership,
    status: "available",
    front: "shadow",
    flying
  };
  if (actionDiceBonus) {
    character.actionDiceBonus = actionDiceBonus;
  }
  return character;
}

@Injectable({ providedIn: "root" })
export class WotrCharacterStore {
  update!: (actionName: string, updater: (a: WotrCharacterState) => WotrCharacterState) => void;
  state!: Signal<WotrCharacterState>;

  characterById = computed(() => this.state().map);
  characters = computed(() => {
    const s = this.state();
    return s.ids.map(id => s.map[id]);
  });
  minions = computed(() => {
    return this.characters().filter(c => c.front === "shadow");
  });
  companions = computed(() => {
    return this.characters().filter(c => c.front === "free-peoples");
  });
  character(characterId: WotrCharacterId): WotrCharacter {
    return this.state().map[characterId];
  }
  messengerOfTheDarkTowerUsed() {
    return this.state().messengerOfTheDarkTowerUsed;
  }

  private updateCharacter(
    actionName: string,
    characterId: WotrCharacterId,
    updater: (a: WotrCharacter) => WotrCharacter
  ) {
    this.update(actionName, s => ({
      ...s,
      map: { ...s.map, [characterId]: updater(s.map[characterId]) }
    }));
  }

  setEliminated(characterId: WotrCharacterId) {
    this.updateCharacter("setEliminated", characterId, character => ({
      ...character,
      status: "eliminated"
    }));
  }

  setInPlay(characterId: WotrCharacterId) {
    this.updateCharacter("setInPlay", characterId, character => ({
      ...character,
      status: "inPlay"
    }));
  }

  setInFellowship(characterId: WotrCharacterId) {
    this.updateCharacter("setInFellowship", characterId, character => ({
      ...character,
      status: "inFellowship"
    }));
  }

  setMessengerOfTheDarkTowerUsed() {
    this.update("setMessengerOfTheDarkTowerUsed", s => ({
      ...s,
      messengerOfTheDarkTowerUsed: true
    }));
  }

  resetMessengerOfTheDarkTower() {
    this.update("resetMessengerOfTheDarkTower", s => ({
      ...s,
      messengerOfTheDarkTowerUsed: false
    }));
  }
}
