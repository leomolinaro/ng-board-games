import { WotrAbility, WotrUiAbility } from "../../../ability/wotr-ability";
import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { forfeitCombatCardById } from "../../../battle/wotr-battle-actions";
import { WotrCombatRound } from "../../../battle/wotr-battle-models";
import {
  WotrAfterCombatCardRevealing,
  WotrBattleModifiers
} from "../../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrLogWriter } from "../../../log/wotr-log-writer";
import { WotrShadowPlayer } from "../../../player/wotr-shadow-player";
import { WotrRecruitmentConstraints } from "../../../unit/wotr-unit-handler";
import {
  WotrRecruitmentConstraintsModifier,
  WotrUnitModifiers
} from "../../../unit/wotr-unit-modifiers";
import { WotrUnitUtils } from "../../../unit/wotr-unit-utils";
import { WotrCharacterHandler } from "../../wotr-character-handler";
import { activateCharacterAbility } from "../wotr-playable-character-card";
import { KomeSovereignCard } from "./kome-sovereign-card";

// Brand - King of Dale (Level 1, Leadership 1, Shadow Resistance 2)
// If the North is active, you may spend a Muster Action die result, or any Ruler die result,
// to move Brand to an unconquered Free Peoples City or Stronghold and awaken him there.
// Heir of Bard. Once per battle, if Brand and a North Army unit are in battle, after revealing
// Combat cards you may forfeit the effects of your Combat card to cancel the effects of the Combat
// card played by the Shadow player. [0]
// Call to Arms. If the North is "At War", you may use a Muster result on the Ruler die to recruit
// one North Regular unit or Leader in two different free North Settlements, and one North
// Regular unit or Leader in the same region as Brand, if it is free.
// Brand is a Companion.

// Brand - Corrupted Ruler
// If Brand becomes Corrupted, place him in Dale.
// Corrupted King. The Free Peoples player cannot recruit Leaders or Elite units of the North Nation,
// except as an effect of an Event card.
// Shadow in the North. Once per battle, if a North Army unit is in that battle, after revealing
// Combat cards you may forfeit the effects of your Combat card to cancel the effects of the Combat
// card played by the Free Peoples player. [0]
// When a Companion with a North or Free Peoples icon is in the same region as Brand, Corrupted Ruler,
// the Free Peoples player may use a Character Action die result to remove Brand from play. His figure
// is removed, this card is discarded, and his Weaknesses immediately cease their effect.

export class Brand extends KomeSovereignCard {
  constructor(
    protected q: WotrGameQuery,
    protected characterHandler: WotrCharacterHandler,
    protected logger: WotrLogWriter
  ) {
    super();
  }

  readonly sovereignId = "brand";
  protected readonly corruptionRegion = "dale";

  override canBeAwakened(die: WotrActionDie): boolean {
    return false;
  }

  override async awaken(ui: WotrGameUi): Promise<WotrAction> {
    throw new Error("Not implemented");
  }
}

export class BrandCorruptedKing implements WotrAbility<WotrRecruitmentConstraintsModifier> {
  constructor(private unitModifiers: WotrUnitModifiers) {}

  modifier = this.unitModifiers.recruitmentConstraintsModifier;

  handler(constraints: WotrRecruitmentConstraints): void {
    constraints.excludedNationsForEliteUnits.add("north");
    constraints.excludedNationsForLeaderUnits.add("north");
  }
}

export class ShadowInTheNorth implements WotrUiAbility<WotrAfterCombatCardRevealing> {
  constructor(
    private battleModifiers: WotrBattleModifiers,
    private unitUtils: WotrUnitUtils,
    private shadow: WotrShadowPlayer
  ) {}

  modifier = this.battleModifiers.afterCombatCardRevealing;
  private round?: WotrCombatRound;

  handler: WotrAfterCombatCardRevealing = async (combatRound: WotrCombatRound): Promise<void> => {
    if (!this.unitUtils.hasArmyUnitsOfNation("north", combatRound.freePeoples.army())) return;
    if (!combatRound.attacker.combatCard) return;
    if (!combatRound.defender.combatCard) return;
    this.round = combatRound;
    if (!(await activateCharacterAbility(this, "brand", this.shadow))) return;
    // eslint-disable-next-line require-atomic-updates
    combatRound.freePeoples.cancelledCombatCard = true;
    // eslint-disable-next-line require-atomic-updates
    combatRound.shadow.forfeitedCombatCard = true;
  };

  play: () => Promise<WotrAction[]> = async () => {
    const combatCard = this.round?.shadow.combatCard;
    if (!combatCard) throw new Error("No combat card to forfeit.");
    if (!this.round) throw new Error("No combat round.");
    return [forfeitCombatCardById(combatCard.id)];
  };
}
