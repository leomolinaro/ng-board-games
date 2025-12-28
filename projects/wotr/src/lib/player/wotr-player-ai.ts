import { Injectable, inject } from "@angular/core";
import { WotrAbility, WotrUiAbility } from "../ability/wotr-ability";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId, WotrCompanionId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameStore } from "../game/wotr-game-store";
import { WotrStory } from "../game/wotr-story-models";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrPlayerStoryService } from "./wotr-player-story-service";

@Injectable({ providedIn: "root" })
export class WotrPlayerAi implements WotrPlayerStoryService {
  private game = inject(WotrGameStore);

  firstPhaseDraw(): Promise<never> {
    throw new Error("Method not implemented.");
  }
  firstPhaseDiscard(): Promise<never> {
    throw new Error("Method not implemented.");
  }
  fellowshipPhase(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  huntAllocationPhase(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  rollActionDice(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  musterArmies(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  moveArmies(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  initiateBattle(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  rollHuntDice(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  reRollHuntDice(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  rollShelobsLairDie(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  drawHuntTile(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  huntEffect(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  lureOfTheRingEffect(character: WotrCompanionId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  revealFellowship(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  separateCompanions(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  actionResolution(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  activateTableCard(ability: WotrUiAbility, cardId: WotrCardId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  activateCombatCard(ability: WotrUiAbility, cardId: WotrCardId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  activateCharacterAbility(ability: WotrAbility, characterId: WotrCharacterId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  forfeitLeadership(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  wantRetreatIntoSiege(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  wantRetreat(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  chooseCombatCard(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  rollCombatDice(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  reRollCombatDice(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  chooseCasualties(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  chooseCasualtiesCardReaction(
    hitPoints: number,
    regionId: WotrRegionId,
    cardId: WotrCardId,
    frontId: WotrFrontId
  ): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  eliminateArmy(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  battleAdvance(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  wantContinueBattle(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  discardExcessCards(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  playCharacterCardFromHand(frontId: WotrFrontId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  eliminateUnits(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  chooseRegion(
    regions: WotrRegionId[],
    cardId: WotrCardId,
    frontId: WotrFrontId
  ): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
}
