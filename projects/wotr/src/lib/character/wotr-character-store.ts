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
    ids: [],
    map: {
      "gandalf-the-grey": initialCompanion(
        "gandalf-the-grey",
        "Gandalf the Grey",
        3,
        1,
        null,
        "all"
      ),
      "strider": initialCompanion("strider", "Strider", 3, 1, null, "north"),
      "boromir": initialCompanion("boromir", "Boromir", 2, 1, null, "gondor"),
      "legolas": initialCompanion("legolas", "Legolas", 2, 1, null, "elves"),
      "gimli": initialCompanion("gimli", "Gimli", 2, 1, null, "dwarves"),
      "meriadoc": initialCompanion("meriadoc", "Meriadoc", 1, 1, null, "all"),
      "peregrin": initialCompanion("peregrin", "Peregrin", 1, 1, null, "all"),
      "aragorn": initialCompanion("aragorn", "Aragorn", 3, 2, "actionDie", "all"),
      "gandalf-the-white": initialCompanion(
        "gandalf-the-white",
        "Gandalf the White",
        3,
        1,
        "actionDie",
        "all"
      ),
      "gollum": initialCompanion("gollum", "Gollum", 0, 0, null, null),
      "saruman": initialMinion("saruman", "Saruman", 0, 1, "actionDie", false),
      "the-mouth-of-sauron": initialMinion(
        "the-mouth-of-sauron",
        "The Mouth of Sauron",
        3,
        2,
        "actionDie",
        false
      ),
      "the-witch-king": initialMinion(
        "the-witch-king",
        "The Witch King",
        Number.MAX_SAFE_INTEGER,
        2,
        "actionDie",
        true
      ),
      // Kome
      "brand": initialRuler("brand", "Brand", 1, 2, 2, "north"),
      "dain": initialRuler("dain", "Dain", 1, 2, 4, "dwarves"),
      "denethor": initialRuler("denethor", "Denethor", 1, 1, 3, "gondor"),
      "theoden": initialRuler("theoden", "Theoden", 2, 1, 3, "rohan"),
      "thranduil": initialRuler("thranduil", "Thranduil", 2, 1, 4, "elves"),
      "the-black-serpent": initialDarkChieftains("the-black-serpent", "The Black Serpent", 2, 2),
      "the-shadow-of-mirkwood": initialDarkChieftains(
        "the-shadow-of-mirkwood",
        "The Shadow of Mirkwood",
        3,
        1
      ),
      "ugluk": initialDarkChieftains("ugluk", "Ugluk", 2, 1)
    },
    messengerOfTheDarkTowerUsed: false
  };
}

function initialCompanion(
  id: WotrCharacterId,
  name: string,
  level: number,
  leadership: number,
  dieBonus: "actionDie" | "rulerDie" | null,
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
  if (dieBonus) character.dieBonus = dieBonus;
  if (activationNation) character.activationNation = activationNation;
  return character;
}

function initialRuler(
  id: WotrCharacterId,
  name: string,
  level: number,
  awakenedLeadership: number,
  shadowResistance: number,
  activationNation: WotrNationId
): WotrCharacter {
  const character: WotrCharacter = {
    id,
    name,
    level,
    leadership: 1,
    status: "available",
    rulerStatus: "leader",
    awakenedLeadership,
    front: "free-peoples",
    dieBonus: "rulerDie",
    shadowResistance,
    activationNation,
    flying: false
  };
  return character;
}

function initialMinion(
  id: WotrCharacterId,
  name: string,
  level: number,
  leadership: number,
  dieBonus: "actionDie" | "rulerDie" | null,
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
  if (dieBonus) character.dieBonus = dieBonus;
  return character;
}

function initialDarkChieftains(
  id: WotrCharacterId,
  name: string,
  level: number,
  leadership: number
): WotrCharacter {
  const character: WotrCharacter = {
    id,
    name,
    level,
    leadership,
    status: "available",
    front: "shadow",
    dieBonus: "rulerDie",
    flying: false
  };
  return character;
}

@Injectable()
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

  setCharactersIds(ids: WotrCharacterId[]) {
    this.update("setCharactersIds", s => ({
      ...s,
      ids
    }));
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
