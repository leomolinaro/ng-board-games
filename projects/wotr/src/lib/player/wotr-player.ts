import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrRegionId } from "../region/wotr-region.models";

export abstract class WotrPlayer {
  protected abstract storyService: WotrStoryService;
  public abstract frontId: WotrFrontId;

  firstPhase(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.firstPhase(this));
  }
  fellowshipPhase(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.fellowshipPhase());
  }
  huntAllocationPhase(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.huntAllocationPhase());
  }
  rollActionDice(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.rollActionDice(this));
  }
  rollHuntDice(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.rollHuntDice());
  }
  reRollHuntDice(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.reRollHuntDice());
  }
  drawHuntTile(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.drawHuntTile());
  }
  huntEffect(damage: number): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.huntEffect(damage));
  }
  revealFellowship(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.revealFellowship());
  }
  separateCompanions(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.separateCompanions());
  }

  actionResolution(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.actionResolution(this));
  }
  activateTableCard(cardId: WotrCardId): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.activateTableCard(cardId));
  }
  activateCombatCard(cardId: WotrCardId): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.activateCombatCard(cardId));
  }
  activateCharacterAbility(characterId: WotrCharacterId): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.activateCharacterAbility(characterId));
  }
  forfeitLeadership(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.forfeitLeadership());
  }
  wantRetreatIntoSiege(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.wantRetreatIntoSiege());
  }
  wantRetreat(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.wantRetreat());
  }
  chooseCombatCard(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.chooseCombatCard(this.frontId));
  }
  rollCombatDice(nDice: number): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.rollCombatDice(nDice, this.frontId));
  }
  reRollCombatDice(nDice: number): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.reRollCombatDice(nDice, this.frontId));
  }
  chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    underSiege: boolean
  ): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p =>
      p.chooseCasualties(hitPoints, regionId, underSiege)
    );
  }
  eliminateArmy(regionId: WotrRegionId, underSiege: boolean): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.eliminateArmy(regionId, underSiege));
  }
  battleAdvance(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.battleAdvance());
  }
  wantContinueBattle(): Promise<WotrGameStory> {
    return this.storyService.story(this.frontId, p => p.wantContinueBattle());
  }
}
