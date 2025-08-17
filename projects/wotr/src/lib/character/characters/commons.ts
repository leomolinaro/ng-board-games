import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrCombatRound } from "../../battle/wotr-battle-models";
import { WotrBattleModifiers, WotrBeforeCombatRound } from "../../battle/wotr-battle-modifiers";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrPlayerChoice } from "../../game/wotr-game-ui";
import { advanceNation } from "../../nation/wotr-nation-actions";
import { WotrNationId } from "../../nation/wotr-nation-models";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegion } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";

export class CaptainOfTheWestAbility extends WotrCardAbility<WotrBeforeCombatRound> {
  constructor(
    private characterId: WotrCharacterId,
    battleModifiers: WotrBattleModifiers
  ) {
    super(battleModifiers.beforeCombatRound);
  }

  protected override handler = async (round: WotrCombatRound): Promise<void> => {
    if (round.attacker.army().characters?.includes(this.characterId)) {
      round.attacker.combatModifiers.push(1);
    } else if (round.defender.army().characters?.includes(this.characterId)) {
      round.defender.combatModifiers.push(1);
    }
  };
}

export abstract class AdvanceAnyDieAbility extends WotrCardAbility<WotrActionDieChoiceModifier> {
  constructor(
    private characterId: WotrCharacterId,
    private abilityName: string,
    private nationId: WotrNationId,
    private characterStore: WotrCharacterStore,
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    actionDieModifiers: WotrActionDieModifiers
  ) {
    super(actionDieModifiers.actionDieChoices);
  }

  protected abstract isValidRegion(region: WotrRegion): boolean;

  protected override handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    const character = this.characterStore.character(this.characterId);
    if (character.status !== "inPlay") return [];
    const characterRegion = this.regionStore.characterRegion(this.characterId)!;
    if (!this.isValidRegion(characterRegion)) return [];
    if (!this.regionStore.isUnconquered(characterRegion.id)) return [];
    const choice: WotrPlayerChoice = {
      label: () => this.abilityName,
      isAvailable: () => {
        const nation = this.nationStore.nation(this.nationId);
        if (nation.politicalStep === "atWar") return false;
        return true;
      },
      resolve: async () => {
        return [advanceNation(this.nationId)];
      }
    };
    return [choice];
  };
}
