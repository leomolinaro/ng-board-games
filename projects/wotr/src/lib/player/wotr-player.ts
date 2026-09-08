import type { WotrUiAbility } from '../ability/wotr-ability';
import type { WotrCombatCardAbility } from '../battle/combat-cards/wotr-combat-cards';
import type { WotrCombatRound } from '../battle/wotr-battle-models';
import type { WotrCardId } from '../card/wotr-card-models';
import type { WotrCharacterId } from '../character/wotr-character-models';
import type { WotrSeparateCompanionsOptions } from '../fellowship/wotr-fellowship-rules';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrStory } from '../game/wotr-story-models';
import type { WotrStoryService } from '../game/wotr-story-service';
import type { WotrRegionId } from '../region/wotr-region-models';
import type {
  WotrEliminateUnitsParams,
  WotrForfeitLeadershipParams,
} from '../unit/wotr-unit-models';

export abstract class WotrPlayer {
  protected abstract storyService: WotrStoryService;
  public abstract frontId: WotrFrontId;

  firstPhaseDraw(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.firstPhaseDraw(this.frontId),
    );
  }
  firstPhaseDiscard(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.firstPhaseDiscard(this.frontId),
    );
  }
  fellowshipPhase(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) => p.fellowshipPhase());
  }
  huntAllocationPhase(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.huntAllocationPhase(),
    );
  }
  rollActionDice(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.rollActionDice(this.frontId),
    );
  }

  drawHuntTile(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) => p.drawHuntTile());
  }
  revealFellowship(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) => p.revealFellowship());
  }
  separateCompanions(
    params: WotrSeparateCompanionsOptions,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.separateCompanions(params),
    );
  }
  actionResolution(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.actionResolution(this.frontId),
    );
  }
  activateTableCard(
    ability: WotrUiAbility,
    cardId: WotrCardId,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.activateTableCard(ability, cardId),
    );
  }
  activateCombatCard(
    ability: WotrCombatCardAbility,
    cardId: WotrCardId,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.activateCombatCard(ability, cardId),
    );
  }
  activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.activateCharacterAbility(ability, characterId),
    );
  }
  forfeitLeadership(params: WotrForfeitLeadershipParams): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.forfeitLeadership(params),
    );
  }
  wantRetreatIntoSiege(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.wantRetreatIntoSiege(),
    );
  }
  wantRetreat(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.wantRetreat(this.frontId),
    );
  }
  chooseCombatCard(combatRound: WotrCombatRound): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.chooseCombatCard(this.frontId, combatRound),
    );
  }
  rollCombatDice(nDice: number): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.rollCombatDice(nDice, this.frontId),
    );
  }
  reRollCombatDice(nDice: number): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.reRollCombatDice(nDice, this.frontId),
    );
  }
  rollShelobsLairDie(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) => p.rollShelobsLairDie());
  }
  chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.chooseCasualties(hitPoints, regionId, cardId, this.frontId),
    );
  }
  eliminateArmy(
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.eliminateArmy(regionId, cardId, this.frontId),
    );
  }
  battleAdvance(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.battleAdvance(this.frontId),
    );
  }
  wantContinueBattle(combatRound: WotrCombatRound): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.wantContinueBattle(combatRound),
    );
  }
  discardExcessCards(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.discardExcessCards(this.frontId),
    );
  }
  playCharacterCardFromHand(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.playCharacterCardFromHand(this.frontId),
    );
  }
  eliminateUnits(
    params: WotrEliminateUnitsParams,
    cardId: WotrCardId,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.eliminateUnits(params, cardId, this.frontId),
    );
  }
  chooseRegion(
    regions: WotrRegionId[],
    cardId: WotrCardId,
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.chooseRegion(regions, cardId, this.frontId),
    );
  }
  makeRulerDieChoice(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, (p) =>
      p.makeRulerDieChoice(this.frontId),
    );
  }
}
