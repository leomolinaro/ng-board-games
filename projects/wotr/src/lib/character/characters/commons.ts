import { WotrAbility } from "../../ability/wotr-ability";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrCombatRound } from "../../battle/wotr-battle-models";
import { WotrBattleModifiers, WotrBeforeCombatRound } from "../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrUiCharacterChoice } from "../../game/wotr-game-ui";
import { advanceNation } from "../../nation/wotr-nation-actions";
import { WotrNationId } from "../../nation/wotr-nation-models";
import { WotrNationStore } from "../../nation/wotr-nation-store";
import { WotrRegion } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";

export class CaptainOfTheWestAbility implements WotrAbility<WotrBeforeCombatRound> {
  constructor(
    private characterId: WotrCharacterId,
    private battleModifiers: WotrBattleModifiers
  ) {}

  public modifier = this.battleModifiers.beforeCombatRound;

  public handler = async (round: WotrCombatRound): Promise<void> => {
    if (round.attacker.army().characters?.includes(this.characterId)) {
      round.attacker.combatModifiers.push(1);
    } else if (round.defender.army().characters?.includes(this.characterId)) {
      round.defender.combatModifiers.push(1);
    }
  };
}

export abstract class AdvanceAnyDieAbility implements WotrAbility<WotrActionDieChoiceModifier> {
  constructor(
    private characterId: WotrCharacterId,
    private abilityName: string,
    private nationId: WotrNationId,
    private characterStore: WotrCharacterStore,
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore,
    public actionDieModifiers: WotrActionDieModifiers
  ) {}

  protected abstract isValidRegion(region: WotrRegion): boolean;

  public modifier = this.actionDieModifiers.actionDieChoices;

  public handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    const character = this.characterStore.character(this.characterId);
    if (character.status !== "inPlay") return [];
    const characterRegion = this.regionStore.characterRegion(this.characterId)!;
    if (!this.isValidRegion(characterRegion)) return [];
    if (!this.regionStore.isUnconquered(characterRegion.id)) return [];
    return [
      new AdvanceAnyDieChoice(this.characterId, this.abilityName, this.nationId, this.nationStore)
    ];
  };
}

class AdvanceAnyDieChoice implements WotrUiCharacterChoice {
  constructor(
    private characterId: WotrCharacterId,
    private abilityName: string,
    private nationId: WotrNationId,
    private nationStore: WotrNationStore
  ) {}

  character = this.characterId;

  label(): string {
    return this.abilityName;
  }

  isAvailable(frontId: WotrFrontId): boolean {
    const nation = this.nationStore.nation(this.nationId);
    if (nation.politicalStep === "atWar") return false;
    return true;
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return [advanceNation(this.nationId)];
  }
}
