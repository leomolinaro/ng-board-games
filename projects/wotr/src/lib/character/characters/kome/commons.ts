import { WotrAbility } from "../../../ability/wotr-ability";
import { WotrCombatRound } from "../../../battle/wotr-battle-models";
import { WotrBattleModifiers, WotrBeforeCombatRound } from "../../../battle/wotr-battle-modifiers";
import { WotrBattleStore } from "../../../battle/wotr-battle-store";
import { WotrRegionId } from "../../../region/wotr-region-models";

export abstract class SovereingFateOf implements WotrAbility<WotrBeforeCombatRound> {
  constructor(
    private strongholdRegion: WotrRegionId,
    private battleModifiers: WotrBattleModifiers,
    private battleStore: WotrBattleStore
  ) {}

  modifier = this.battleModifiers.beforeCombatRound;

  handler: WotrBeforeCombatRound = async (combatRound: WotrCombatRound): Promise<void> => {
    const battle = this.battleStore.battle();
    if (!battle) throw new Error("No battle in progress");
    if (battle.region !== this.strongholdRegion) return;
    if (!combatRound.siege) return;
    if ((battle.nRegularCasualtiesToContinueSiege ?? 0) > 0) return;
    combatRound.shadow.canRemoveRegularToContinueSiege = true;
  };
}
