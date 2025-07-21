import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrRegion } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrCharacter, WotrCharacterId } from "./wotr-character.models";
import { WotrCharacterStore } from "./wotr-character.store";
import {
  WotrAragornCard,
  WotrCharacterCard,
  WotrGandalfTheWhiteCard,
  WotrMouthOfSauronCard,
  WotrSarumanCard,
  WotrWitchKingCard
} from "./wotr-characters";

@Injectable({ providedIn: "root" })
export class WotrCharacterRules {
  private characterStore = inject(WotrCharacterStore);
  private regionStore = inject(WotrRegionStore);

  private gandalfTheWhite = inject(WotrGandalfTheWhiteCard);
  private aragorn = inject(WotrAragornCard);
  private saruman = inject(WotrSarumanCard);
  private witchKing = inject(WotrWitchKingCard);
  private mouthOfSauron = inject(WotrMouthOfSauronCard);

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
