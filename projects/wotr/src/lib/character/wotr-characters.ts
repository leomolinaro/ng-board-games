import { inject, Injectable } from "@angular/core";
import { WotrAbility } from "../ability/wotr-ability";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrActionDieModifiers } from "../action-die/wotr-action-die-modifiers";
import { WotrBattleModifiers } from "../battle/wotr-battle-modifiers";
import { WotrBattleStore } from "../battle/wotr-battle-store";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrUnitModifiers } from "../unit/wotr-unit-modifiers";
import { WotrUnitUi } from "../unit/wotr-unit-ui";
import { WotrAragorn } from "./characters/aragorn";
import {
  DwarfOfEreborAbility,
  HighWardenOfTheWhiteTowerAbility,
  PrinceOfMirkwoodAbility
} from "./characters/boromir-gimli-legolas";
import { CaptainOfTheWestAbility } from "./characters/commons";
import { WotrGandalfTheWhite } from "./characters/gandalf-the-white";
import { TakeThemAliveAbility } from "./characters/meriadoc-peregrin";
import {
  ServantsOfTheWhiteHandAbility,
  TheVoiceOfSarumanAbility,
  WotrSaruman
} from "./characters/saruman";
import { StriderGuideAbility } from "./characters/strider";
import { WotrMouthOfSauron } from "./characters/the-mouth-of-sauron";
import { SorcererAbility, WotrWitchKing } from "./characters/the-witch-king";
import { WotrCharacterCard } from "./characters/wotr-character-card";
import { WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterModifiers } from "./wotr-character-modifiers";

@Injectable({ providedIn: "root" })
export class WotrCharacters {
  private characters: Partial<Record<WotrCharacterId, WotrCharacterCard>> = {};
  private abilities: Partial<Record<WotrCharacterId, WotrAbility[]>> = {};

  private battleModifiers = inject(WotrBattleModifiers);
  private actionDieModifiers = inject(WotrActionDieModifiers);
  private fellowshipStore = inject(WotrFellowshipStore);
  private unitModifiers = inject(WotrUnitModifiers);
  private gameUi = inject(WotrGameUi);
  private unitUi = inject(WotrUnitUi);
  private characterModifiers = inject(WotrCharacterModifiers);
  private battleStore = inject(WotrBattleStore);
  private nationHandler = inject(WotrNationHandler);
  private shadow = inject(WotrShadowPlayer);
  private q = inject(WotrGameQuery);

  getAbilities(characterId: WotrCharacterId): WotrAbility[] {
    if (!this.abilities[characterId]) {
      this.abilities[characterId] = this.createAbilities(characterId);
    }
    return this.abilities[characterId];
  }

  private createAbilities(characterId: WotrCharacterId): WotrAbility[] {
    switch (characterId) {
      case "gandalf-the-white":
        return [
          /* new ShadowfaxAbility(), new TheWhiteRiderAbility() */
        ];
      case "aragorn":
        return [new CaptainOfTheWestAbility("aragorn", this.battleModifiers)];
      case "saruman":
        return [
          new TheVoiceOfSarumanAbility(this.q, this.actionDieModifiers, this.gameUi, this.unitUi),
          new ServantsOfTheWhiteHandAbility(this.unitModifiers)
        ];
      case "the-witch-king":
        return [new SorcererAbility(this.battleStore, this.q, this.shadow, this.battleModifiers)];
      case "the-mouth-of-sauron":
        return [];
      case "strider":
        return [
          new StriderGuideAbility(this.fellowshipStore, this.actionDieModifiers),
          new CaptainOfTheWestAbility("strider", this.battleModifiers)
          // new HeirToIsildurAbility(null as any)
        ];
      case "gandalf-the-grey":
        return [
          // new GuideAbility(this.actionDieModifiers.afterActionDieResolution),
          new CaptainOfTheWestAbility("gandalf-the-grey", this.battleModifiers)
          // new EmissaryFromTheWestAbility(null as any)
        ];
      case "peregrin":
        return [];
      case "meriadoc":
        return [
          // new GuideAbility(null as any),
          this.takeThemAliveAbility
        ];
      case "boromir":
        return [
          new CaptainOfTheWestAbility("boromir", this.battleModifiers),
          new HighWardenOfTheWhiteTowerAbility(this.q, this.actionDieModifiers)
        ];
      case "legolas":
        return [
          new CaptainOfTheWestAbility("legolas", this.battleModifiers),
          new PrinceOfMirkwoodAbility(this.q, this.actionDieModifiers)
        ];
      case "gimli":
        return [
          new CaptainOfTheWestAbility("gimli", this.battleModifiers),
          new DwarfOfEreborAbility(this.q, this.actionDieModifiers)
        ];
      case "gollum":
        return [];
    }
  }

  private takeThemAliveAbility = new TakeThemAliveAbility(this.q, this.characterModifiers);

  private get(characterId: WotrCharacterId): WotrCharacterCard {
    switch (characterId) {
      case "gandalf-the-white":
        if (!this.characters["gandalf-the-white"])
          this.characters["gandalf-the-white"] = new WotrGandalfTheWhite(
            "gandalf-the-white",
            this.q
          );
        return this.characters["gandalf-the-white"];
      case "aragorn":
        if (!this.characters["aragorn"])
          this.characters["aragorn"] = new WotrAragorn("aragorn", this.q, this.battleModifiers);
        return this.characters["aragorn"];
      case "saruman":
        if (!this.characters["saruman"])
          this.characters["saruman"] = new WotrSaruman("saruman", this.q);
        return this.characters["saruman"];
      case "the-witch-king":
        if (!this.characters["the-witch-king"])
          this.characters["the-witch-king"] = new WotrWitchKing(
            "the-witch-king",
            this.q,
            this.nationHandler
          );
        return this.characters["the-witch-king"];
      case "the-mouth-of-sauron":
        if (!this.characters["the-mouth-of-sauron"])
          this.characters["the-mouth-of-sauron"] = new WotrMouthOfSauron(
            "the-mouth-of-sauron",
            this.q
          );
        return this.characters["the-mouth-of-sauron"];
      default:
        throw new Error(`Unknown character ID: ${characterId}`);
    }
  }

  freePeoplesCharacterCards(): WotrCharacterCard[] {
    return [this.get("gandalf-the-white"), this.get("aragorn")];
  }

  shadowCharacterCards(): WotrCharacterCard[] {
    return [this.get("saruman"), this.get("the-witch-king"), this.get("the-mouth-of-sauron")];
  }

  canBringCharacterIntoPlay(die: WotrActionDie, frontId: WotrFrontId): boolean {
    if (frontId === "free-peoples") {
      return this.freePeoplesCharacterCards().some(card => card.canBeBroughtIntoPlay(die));
    } else {
      return this.shadowCharacterCards().some(card => card.canBeBroughtIntoPlay(die));
    }
  }

  activateAbilities(characters: WotrCharacterId[]) {
    for (const character of characters) {
      const abilities = this.getAbilities(character);
      for (const ability of abilities) {
        if (!ability.modifier) console.error("Modifier is not defined for this ability", this);
        ability.modifier.register(ability.handler);
      }
    }
  }

  deactivateAbilities(characterId: WotrCharacterId) {
    const abilities = this.getAbilities(characterId);
    for (const ability of abilities) {
      ability.modifier.unregister(ability.handler);
    }
  }
}
