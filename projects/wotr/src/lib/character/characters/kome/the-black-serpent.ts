import { WotrUiAbility } from "../../../ability/wotr-ability";
import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { forfeitCombatCardById } from "../../../battle/wotr-battle-actions";
import { WotrCombatRound } from "../../../battle/wotr-battle-models";
import {
  WotrBattleModifiers,
  WotrBeforeCombatCardRevealing
} from "../../../battle/wotr-battle-modifiers";
import { WotrBattleUi } from "../../../battle/wotr-battle-ui";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrShadowPlayer } from "../../../player/wotr-shadow-player";
import { WotrRegionQuery } from "../../../region/wotr-region-query";
import { playCharacter } from "../../wotr-character-actions";
import {
  activateCharacterAbility,
  WotrPlayableCharacterCard
} from "../wotr-playable-character-card";

// The Black Serpent - Chieftain of the Haradrim (Level 2, Leadership 2, +1 Ruler Special Action Die)
// If Gondor is "At War", you may spend a Muster Action or any Ruler die result
// (except an Eye), to play the Black Serpent in a region with an Army containing a
// Southrons & Esterling unit.
// Red Wrath. If the Black Serpent is in a battle, before revealing Combat cards,
// you may forfeit the effects of your Combat card, and inflict and apply one hit against
// your units, to add 1 to all dice on your Combat roll;
// if the Combat card is "Relentless Assault", add 2 to all dice on your Combat roll instead [3].
// The Black Serpent is not a Minion for the purpose of playing Gandalf the White.

export class TheBlackSerpent extends WotrPlayableCharacterCard {
  constructor(
    private q: WotrGameQuery,
    protected battleModifiers: WotrBattleModifiers
  ) {
    super();
  }

  public readonly characterId = "the-black-serpent";

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (
      this.q.gondor.isAtWar() &&
      die === "muster" && // TODO also check for Ruler die (except Eye)
      this.q.regions().some(r => this.isValidRegion(r))
    ) {
      return true;
    }
    return false;
  }

  private isValidRegion(r: WotrRegionQuery): boolean {
    return r.hasArmyUnitsOfNation("southrons");
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.q
      .regions()
      .filter(r => this.isValidRegion(r))
      .map(r => r.id());
    const region = await ui.askRegion(
      "Select a region to bring The Black Serpent into play",
      validRegions
    );
    return playCharacter(region, "the-black-serpent");
  }
}

export class RedWrath implements WotrUiAbility<WotrBeforeCombatCardRevealing> {
  constructor(
    private shadow: WotrShadowPlayer,
    private battleModifiers: WotrBattleModifiers,
    private battleUi: WotrBattleUi
  ) {}
  modifier = this.battleModifiers.beforeCombatCardRevealing;

  private round?: WotrCombatRound;

  public handler = async (round: WotrCombatRound): Promise<void> => {
    if (!round.shadow.isCharacterActiveInBattle("the-black-serpent")) return;
    if (!round.shadow.combatCard) return;
    this.round = round;
    if (!(await activateCharacterAbility(this, "the-black-serpent", this.shadow))) return;
    // eslint-disable-next-line require-atomic-updates
    round.shadow.forfeitedCombatCard = true;
    round.shadow.combatModifiers.push(
      round.shadow.combatCard.combatLabel === "Relentless Assault" ? 2 : 1
    );
  };

  async play() {
    const combatCard = this.round?.shadow.combatCard;
    if (!combatCard) throw new Error("No combat card to forfeit.");
    if (!this.round) throw new Error("No combat round.");
    const actions = await this.battleUi.chooseCasualties(1, this.round.shadow.regionId, "shadow");
    actions.push(forfeitCombatCardById(combatCard.id));
    return actions;
  }
}
