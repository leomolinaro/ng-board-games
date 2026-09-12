import { inject, Injectable } from '@angular/core';
import type { WotrUiAbility } from '../ability/wotr-ability';
import type { WotrCombatCardAbility } from '../battle/combat-cards/wotr-combat-cards';
import type { WotrCombatRound } from '../battle/wotr-battle-models';
import { WotrBattleStore } from '../battle/wotr-battle-store';
import { WotrBattleUi } from '../battle/wotr-battle-ui';
import { WotrCardDrawUi } from '../card/wotr-card-draw-ui';
import type { WotrCardId } from '../card/wotr-card-models';
import { WotrCardPlayUi } from '../card/wotr-card-play-ui';
import type {
  WotrCharacterId,
  WotrCompanionId,
} from '../character/wotr-character-models';
import { WotrCharacterUi } from '../character/wotr-character-ui';
import type { WotrSeparateCompanionsOptions } from '../fellowship/wotr-fellowship-rules';
import { WotrFellowshipUi } from '../fellowship/wotr-fellowship-ui';
import type { WotrFrontId } from '../front/wotr-front-models';
import { WotrGameUiContext } from '../game/wotr-game-ui-context';
import type {
  WotrBaseStory,
  WotrCardEffectStory,
  WotrCombatCardEffectStory,
  WotrEffectStory,
  WotrStory,
} from '../game/wotr-story-models';
import type { WotrHuntEffectParams } from '../hunt/wotr-hunt-models';
import { WotrHuntUi } from '../hunt/wotr-hunt-ui';
import type { WotrRegionId } from '../region/wotr-region-models';
import { WotrRegionUi } from '../region/wotr-region-ui';
import type {
  WotrEliminateUnitsParams,
  WotrForfeitLeadershipParams,
} from '../unit/wotr-unit-models';
import { WotrUnitUi } from '../unit/wotr-unit-ui';
import type { WotrPlayerStoryService } from './wotr-player-story-service';

@Injectable()
export class WotrPlayerUi implements WotrPlayerStoryService {
  private uiContext = inject(WotrGameUiContext);
  private battleUi = inject(WotrBattleUi);
  private cardDrawUi = inject(WotrCardDrawUi);
  private fellowshipUi = inject(WotrFellowshipUi);
  private huntUi = inject(WotrHuntUi);
  private characterUi = inject(WotrCharacterUi);
  private cardPlayUi = inject(WotrCardPlayUi);
  private unitUi = inject(WotrUnitUi);
  private battleStore = inject(WotrBattleStore);
  private regionUi = inject(WotrRegionUi);

  async firstPhaseDraw(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: 'base',
      actions: [await this.cardDrawUi.firstPhaseDrawCards(frontId)],
    };
  }

  async firstPhaseDiscard(frontId: WotrFrontId): Promise<WotrStory> {
    return this.discardExcessCards(frontId);
  }

  async fellowshipPhase(): Promise<WotrStory> {
    return {
      type: 'base',
      actions: await this.fellowshipUi.fellowshipPhase(),
    };
  }

  async huntAllocationPhase(): Promise<WotrStory> {
    return { type: 'base', actions: await this.huntUi.huntAllocationPhase() };
  }

  async rollActionDice(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: 'base',
      actions: [await this.uiContext.actionDieUi.rollActionDice(frontId)],
    };
  }

  async actionResolution(frontId: WotrFrontId): Promise<WotrStory> {
    return this.uiContext.actionDieUi.actionResolution(frontId, null);
  }

  async separateCompanions(
    params: WotrSeparateCompanionsOptions,
  ): Promise<WotrStory> {
    return params.cardId
      ? {
          type: 'card-effect',
          card: params.cardId,
          actions: await this.fellowshipUi.separateCompanions(params),
        }
      : {
          type: 'base',
          actions: await this.fellowshipUi.separateCompanions(params),
        };
  }

  async rollHuntDice(): Promise<WotrStory> {
    return { type: 'base', actions: [await this.huntUi.rollHuntDice()] };
  }

  async reRollHuntDice(nReRolls: number): Promise<WotrStory> {
    return {
      type: 'base',
      actions: [await this.huntUi.reRollHuntDice(nReRolls)],
    };
  }

  async rollShelobsLairDie(): Promise<WotrStory> {
    return { type: 'base', actions: [await this.huntUi.rollShelobsLairDie()] };
  }

  async drawHuntTile(): Promise<WotrStory> {
    return { type: 'base', actions: [await this.huntUi.drawHuntTile(1, null)] };
  }

  async huntEffect(huntResolution: WotrHuntEffectParams): Promise<WotrStory> {
    return {
      type: 'base',
      actions: await this.huntUi.huntEffect(huntResolution),
    };
  }

  async lureOfTheRingEffect(character: WotrCompanionId): Promise<WotrStory> {
    return {
      type: 'card-effect',
      card: 'scha13',
      actions: await this.huntUi.lureOfTheRingEffect(character),
    };
  }

  async revealFellowship(): Promise<WotrStory> {
    return {
      type: 'base',
      actions: await this.huntUi.revealFellowship(),
    };
  }

  async activateTableCard(
    ability: WotrUiAbility,
    cardId: WotrCardId,
  ): Promise<WotrStory> {
    return this.cardPlayUi.activateTableCard(ability, cardId);
  }

  async activateCombatCard(
    ability: WotrCombatCardAbility,
    cardId: WotrCardId,
  ): Promise<WotrStory> {
    return this.battleUi.activateCombatCard(ability, cardId);
  }

  async activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId,
  ): Promise<WotrStory> {
    return this.characterUi.activateCharacterAbility(ability, characterId);
  }

  async forfeitLeadership(
    params: WotrForfeitLeadershipParams,
  ): Promise<WotrEffectStory> {
    return this.unitUi.forfeitLeadership(params);
  }

  async wantRetreatIntoSiege(): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: await this.battleUi.wantRetreatIntoSiege(),
    };
  }

  async wantRetreat(frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: await this.battleUi.wantRetreat(frontId),
    };
  }

  async chooseCombatCard(
    frontId: WotrFrontId,
    combatRound: WotrCombatRound,
  ): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: await this.battleUi.chooseCombatCard(frontId, combatRound),
    };
  }

  async rollCombatDice(nDice: number): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: [await this.battleUi.rollCombatDice(nDice)],
    };
  }

  async reRollCombatDice(nDice: number): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: [await this.battleUi.reRollCombatDice(nDice)],
    };
  }

  async chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    frontId: WotrFrontId,
  ): Promise<WotrBaseStory | WotrCardEffectStory | WotrCombatCardEffectStory> {
    const actions = await this.battleUi.chooseCasualties(
      hitPoints,
      regionId,
      frontId,
    );
    if (cardId) {
      return this.battleStore.battleInProgress()
        ? { type: 'combat-card-effect', card: cardId, actions }
        : { type: 'card-effect', card: cardId, actions };
    }
    return { type: 'base', actions };
  }

  async eliminateArmy(
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    frontId: WotrFrontId,
  ): Promise<WotrBaseStory | WotrCardEffectStory> {
    const actions = await this.battleUi.eliminateArmy(regionId, frontId);
    return cardId
      ? { type: 'card-effect', card: cardId, actions }
      : { type: 'base', actions };
  }

  async battleAdvance(): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: await this.battleUi.battleAdvance(),
    };
  }

  async wantContinueBattle(
    combatRound: WotrCombatRound,
  ): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: await this.battleUi.wantContinueBattle(combatRound),
    };
  }

  async discardExcessCards(frontId: WotrFrontId): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: [await this.cardDrawUi.discardExcessCards(frontId)],
    };
  }

  async playCharacterCardFromHand(
    frontId: WotrFrontId,
  ): Promise<WotrBaseStory> {
    return {
      type: 'base',
      actions: await this.cardPlayUi.playCharacterCardFromHand(frontId),
    };
  }

  async eliminateUnits(
    params: WotrEliminateUnitsParams,
    cardId: WotrCardId,
    _frontId: WotrFrontId,
  ): Promise<WotrCardEffectStory> {
    return {
      type: 'card-effect',
      card: cardId,
      actions: await this.unitUi.eliminateUnits(params),
    };
  }

  async chooseRegion(
    regions: WotrRegionId[],
    cardId: WotrCardId,
    _frontId: WotrFrontId,
  ): Promise<WotrCardEffectStory> {
    return {
      type: 'card-effect',
      card: cardId,
      actions: [await this.regionUi.chooseRegion(regions)],
    };
  }

  async theEaglesAreComingEffect(
    nHits: number,
    region: WotrRegionId,
    cardId: WotrCardId,
  ): Promise<WotrCardEffectStory> {
    return {
      type: 'card-effect',
      card: cardId,
      actions: await this.unitUi.theEaglesAreComingEffect(nHits, region),
    };
  }

  async faramirsRangersRecruit(
    cardId: WotrCardId,
  ): Promise<WotrCardEffectStory> {
    return {
      type: 'card-effect',
      card: cardId,
      actions: await this.unitUi.faramirsRangersRecruit(),
    };
  }

  async deadMenOfDunharrowRecruit(
    regionId: WotrRegionId,
    cardId: WotrCardId,
  ): Promise<WotrCardEffectStory> {
    return {
      type: 'card-effect',
      card: cardId,
      actions: await this.unitUi.deadMenOfDunharrowRecruit(regionId),
    };
  }

  async deadMenOfDunharrowCasualties(
    nHits: number,
    regionId: WotrRegionId,
    cardId: WotrCardId,
  ): Promise<WotrCardEffectStory> {
    const actions = await this.battleUi.deadMenOfDunharrowCasualties(
      nHits,
      regionId,
    );
    return { type: 'card-effect', card: cardId, actions };
  }

  async chooseCorruptionTile(): Promise<WotrStory> {
    return {
      type: 'base',
      actions: [await this.huntUi.chooseCorruptionTile()],
    };
  }

  async makeRulerDieChoice(frontId: WotrFrontId): Promise<WotrStory> {
    return {
      type: 'base',
      actions: [await this.uiContext.actionDieUi.makeRulerDieChoice(frontId)],
    };
  }
}
