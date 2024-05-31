import { Injectable, inject } from "@angular/core";
import { WotrActionLoggerMap } from "../commons/wotr-action-log";
import { WotrCharacterAction } from "./wotr-character-actions";
import { WotrCharacterId } from "./wotr-character.models";
import { WotrCharacterStore } from "./wotr-character.store";

@Injectable ({
  providedIn: "root"
})
export class WotrCharacterLogsService {

  private characterStore = inject (WotrCharacterStore);

  getActionLoggers (): WotrActionLoggerMap<WotrCharacterAction> {
    return {
      "character-elimination": (action, front, f) => [f.player (front), " removes ", this.characters (action.characters)],
      "character-movement": (action, front, f) => [f.player (front), " moves ", this.characters (action.characters), " to ", f.region (action.toRegion)],
      "character-play": (action, front, f) => [f.player (front), " plays ", this.characters (action.characters), " in ", f.region (action.region)],
      "companion-random": (action, front, f) => [f.player (front), " draws ", this.characters (action.companions), " randomly"],
      "companion-separation": (action, front, f) => [f.player (front), " separates ", this.characters (action.companions), " from the fellowship"],
      "nazgul-movement": (action, front, f) => [f.player (front), ` moves ${action.nNazgul} Nazgul from `, f.region (action.fromRegion), " to ", f.region (action.toRegion)],
   
    };
  }

  private characters (characters: WotrCharacterId[]) {
    return characters.map (c => this.characterStore.character (c).name).join (", ");
  }

}
