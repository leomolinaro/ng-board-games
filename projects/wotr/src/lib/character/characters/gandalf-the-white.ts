import { WotrAbility, WotrUiAbility } from "../../ability/wotr-ability";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { forfeitLeadership } from "../../battle/wotr-battle-actions";
import { WotrCombatRound } from "../../battle/wotr-battle-models";
import { WotrBattleModifiers, WotrBeforeCombatRound } from "../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrFreePeoplesPlayer } from "../../player/wotr-free-peoples-player";
import { WotrRegionId } from "../../region/wotr-region-models";
import { character } from "../../unit/wotr-unit-models";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import {
  WotrCharacterModifiers,
  WotrCharacterMovementLevelModifier
} from "../wotr-character-modifiers";
import { activateCharacterAbility, WotrCharacterCard } from "./wotr-character-card";

// Gandalf the White - Emissary from the West (Level 3, Leadership 1, +1 Action Die)
// If Gandalf the Grey has been eliminated or has left the Fellowship, and any Minion is (or has been) in play, you may use one Will of the West Action die result to
// play Gandalf the White.
// If Gandalf the Grey is in play, replace him; otherwise, place Gandalf the White in Fangorn or in an unconquered Elven Stronghold.
// Shadowfax. If Gandalf the White is moving alone or with one Hobbit, his Level is considered 4 (for purposes of movement only).
// The White Rider. If Gandalf the White is in a battle, at the start of the battle you can forfeit his Leadership to negate all Nazgul Leadership (including that of the
// Witch-king) for the duration of that battle.

export class WotrGandalfTheWhite extends WotrCharacterCard {
  constructor(
    public override characterId: WotrCharacterId,
    private q: WotrGameQuery
  ) {
    super();
  }

  override canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (!this.q.gandalfTheWhite.isAvailable()) return false;
    if (die !== "will-of-the-west") return false;
    const gandalf = this.q.gandalfTheGrey;
    if (!gandalf.isInPlay() && !gandalf.isEliminated()) return false;
    if (this.q.minions.every(c => !c.isInPlay() && !c.isEliminated())) return false;
    return true;
  }

  override async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const gandalf = this.q.gandalfTheGrey;
    if (gandalf.isInPlay()) {
      const gandalfRegion = gandalf.getRegion()!;
      return playCharacter(gandalfRegion.id, "gandalf-the-white");
    } else if (gandalf.isEliminated()) {
      const elvenStrongholds: WotrRegionId[] = [
        "rivendell",
        "lorien",
        "woodland-realm",
        "grey-havens"
      ];
      const targetRegions: WotrRegionId[] = ["fangorn"];
      for (const regionId of elvenStrongholds) {
        if (this.q.region(regionId).isUnconquered()) targetRegions.push(regionId);
      }
      const region = await ui.askRegion(
        "Select a region to bring Gandalf the White into play",
        targetRegions
      );
      return playCharacter(region, "gandalf-the-white");
    }
    throw new Error(
      "Gandalf the Grey is not in a valid state to bring Gandalf the White into play."
    );
  }
}

export class ShadowfaxAbility implements WotrAbility<WotrCharacterMovementLevelModifier> {
  constructor(private characterModifiers: WotrCharacterModifiers) {}

  public modifier = this.characterModifiers.characterMovementLevelModifier;

  public handler: WotrCharacterMovementLevelModifier = (characters, originalLevel) => {
    if (!characters.includes("gandalf-the-white")) return originalLevel;
    if (characters.length === 1) return 4;
    if (characters.length > 2) return originalLevel;
    const otherCharacter = characters.filter(c => c !== "gandalf-the-white")[0];
    if (otherCharacter === "peregrin" || otherCharacter === "meriadoc") return 4;
    return originalLevel;
  };
}

export class TheWhiteRiderAbility implements WotrUiAbility<WotrBeforeCombatRound> {
  constructor(
    private freePeoples: WotrFreePeoplesPlayer,
    private battleModifiers: WotrBattleModifiers
  ) {}

  public modifier = this.battleModifiers.beforeCombatRound;

  public handler = async (round: WotrCombatRound): Promise<void> => {
    const [combatFront, otherCombatFront] =
      round.attacker.frontId === "free-peoples"
        ? [round.attacker, round.defender]
        : [round.defender, round.attacker];
    if (!combatFront.army().characters?.includes("gandalf-the-white")) return;
    if (combatFront.cancelledCharacters.includes("gandalf-the-white")) return;
    if (!(await activateCharacterAbility(this, "gandalf-the-white", this.freePeoples))) return;
    otherCombatFront.negateNazgulLeadership = true;
  };

  async play() {
    return [forfeitLeadership(character("gandalf-the-white"))];
  }
}
