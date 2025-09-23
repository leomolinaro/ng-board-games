import { WotrUiAbility } from "../ability/wotr-ability";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrStoryService } from "../game/wotr-story-service";
import { WotrHuntEffectParams } from "../hunt/wotr-hunt-models";
import { WotrRegionId } from "../region/wotr-region-models";

export abstract class WotrPlayer {
  protected abstract storyService: WotrStoryService;
  public abstract frontId: WotrFrontId;

  firstPhaseDraw(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.firstPhaseDraw(this.frontId));
  }
  firstPhaseDiscard(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.firstPhaseDiscard(this.frontId));
  }
  fellowshipPhase(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.fellowshipPhase());
  }
  huntAllocationPhase(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.huntAllocationPhase());
  }
  rollActionDice(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.rollActionDice(this.frontId));
  }
  rollHuntDice(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.rollHuntDice());
  }
  reRollHuntDice(nReRolls: number): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.reRollHuntDice(nReRolls));
  }
  drawHuntTile(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.drawHuntTile());
  }
  huntEffect(params: WotrHuntEffectParams): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.huntEffect(params));
  }
  revealFellowship(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.revealFellowship());
  }
  separateCompanions(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.separateCompanions());
  }
  actionResolution(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.actionResolution(this.frontId));
  }
  activateTableCard(cardId: WotrCardId): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.activateTableCard(cardId));
  }
  activateCombatCard(cardId: WotrCardId): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.activateCombatCard(cardId));
  }
  activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p =>
      p.activateCharacterAbility(ability, characterId)
    );
  }
  forfeitLeadership(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.forfeitLeadership());
  }
  wantRetreatIntoSiege(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.wantRetreatIntoSiege());
  }
  wantRetreat(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.wantRetreat());
  }
  chooseCombatCard(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.chooseCombatCard(this.frontId));
  }
  rollCombatDice(nDice: number): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.rollCombatDice(nDice, this.frontId));
  }
  reRollCombatDice(nDice: number): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.reRollCombatDice(nDice, this.frontId));
  }
  chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    cardId: WotrCardId | null
  ): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p =>
      p.chooseCasualties(hitPoints, regionId, cardId, this.frontId)
    );
  }
  eliminateArmy(regionId: WotrRegionId, cardId: WotrCardId | null): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p =>
      p.eliminateArmy(regionId, cardId, this.frontId)
    );
  }
  battleAdvance(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.battleAdvance(this.frontId));
  }
  wantContinueBattle(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.wantContinueBattle());
  }
  discardExcessCards(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.discardExcessCards(this.frontId));
  }
  playCharacterCardFromHand(): Promise<WotrStory> {
    return this.storyService.story(this.frontId, p => p.playCharacterCardFromHand(this.frontId));
  }
}
