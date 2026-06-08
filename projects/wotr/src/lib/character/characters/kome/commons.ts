import { WotrAbility } from "../../../ability/wotr-ability";
import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrCombatRound } from "../../../battle/wotr-battle-models";
import { WotrBattleModifiers, WotrBeforeCombatRound } from "../../../battle/wotr-battle-modifiers";
import { WotrBattleStore } from "../../../battle/wotr-battle-store";
import { WotrRegionId } from "../../../region/wotr-region-models";

export function validSovereignAwakeningDie(die: WotrActionDie): boolean {
  if (die === "muster") return true;
  if (typeof die === "object" && die.type === "ruler" && die.result !== "eye") return true;
  return false;
}

export function validChieftainPlayingDie(die: WotrActionDie): boolean {
  return validSovereignAwakeningDie(die);
}

export abstract class SovereingFateOf implements WotrAbility<WotrBeforeCombatRound> {
  constructor(
    private strongholdRegion: WotrRegionId,
    private battleModifiers: WotrBattleModifiers,
    private battleStore: WotrBattleStore
  ) {}

  modifier = this.battleModifiers.beforeCombatRound;

  private combatRound: WotrCombatRound | null = null;

  handler: WotrBeforeCombatRound = async (combatRound: WotrCombatRound): Promise<void> => {
    const battle = this.battleStore.battle();
    if (!battle) throw new Error("No battle in progress");
    if (battle.region !== this.strongholdRegion) return;
    if (!combatRound.siege) return;
    if ((battle.nRegularCasualtiesToContinueSiege ?? 0) > 0) return;
    this.combatRound = combatRound;
    combatRound.shadow.canRemoveRegularToContinueSiege = true;
  };

  destroy(): void {
    const battle = this.battleStore.battle();
    if (!battle) return;
    if (battle.region !== this.strongholdRegion) return;
    if (!this.combatRound) return;
    this.combatRound.shadow.canRemoveRegularToContinueSiege = false;
    this.combatRound = null;
  }
}
