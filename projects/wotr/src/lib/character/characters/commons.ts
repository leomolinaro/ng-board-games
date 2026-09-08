import type { WotrAbility } from '../../ability/wotr-ability';
import type {
  WotrActionDieChoiceModifier,
  WotrActionDieModifiers,
} from '../../action-die/wotr-action-die-modifiers';
import type { WotrCombatRound } from '../../battle/wotr-battle-models';
import type {
  WotrBattleModifiers,
  WotrBeforeCombatRound,
} from '../../battle/wotr-battle-modifiers';
import type { WotrAction } from '../../commons/wotr-action-models';
import type { WotrGameQuery } from '../../game/wotr-game-query';
import type { WotrUiCharacterChoice } from '../../game/wotr-game-ui';
import { advanceNation } from '../../nation/wotr-nation-actions';
import type { WotrNationId } from '../../nation/wotr-nation-models';
import type { WotrRegion } from '../../region/wotr-region-models';
import type { WotrCharacterId } from '../wotr-character-models';

export class CaptainOfTheWestAbility implements WotrAbility<WotrBeforeCombatRound> {
  constructor(
    private characterId: WotrCharacterId,
    private q: WotrGameQuery,
    private battleModifiers: WotrBattleModifiers,
  ) {
    this.modifier = this.battleModifiers.beforeCombatRound;
  }

  modifier;

  public handler = (round: WotrCombatRound): void => {
    const front = this.q.character(this.characterId).frontId;
    const combatFront =
      round.attacker.frontId === front ? round.attacker : round.defender;
    if (combatFront.army().characters?.includes(this.characterId)) {
      if (!combatFront.cancelledCharacters.includes(this.characterId)) {
        combatFront.combatStrengthModifiers.push(1);
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
    public actionDieModifiers: WotrActionDieModifiers,
  ) {
    this.modifier = this.actionDieModifiers.actionDieChoices;
  }

  protected abstract isValidRegion(region: WotrRegion): boolean;

  modifier;

  public handler: WotrActionDieChoiceModifier = ({ frontId }) => {
    if (frontId !== 'free-peoples') return [];
    if (!this.q.character(this.characterId).isInPlay()) return [];
    const characterRegion = this.q.character(this.characterId).region()!;
    if (!this.isValidRegion(characterRegion)) return [];
    if (!this.q.region(characterRegion.id).isUnconquered()) return [];
    return [
      new AdvanceAnyDieChoice(
        this.characterId,
        this.abilityName,
        this.nationId,
        this.q,
      ),
    ];
  };
}

class AdvanceAnyDieChoice implements WotrUiCharacterChoice {
  constructor(
    private characterId: WotrCharacterId,
    private abilityName: string,
    private nationId: WotrNationId,
    private q: WotrGameQuery,
  ) {
    this.character = this.characterId;
  }

  character;

  label(): string {
    return this.abilityName;
  }

  isAvailable(): boolean {
    return !this.q.nation(this.nationId).isAtWar();
  }

  actions(): WotrAction[] {
    return [advanceNation(this.nationId)];
  }
}
