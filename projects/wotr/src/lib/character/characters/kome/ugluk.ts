import { WotrAbility, WotrUiAbility } from "../../../ability/wotr-ability";
import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { forfeitCombatCardById } from "../../../battle/wotr-battle-actions";
import { WotrCombatRound } from "../../../battle/wotr-battle-models";
import {
  WotrBattleModifiers,
  WotrBeforeCombatCardRevealing
} from "../../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrBeforeHuntRoll, WotrHuntModifiers } from "../../../hunt/wotr-hunt-modifiers";
import { WotrShadowPlayer } from "../../../player/wotr-shadow-player";
import { WotrRegionQuery } from "../../../region/wotr-region-query";
import { playCharacter } from "../../wotr-character-actions";
import {
  activateCharacterAbility,
  WotrPlayableCharacterCard
} from "../wotr-playable-character-card";

// Ugluk - Chieftain of the Uruk-hai (Level 2, Leadership 1, +1 Ruler Special Action Die)
// If Rohan is "At War", or the Fellowship is revealed, you may spend a Muster Action die result,
// or any Ruler die result (except an Eye), to play Ugluk in a region with an Army containing
// an Isengard unit, or in a free region with, or adjacent to, the revealed Fellowship.
// I Command. If Ugluk is in a battle, before revealing Combat cards you may forfeit the effects
// of your Combat card to add 1 to all dice on the Combat roll and Leader re-roll of both Armies;
// if the Combat card is "Desperate Battle", add 1 to your dice only [3].
// We March Day and Night. If Ugluk is in the region with, or in a region adjiacent to, the Fellowship,
// add 1 to all dice on your Hunt re-roll.
// Ugluk is not a Minion for the purpose of playing Gandalf the White.

export class Ugluk extends WotrPlayableCharacterCard {
  constructor(
    private q: WotrGameQuery,
    protected battleModifiers: WotrBattleModifiers
  ) {
    super();
  }

  public readonly characterId = "ugluk";

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (
      (this.q.rohan.isAtWar() || this.q.fellowship.isRevealed()) &&
      die === "muster" && // TODO also check for Ruler die (except Eye)
      this.q.regions().some(r => this.isValidRegion(r))
    ) {
      return true;
    }
    return false;
  }

  private isValidRegion(r: WotrRegionQuery): boolean {
    if (r.hasArmyUnitsOfNation("isengard")) return true;
    if (this.q.fellowship.isRevealed()) {
      const fellowshipRegion = this.q.fellowship.region();
      if (fellowshipRegion.id === r.id() || r.isAdjacentTo(fellowshipRegion.id)) return true;
    }
    return false;
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.q
      .regions()
      .filter(r => this.isValidRegion(r))
      .map(r => r.id());
    const region = await ui.askRegion("Select a region to bring Ugluk into play", validRegions);
    return playCharacter(region, "ugluk");
  }
}

export class ICommandAbility implements WotrUiAbility<WotrBeforeCombatCardRevealing> {
  constructor(
    private shadow: WotrShadowPlayer,
    private battleModifiers: WotrBattleModifiers
  ) {}
  modifier = this.battleModifiers.beforeCombatCardRevealing;

  private round?: WotrCombatRound;

  public handler = async (round: WotrCombatRound): Promise<void> => {
    if (!round.shadow.isCharacterActiveInBattle("ugluk")) return;
    if (!round.shadow.combatCard) return;
    this.round = round;
    if (!(await activateCharacterAbility(this, "ugluk", this.shadow))) return;
    // eslint-disable-next-line require-atomic-updates
    round.shadow.forfeitedCombatCard = true;
    round.shadow.combatModifiers.push(1);
    round.shadow.leaderModifiers.push(1);
    if (round.shadow.combatCard.combatLabel !== "Desperate Battle") {
      round.freePeoples.combatModifiers.push(1);
      round.freePeoples.leaderModifiers.push(1);
    }
  };

  async play() {
    const combatCard = this.round?.shadow.combatCard;
    if (!combatCard) throw new Error("No combat card to forfeit.");
    return [forfeitCombatCardById(combatCard.id)];
  }
}

export class WeMarchDayAndNightAbility implements WotrAbility<WotrBeforeHuntRoll> {
  constructor(
    private q: WotrGameQuery,
    private huntModifiers: WotrHuntModifiers
  ) {}
  modifier = this.huntModifiers.beforeHuntRoll;
  handler: WotrBeforeHuntRoll = async modifiers => {
    if (this.q.fellowship.isOnMordorTrack()) return;
    const fellowshipRegion = this.q.fellowship.region();
    const uglukRegionId = this.q.ugluk.region()!.id;
    const uglukRegion = this.q.region(uglukRegionId);
    if (uglukRegion.id() === fellowshipRegion.id || uglukRegion.isAdjacentTo(fellowshipRegion.id)) {
      modifiers.reRollModifiers.push(1);
    }
  };
}
