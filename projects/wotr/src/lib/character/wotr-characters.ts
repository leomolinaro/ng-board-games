import { inject, Injectable } from "@angular/core";
import { WotrAbility } from "../ability/wotr-ability";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrActionDieModifiers } from "../action-die/wotr-action-die-modifiers";
import { WotrActionDieUi } from "../action-die/wotr-action-die-ui";
import { WotrBattleModifiers } from "../battle/wotr-battle-modifiers";
import { WotrBattleStore } from "../battle/wotr-battle-store";
import { WotrBattleUi } from "../battle/wotr-battle-ui";
import { WotrCardDrawUi } from "../card/wotr-card-draw-ui";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameStore } from "../game/wotr-game-store";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrHuntModifiers } from "../hunt/wotr-hunt-modifiers";
import { WotrNationHandler } from "../nation/wotr-nation-handler";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
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
import { GandalfGuideAbility } from "./characters/gandalf-the-grey";
import {
  ShadowfaxAbility,
  TheWhiteRiderAbility,
  WotrGandalfTheWhite
} from "./characters/gandalf-the-white";
import { RedWrath, TheBlackSerpent } from "./characters/kome/the-black-serpent";
import { LordOfTheBats, TheShadowOfMirkwood } from "./characters/kome/the-shadow-of-mirkwood";
import { ICommandAbility, Ugluk, WeMarchDayAndNightAbility } from "./characters/kome/ugluk";
import { HobbitGuideAbility, TakeThemAliveAbility } from "./characters/meriadoc-peregrin";
import {
  ServantsOfTheWhiteHandAbility,
  TheVoiceOfSarumanAbility,
  WotrSaruman
} from "./characters/saruman";
import { StriderGuideAbility } from "./characters/strider";
import {
  MessengerOfTheDarkTowerAbility,
  MessengerOfTheDarkTowerSetUsedAbility,
  TheMouthOfSauron
} from "./characters/the-mouth-of-sauron";
import { SorcererAbility, TheWitchKing } from "./characters/the-witch-king";
import { WotrPlayableCharacterCard } from "./characters/wotr-playable-character-card";
import { WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterModifiers } from "./wotr-character-modifiers";

@Injectable()
export class WotrCharacterAbilities {
  private characters: Partial<Record<WotrCharacterId, WotrPlayableCharacterCard>> = {};
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
  private cardDrawUi = inject(WotrCardDrawUi);
  private fellowshipUi = inject(WotrFellowshipUi);
  actionDieUi!: WotrActionDieUi;
  private gameStore = inject(WotrGameStore);
  private huntModifiers = inject(WotrHuntModifiers);
  private battleUi = inject(WotrBattleUi);

  private freePeoples = inject(WotrFreePeoplesPlayer);

  getAbilities(characterId: WotrCharacterId): WotrAbility[] {
    if (!this.abilities[characterId]) {
      const abilities = this.createAbilities(characterId);
      this.abilities[characterId] = abilities;
    }
    return this.abilities[characterId];
  }

  resolveBringIntoPlayEffects(characterId: WotrCharacterId): void {
    const characterCard = this.getPlayableCharacterCard(characterId);
    characterCard.resolveBringIntoPlayEffect();
  }

  private createAbilities(characterId: WotrCharacterId): WotrAbility[] {
    switch (characterId) {
      case "gandalf-the-white":
        return [
          new ShadowfaxAbility(this.characterModifiers),
          new TheWhiteRiderAbility(this.freePeoples, this.battleModifiers)
        ];
      case "aragorn":
        return [new CaptainOfTheWestAbility("aragorn", this.q, this.battleModifiers)];
      case "saruman":
        return [
          new TheVoiceOfSarumanAbility(this.q, this.actionDieModifiers, this.gameUi, this.unitUi),
          new ServantsOfTheWhiteHandAbility(this.unitModifiers)
        ];
      case "the-witch-king":
        return [
          new SorcererAbility(
            this.battleStore,
            this.q,
            this.shadow,
            this.battleModifiers,
            this.cardDrawUi
          )
        ];
      case "the-mouth-of-sauron":
        return [
          new MessengerOfTheDarkTowerAbility(this.q, this.actionDieUi, this.actionDieModifiers),
          new MessengerOfTheDarkTowerSetUsedAbility(this.q, this.actionDieModifiers)
        ];
      case "brand":
        return []; // TODO
      case "dain":
        return []; // TODO
      case "denethor":
        return []; // TODO
      case "theoden":
        return []; // TODO
      case "thranduil":
        return []; // TODO
      case "the-black-serpent":
        return [new RedWrath(this.shadow, this.battleModifiers, this.battleUi)];
      case "the-shadow-of-mirkwood":
        return [new LordOfTheBats(this.q, this.shadow, this.battleModifiers)];
      case "ugluk":
        return [
          new ICommandAbility(this.shadow, this.battleModifiers),
          new WeMarchDayAndNightAbility(this.q, this.huntModifiers)
        ];
      case "strider":
        return [
          new StriderGuideAbility(this.fellowshipStore, this.actionDieModifiers),
          new CaptainOfTheWestAbility("strider", this.q, this.battleModifiers)
          // new HeirToIsildurAbility(null as any)
        ];
      case "gandalf-the-grey":
        return [
          new GandalfGuideAbility(
            this.actionDieModifiers,
            this.freePeoples,
            this.q,
            this.cardDrawUi
          ),
          new CaptainOfTheWestAbility("gandalf-the-grey", this.q, this.battleModifiers)
          // new EmissaryFromTheWestAbility(null as any)
        ];
      case "peregrin":
        return [
          new HobbitGuideAbility("peregrin", this.q, this.huntModifiers, this.fellowshipUi),
          new TakeThemAliveAbility(
            "peregrin",
            this.q,
            this.characterModifiers,
            this.freePeoples,
            this.fellowshipUi
          )
        ];
      case "meriadoc":
        return [
          new HobbitGuideAbility("meriadoc", this.q, this.huntModifiers, this.fellowshipUi),
          new TakeThemAliveAbility(
            "meriadoc",
            this.q,
            this.characterModifiers,
            this.freePeoples,
            this.fellowshipUi
          )
        ];
      case "boromir":
        return [
          new CaptainOfTheWestAbility("boromir", this.q, this.battleModifiers),
          new HighWardenOfTheWhiteTowerAbility(this.q, this.actionDieModifiers)
        ];
      case "legolas":
        return [
          new CaptainOfTheWestAbility("legolas", this.q, this.battleModifiers),
          new PrinceOfMirkwoodAbility(this.q, this.actionDieModifiers)
        ];
      case "gimli":
        return [
          new CaptainOfTheWestAbility("gimli", this.q, this.battleModifiers),
          new DwarfOfEreborAbility(this.q, this.actionDieModifiers)
        ];
      case "gollum":
        return [];
    }
  }

  private getPlayableCharacterCard(characterId: WotrCharacterId): WotrPlayableCharacterCard {
    switch (characterId) {
      case "gandalf-the-white":
        if (!this.characters["gandalf-the-white"])
          this.characters["gandalf-the-white"] = new WotrGandalfTheWhite(this.q);
        return this.characters["gandalf-the-white"];
      case "aragorn":
        if (!this.characters["aragorn"])
          this.characters["aragorn"] = new WotrAragorn(this.q, this.battleModifiers);
        return this.characters["aragorn"];
      case "saruman":
        if (!this.characters["saruman"]) this.characters["saruman"] = new WotrSaruman(this.q);
        return this.characters["saruman"];
      case "the-witch-king":
        if (!this.characters["the-witch-king"])
          this.characters["the-witch-king"] = new TheWitchKing(this.q, this.nationHandler);
        return this.characters["the-witch-king"];
      case "the-mouth-of-sauron":
        if (!this.characters["the-mouth-of-sauron"])
          this.characters["the-mouth-of-sauron"] = new TheMouthOfSauron(this.q);
        return this.characters["the-mouth-of-sauron"];
      case "ugluk":
        if (!this.characters["ugluk"])
          this.characters["ugluk"] = new Ugluk(this.q, this.battleModifiers);
        return this.characters["ugluk"];
      case "the-shadow-of-mirkwood":
        if (!this.characters["the-shadow-of-mirkwood"])
          this.characters["the-shadow-of-mirkwood"] = new TheShadowOfMirkwood(
            this.q,
            this.battleModifiers
          );
        return this.characters["the-shadow-of-mirkwood"];
      case "the-black-serpent":
        if (!this.characters["the-black-serpent"])
          this.characters["the-black-serpent"] = new TheBlackSerpent(this.q, this.battleModifiers);
        return this.characters["the-black-serpent"];
      default:
        throw new Error(`Unknown character ID: ${characterId}`);
    }
  }

  private freePeoplesPlayableCharacters(): WotrCharacterId[] {
    return ["gandalf-the-white", "aragorn"];
  }

  private shadowPlayableCharacterIds(): WotrCharacterId[] {
    const characterIds: WotrCharacterId[] = ["saruman", "the-witch-king", "the-mouth-of-sauron"];
    if (this.q.kome()) {
      characterIds.push("ugluk", "the-shadow-of-mirkwood", "the-black-serpent");
    }
    return characterIds;
  }

  availableCharacterCards(frontId: WotrFrontId): WotrPlayableCharacterCard[] {
    const characterIds =
      frontId === "free-peoples"
        ? this.freePeoplesPlayableCharacters()
        : this.shadowPlayableCharacterIds();
    return characterIds
      .filter(characterId => this.q.character(characterId).isAvailable())
      .map(characterId => this.getPlayableCharacterCard(characterId));
  }

  canBringCharacterIntoPlay(die: WotrActionDie, frontId: WotrFrontId): boolean {
    return this.availableCharacterCards(frontId).some(card => card.canBeBroughtIntoPlay(die));
  }

  activateAbilities(characters: WotrCharacterId[]) {
    if (this.gameStore.isTemporaryState()) return;
    for (const character of characters) {
      const abilities = this.getAbilities(character);
      for (const ability of abilities) {
        if (!ability.modifier) console.error("Modifier is not defined for this ability", this);
        ability.modifier.register(ability.handler);
      }
    }
  }

  deactivateAbilities(characterId: WotrCharacterId) {
    if (this.gameStore.isTemporaryState()) return;
    const abilities = this.getAbilities(characterId);
    for (const ability of abilities) {
      ability.modifier.unregister(ability.handler);
    }
  }
}
