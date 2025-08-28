import { WotrAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCombatRound } from "../../battle/wotr-battle-models";
import { WotrAfterCombatRound, WotrBattleModifiers } from "../../battle/wotr-battle-modifiers";
import { WotrBattleStore } from "../../battle/wotr-battle-store";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrNationHandler } from "../../nation/wotr-nation-handler";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrShadowPlayer } from "../../player/wotr-shadow-player";
import { WotrRegion } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { activateCharacterAbility, WotrCharacterCard } from "./wotr-character-card";

// The Witch-king - The Black Captain (Level ∞, Leadership 2, +1 Action Die)
// If Sauron and at least one Free Peoples Nation are "At War," you may use one Muster Action die result to place the Witch-king in any region with a Shadow
// Army that includes at least one Sauron unit.
// Activate all Free Peoples Nations.
// Sorcerer. If the Witch-king is in a battle and you use a Combat card during the first round of the battle, after doing so you may immediately draw an Event card
// from the deck matching the type of that card.

export class WotrWitchKing extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private characterStore: WotrCharacterStore,
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    private nationHandler: WotrNationHandler
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterStore.isAvailable("the-witch-king") &&
      this.nationStore.isAtWar("sauron") &&
      this.nationStore.freePeoplesNations().some(n => this.nationStore.isAtWar(n.id)) &&
      this.regionStore.regions().some(r => this.isValidRegion(r))
    );
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.regionStore
      .regions()
      .filter(r => this.isValidRegion(r))
      .map(r => r.id);
    const region = await ui.askRegion(
      "Select a region to bring the Witch-King into play",
      validRegions
    );
    return playCharacter(region, "the-witch-king");
  }

  override resolveBringIntoPlayEffect(): void {
    this.nationHandler.activateAllFreePeoplesNations();
  }

  private isValidRegion(region: WotrRegion): boolean {
    if (!region.army) return false;
    if (region.army.front !== "shadow") return false;
    return (
      region.army.regulars?.some(u => u.nation === "sauron") ||
      region.army.elites?.some(c => c.nation === "sauron") ||
      false
    );
  }
}

export class SorcererAbility implements WotrAbility<WotrAfterCombatRound> {
  constructor(
    private battleStore: WotrBattleStore,
    private regionStore: WotrRegionStore,
    private shadow: WotrShadowPlayer,
    private battleModifiers: WotrBattleModifiers
  ) {}

  public modifier = this.battleModifiers.afterCombatRound;

  public handler: WotrAfterCombatRound = async (combatRound: WotrCombatRound) => {
    if (
      this.isCharacterInBattle("the-witch-king", combatRound) &&
      combatRound.round === 1 &&
      combatRound.shadow.combatCard
    ) {
      await activateCharacterAbility("the-witch-king", this.shadow);
    }
  };

  private isCharacterInBattle(character: WotrCharacterId, combatRound: WotrCombatRound) {
    if (this.battleStore.isCharacterInRetroguard(character)) {
      return false;
    }
    return this.regionStore.isCharacterInRegion(character, combatRound.action.fromRegion);
  }
}
