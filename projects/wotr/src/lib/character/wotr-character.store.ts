import { Injectable, Signal, computed } from "@angular/core";
import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrCharacter, WotrCharacterId } from "./wotr-character.models";

export interface WotrCharacterState {
  ids: WotrCharacterId[];
  map: Record<WotrCharacterId, WotrCharacter>;
}

@Injectable ({
  providedIn: "root"
})
export class WotrCharacterStore {

  update!: (actionName: string, updater: (a: WotrCharacterState) => WotrCharacterState) => void;
  state!: Signal<WotrCharacterState>;

  characterById = computed (() => this.state ().map);
  characters = computed (() => { const s = this.state (); return s.ids.map (id => s.map[id]); });
  character (characterId: WotrCharacterId): WotrCharacter { return this.state ().map[characterId]; }
  isInPlay (characterId: WotrCharacterId): boolean { return this.state ().map[characterId].status === "inPlay"; }

  init (): WotrCharacterState {
    return {
      ids: [
        "gandalf-the-grey", "strider", "boromir", "legolas",
        "gimli", "meriadoc", "peregrin", "aragorn", "gandalf-the-white",
        "gollum",
        "saruman", "the-mouth-of-sauron", "the-witch-king"
      ],
      map: {
        "gandalf-the-grey": this.initCompanion ("gandalf-the-grey", "Gandalf the Grey", 3, 1, "all"),
        strider: this.initCompanion ("strider", "Strider", 3, 1, "north"),
        boromir: this.initCompanion ("boromir", "Boromir", 2, 1, "gondor"),
        legolas: this.initCompanion ("legolas", "Legolas", 2, 1, "elves"),
        gimli: this.initCompanion ("gimli", "Gimli", 2, 1, "dwarves"),
        meriadoc: this.initCompanion ("meriadoc", "Meriadoc", 1, 1, "all"),
        peregrin: this.initCompanion ("peregrin", "Peregrin", 1, 1, "all"),
        aragorn: this.initCompanion ("aragorn", "Aragorn", 3, 2, "all"),
        "gandalf-the-white": this.initCompanion ("gandalf-the-white", "Gandalf the White", 3, 1, "all"),
        gollum: this.initCompanion ("gollum", "Gollum", 0, 0, null),
        saruman: this.initMinion ("saruman", "Saruman", 0, 1),
        "the-mouth-of-sauron": this.initMinion ("the-mouth-of-sauron", "The Mouth of Sauron", 3, 2),
        "the-witch-king": this.initMinion ("the-witch-king", "The Witch King", -1, 2),
      }
    };
  }

  private initCompanion (
    id: WotrCharacterId, name: string,
    level: number, leadership: number,
    activationNation: WotrNationId | "all" | null
  ): WotrCharacter {
    const character: WotrCharacter = { id, name, level, leadership, status: "available", front: "free-peoples" };
    if (activationNation) { character.activationNation = activationNation; }
    return character;
  }

  private initMinion (
    id: WotrCharacterId, name: string,
    level: number, leadership: number
  ): WotrCharacter {
    return { id, name, level, leadership, status: "available", front: "shadow" };
  }

  private updateCharacter (actionName: string, characterId: WotrCharacterId, updater: (a: WotrCharacter) => WotrCharacter) {
    this.update (actionName, s => ({ ...s, map: { ...s.map, [characterId]: updater (s.map[characterId]) } }));
  }

  setEliminated (characterId: WotrCharacterId) {
    this.updateCharacter ("setEliminated", characterId, character => ({
      ...character,
      status: "eliminated"
    }));
  }

  setInPlay (characterId: WotrCharacterId) {
    this.updateCharacter ("setInPlay", characterId, character => ({
      ...character,
      status: "inPlay"
    }));
  }

  setInFellowship (characterId: WotrCharacterId) {
    this.updateCharacter ("setInFellowship", characterId, character => ({
      ...character,
      status: "inFellowship"
    }));
  }

}
