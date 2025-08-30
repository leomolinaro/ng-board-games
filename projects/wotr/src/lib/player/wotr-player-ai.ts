import { Injectable, inject } from "@angular/core";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrGameStore } from "../game/wotr-game-store";
import { WotrStory } from "../game/wotr-story-models";
import { WotrPlayerStoryService } from "./wotr-player-story-service";

@Injectable({ providedIn: "root" })
export class WotrPlayerAi implements WotrPlayerStoryService {
  private game = inject(WotrGameStore);

  firstPhase(): Promise<never> {
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
  drawHuntTile(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  huntEffect(): Promise<WotrStory> {
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
  activateTableCard(cardId: WotrCardId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  activateCombatCard(cardId: WotrCardId): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  activateCharacterAbility(characterId: WotrCharacterId): Promise<WotrStory> {
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
  eliminateArmy(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  battleAdvance(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
  wantContinueBattle(): Promise<WotrStory> {
    throw new Error("Method not implemented.");
  }
}
