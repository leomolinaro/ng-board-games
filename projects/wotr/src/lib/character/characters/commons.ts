import { WotrAbility } from "../../ability/wotr-ability";
import {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers
} from "../../action-die/wotr-action-die-modifiers";
import { WotrCombatRound } from "../../battle/wotr-battle-models";
import { WotrBattleModifiers, WotrBeforeCombatRound } from "../../battle/wotr-battle-modifiers";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrGameQuery } from "../../game/wotr-game-query";
import { WotrUiCharacterChoice } from "../../game/wotr-game-ui";
import { advanceNation } from "../../nation/wotr-nation-actions";
import { WotrNationId } from "../../nation/wotr-nation-models";
import { WotrRegion } from "../../region/wotr-region-models";
import { WotrCharacterId } from "../wotr-character-models";

export class CaptainOfTheWestAbility implements WotrAbility<WotrBeforeCombatRound> {
  constructor(
    private characterId: WotrCharacterId,
    private q: WotrGameQuery,
    private battleModifiers: WotrBattleModifiers
  ) {}

  public modifier = this.battleModifiers.beforeCombatRound;

  public handler = async (round: WotrCombatRound): Promise<void> => {
    const front = this.q.character(this.characterId).frontId();
    const combatFront = round.attacker.frontId === front ? round.attacker : round.defender;
    if (combatFront.army().characters?.includes(this.characterId)) {
      if (!combatFront.cancelledCharacters.includes(this.characterId)) {
        combatFront.combatModifiers.push(1);
      }
    }
  };
}

export abstract class AdvanceAnyDieAbility implements WotrAbility<WotrActionDieChoiceModifier> {
  constructor(
    private characterId: WotrCharacterId,
    private abilityName: string,
    private nationId: WotrNationId,
    private q: WotrGameQuery,
    public actionDieModifiers: WotrActionDieModifiers
  ) {}

  protected abstract isValidRegion(region: WotrRegion): boolean;

  public modifier = this.actionDieModifiers.actionDieChoices;

  public handler: WotrActionDieChoiceModifier = (die, frontId) => {
    if (frontId !== "free-peoples") return [];
    if (!this.q.character(this.characterId).isInPlay()) return [];
    const characterRegion = this.q.character(this.characterId).region()!;
    if (!this.isValidRegion(characterRegion)) return [];
    if (!this.q.region(characterRegion.id).isUnconquered()) return [];
    return [new AdvanceAnyDieChoice(this.characterId, this.abilityName, this.nationId, this.q)];
  };
}

class AdvanceAnyDieChoice implements WotrUiCharacterChoice {
  constructor(
    private characterId: WotrCharacterId,
    private abilityName: string,
    private nationId: WotrNationId,
    private q: WotrGameQuery
  ) {}

  character = this.characterId;

  label(): string {
    return this.abilityName;
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return !this.q.nation(this.nationId).isAtWar();
  }

  async actions(frontId: WotrFrontId): Promise<WotrAction[]> {
    return [advanceNation(this.nationId)];
  }
}
