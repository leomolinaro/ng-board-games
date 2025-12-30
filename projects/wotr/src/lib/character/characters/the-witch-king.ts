import { WotrUiAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCombatRound } from "../../battle/wotr-battle-models";
import { WotrAfterCombatRound, WotrBattleModifiers } from "../../battle/wotr-battle-modifiers";
import { WotrBattleStore } from "../../battle/wotr-battle-store";
import { WotrCardDrawUi } from "../../card/wotr-card-draw-ui";
import { WotrCard } from "../../card/wotr-card-models";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrNationHandler } from "../../nation/wotr-nation-handler";
import { WotrShadowPlayer } from "../../player/wotr-shadow-player";
import { WotrRegion } from "../../region/wotr-region-models";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
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
    private q: WotrGameQuery,
    private nationHandler: WotrNationHandler
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.q.theWitchKing.isAvailable() &&
      this.q.sauron.isAtWar() &&
      this.q.freePeoplesNations.some(n => n.isAtWar()) &&
      this.q.regions().some(r => this.isValidRegion(r.region()))
    );
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.q
      .regions()
      .filter(r => this.isValidRegion(r.region()))
      .map(r => r.regionId);
    const region = await ui.askRegion(
      "Select a region to bring the Witch-King into play",
      validRegions
    );
    return playCharacter(region, "the-witch-king");
  }

  override resolveBringIntoPlayEffect(): void {
    this.nationHandler.activateAllFreePeoplesNations("minion-ability");
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

export class SorcererAbility implements WotrUiAbility<WotrAfterCombatRound> {
  constructor(
    private battleStore: WotrBattleStore,
    private q: WotrGameQuery,
    private shadow: WotrShadowPlayer,
    private battleModifiers: WotrBattleModifiers,
    private cardUi: WotrCardDrawUi
  ) {}

  public modifier = this.battleModifiers.afterCombatRound;

  private lastCombatCard: WotrCard | null = null;

  public handler: WotrAfterCombatRound = async (combatRound: WotrCombatRound) => {
    if (
      this.isCharacterInBattle("the-witch-king", combatRound) &&
      combatRound.round === 1 &&
      combatRound.shadow.combatCard
    ) {
      this.lastCombatCard = combatRound.shadow.combatCard;
      await activateCharacterAbility(this, "the-witch-king", this.shadow);
    }
  };

  play: () => Promise<WotrAction[]> = async () => {
    const characterCard = this.lastCombatCard!.type === "character";
    const actions: WotrAction[] = [];
    actions.push(
      await this.cardUi.drawCards(1, characterCard ? "character" : "strategy", this.shadow.frontId)
    );
    return actions;
  };

  private isCharacterInBattle(character: WotrCharacterId, combatRound: WotrCombatRound) {
    if (this.battleStore.isCharacterInRetroguard(character)) {
      return false;
    }
    return this.q.character(character).isIn(combatRound.action.fromRegion);
  }
}
