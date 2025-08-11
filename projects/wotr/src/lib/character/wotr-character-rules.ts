import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrRegion } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrAragorn } from "./characters/aragorn";
import { WotrBoromir } from "./characters/boromir";
import { WotrGandalfTheGrey } from "./characters/gandalf-the-grey";
import { WotrGandalfTheWhite } from "./characters/gandalf-the-white";
import { WotrGimli } from "./characters/gimli";
import { WotrGollum } from "./characters/gollum";
import { WotrLegolas } from "./characters/legolas";
import { WotrMeriadoc } from "./characters/meriadoc";
import { WotrPeregrin } from "./characters/peregrin";
import { WotrSaruman } from "./characters/saruman";
import { WotrStrider } from "./characters/strider";
import { WotrMouthOfSauron } from "./characters/the-mouth-of-sauron";
import { WotrWitchKing } from "./characters/the-witch-king";
import { WotrCharacterCard } from "./characters/wotr-character-card";
import { WotrCharacter, WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterStore } from "./wotr-character-store";

@Injectable({ providedIn: "root" })
export class WotrCharacterRules {
  private characterStore = inject(WotrCharacterStore);
  private regionStore = inject(WotrRegionStore);

  private gandalfTheWhite = inject(WotrGandalfTheWhite);
  private aragorn = inject(WotrAragorn);
  private saruman = inject(WotrSaruman);
  private witchKing = inject(WotrWitchKing);
  private mouthOfSauron = inject(WotrMouthOfSauron);
  private strider = inject(WotrStrider);
  private gandalfTheGrey = inject(WotrGandalfTheGrey);
  private peregrin = inject(WotrPeregrin);
  private meriadoc = inject(WotrMeriadoc);
  private boromir = inject(WotrBoromir);
  private legolas = inject(WotrLegolas);
  private gimli = inject(WotrGimli);
  private gollum = inject(WotrGollum);

  canMoveNazgulOrMinions(): boolean {
    if (this.canMoveStandardNazgul()) return true;
    this.characterStore.minions().some(minion => this.canMoveCharacter(minion));
    return false;
  }

  canMoveStandardNazgul(): boolean {
    return this.regionStore.regions().some(region => {
      if (region.army?.nNazgul) return true;
      if (region.freeUnits?.nNazgul) return true;
      if (region.underSiegeArmy?.nNazgul) return true;
      return false;
    });
  }

  canMoveCharacter(character: WotrCharacter): boolean {
    if (character.status !== "inPlay") return false;
    if (character.level === 0) return false;
    if (character.flying) {
      if (this.isCharacterUnderSiege(character)) return false;
    }
    return true;
  }

  canMoveCompanions(): boolean {
    return this.characterStore.companions().some(companion => this.canMoveCharacter(companion));
  }

  isCharacterUnderSiege(character: WotrCharacter): boolean {
    return this.regionStore.regions().some(region => {
      return !region.underSiegeArmy?.characters?.includes(character.id);
    });
  }

  freePeoplesCharacterCards(): WotrCharacterCard[] {
    return [this.gandalfTheWhite, this.aragorn];
  }

  shadowCharacterCards(): WotrCharacterCard[] {
    return [this.saruman, this.witchKing, this.mouthOfSauron];
  }

  characterCard(characterId: WotrCharacterId): WotrCharacterCard {
    switch (characterId) {
      case "gandalf-the-white":
        return this.gandalfTheWhite;
      case "aragorn":
        return this.aragorn;
      case "saruman":
        return this.saruman;
      case "the-witch-king":
        return this.witchKing;
      case "the-mouth-of-sauron":
        return this.mouthOfSauron;
      case "strider":
        return this.strider;
      case "gandalf-the-grey":
        return this.gandalfTheGrey;
      case "peregrin":
        return this.peregrin;
      case "meriadoc":
        return this.meriadoc;
      case "boromir":
        return this.boromir;
      case "legolas":
        return this.legolas;
      case "gimli":
        return this.gimli;
      default:
        throw new Error(`Unknown character card: ${characterId}`);
      // case "gollum":
      //   return this.gollum;
    }
  }

  canBringCharacterIntoPlay(die: WotrActionDie, frontId: WotrFrontId): boolean {
    if (frontId === "free-peoples") {
      return this.freePeoplesCharacterCards().some(card => card.canBeBroughtIntoPlay(die));
    } else {
      return this.shadowCharacterCards().some(card => card.canBeBroughtIntoPlay(die));
    }
  }

  companionCanEnterRegion(region: WotrRegion, distance: number): boolean {
    if (distance === 0) return true;
    if (region.settlement !== "stronghold") return true;
    if (region.controlledBy !== "free-peoples") return true;
    if (region.underSiegeArmy) return false;
    return true;
  }

  companionCanLeaveRegion(region: WotrRegion, distance: number): boolean {
    if (region.settlement !== "stronghold") return true;
    if (region.controlledBy === "free-peoples") {
      return !region.underSiegeArmy;
    } else {
      return distance === 0;
    }
  }

  hasNazgul(region: WotrRegion): boolean {
    if (region.army?.nNazgul) return true;
    if (region.freeUnits?.nNazgul) return true;
    if (region.underSiegeArmy?.nNazgul) return true;
    if (region.army?.characters?.includes("the-witch-king")) return true;
    if (region.freeUnits?.characters?.includes("the-witch-king")) return true;
    if (region.underSiegeArmy?.characters?.includes("the-witch-king")) return true;
    return false;
  }

  characterGroupLevel(characters: WotrCharacterId[]): number {
    return characters.reduce((l, characterId) => {
      const character = this.characterStore.character(characterId);
      if (l < character.level) return character.level;
      return l;
    }, 0);
  }
}
