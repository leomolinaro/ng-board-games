import { Injectable, inject } from "@angular/core";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrGameStore } from "../game/wotr-game.store";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrPlayerService } from "./wotr-player.service";

@Injectable({ providedIn: "root" })
export class WotrPlayerAiService implements WotrPlayerService {
  private game = inject(WotrGameStore);

  firstPhase(): Promise<never> {
    throw new Error("Method not implemented.");
  }
  fellowshipPhase(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  huntAllocationPhase(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  rollActionDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  musterArmies(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  moveArmies(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  initiateBattle(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  rollHuntDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  reRollHuntDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  drawHuntTile(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  huntEffect(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  revealFellowship(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  separateCompanions(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  actionResolution(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  activateTableCard(cardId: WotrCardId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  activateCombatCard(cardId: WotrCardId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  activateCharacterAbility(characterId: WotrCharacterId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  forfeitLeadership(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  wantRetreatIntoSiege(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  wantRetreat(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  chooseCombatCard(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  rollCombatDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  reRollCombatDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  chooseCasualties(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  battleAdvance(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
  wantContinueBattle(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }
}
