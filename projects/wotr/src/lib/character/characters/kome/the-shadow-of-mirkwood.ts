import { WotrUiAbility } from "../../../ability/wotr-ability";
import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { forfeitCombatCardById, forfeitLeadership } from "../../../battle/wotr-battle-actions";
import { WotrCombatRound } from "../../../battle/wotr-battle-models";
import {
  WotrBattleModifiers,
  WotrBeforeCombatCardRevealing
} from "../../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrShadowPlayer } from "../../../player/wotr-shadow-player";
import { WotrRegionQuery } from "../../../region/wotr-region-query";
import { character } from "../../../unit/wotr-unit-models";
import { playCharacter } from "../../wotr-character-actions";
import {
  activateCharacterAbility,
  WotrPlayableCharacterCard
} from "../wotr-playable-character-card";

// The Shadow of Mirkwood - Chieftain of the Dark Lord (Level 3, Leadership 1, +1 Ruler Special Action Die)
// If either the Dwarves, the Elves, or the North are "At War", you may spend a Muster Action
// die result, of any Ruler die result (except an Eye), to play the Shadow of Mirkwood in a region with an Army containing a
// Sauron unit.
// Lord of the Bats. If Shadow of Mirkwood is in a battle, before revealing Combat cards,
// you may forfeit both the effects of your Combat card and the Shadow of Mirkwood's Leadership
// to add 1 to all dice on your Leader re-roll [4];
// if the Combat card is "Swarm of Bats", you also cancel the effect of the Comabt Card played
// by the Free Peoples player [0].
// The Shadow of Mirkwood is not a Minion for the purpose of playing Gandalf the White.

export class TheShadowOfMirkwood extends WotrPlayableCharacterCard {
  constructor(
    private q: WotrGameQuery,
    protected battleModifiers: WotrBattleModifiers
  ) {
    super();
  }

  public readonly characterId = "the-shadow-of-mirkwood";

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (
      (this.q.dwarves.isAtWar() || this.q.elves.isAtWar() || this.q.north.isAtWar()) &&
      die === "muster" && // TODO also check for Ruler die (except Eye)
      this.q.regions().some(r => this.isValidRegion(r))
    ) {
      return true;
    }
    return false;
  }

  private isValidRegion(r: WotrRegionQuery): boolean {
    return r.hasArmyUnitsOfNation("sauron");
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.q
      .regions()
      .filter(r => this.isValidRegion(r))
      .map(r => r.id());
    const region = await ui.askRegion(
      "Select a region to bring The Shadow of Mirkwood into play",
      validRegions
    );
    return playCharacter(region, "the-shadow-of-mirkwood");
  }
}

export class LordOfTheBats implements WotrUiAbility<WotrBeforeCombatCardRevealing> {
  constructor(
    private q: WotrGameQuery,
    private shadow: WotrShadowPlayer,
    private battleModifiers: WotrBattleModifiers
  ) {}
  modifier = this.battleModifiers.beforeCombatCardRevealing;

  private round?: WotrCombatRound;

  public handler = async (round: WotrCombatRound): Promise<void> => {
    if (!round.shadow.isCharacterActiveInBattle("the-shadow-of-mirkwood")) return;
    if (!round.shadow.combatCard) return;
    this.round = round;
    if (!(await activateCharacterAbility(this, "the-shadow-of-mirkwood", this.shadow))) return;
    // eslint-disable-next-line require-atomic-updates
    round.shadow.forfeitedCombatCard = true;
    round.shadow.forfeitedLeadership = this.q.theShadowOfMirkwood.leadership;
    round.shadow.leaderModifiers.push(1);
    if (round.shadow.combatCard.combatLabel === "Swarm of Bats") {
      round.freePeoples.cancelledCombatCard = true;
    }
  };

  async play() {
    const combatCard = this.round?.shadow.combatCard;
    if (!combatCard) throw new Error("No combat card to forfeit.");
    return [
      forfeitCombatCardById(combatCard.id),
      forfeitLeadership(character("the-shadow-of-mirkwood"))
    ];
  }
}
