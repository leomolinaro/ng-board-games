import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrGameStory } from "../game/wotr-story.models";
import { WotrHuntEffect, WotrHuntReRoll, WotrHuntRoll, WotrHuntTileDraw } from "../hunt/wotr-hunt-actions";

export interface WotrPlayerService {
  firstPhaseDrawCards? (): Promise<WotrGameStory>;
  wantDeclareFellowship? (): Promise<WotrGameStory>;
  huntAllocation? (): Promise<WotrGameStory>;
  rollActionDice? (): Promise<WotrGameStory>;
  rollHuntDice? (): Promise<WotrHuntRoll>;
  reRollHuntDice? (): Promise<WotrHuntReRoll>;
  drawHuntTile? (): Promise<WotrHuntTileDraw>;
  huntEffect? (): Promise<WotrHuntEffect>;
  revealFellowship? (): Promise<WotrGameStory>;
  separateCompanions? (): Promise<WotrGameStory>;
  changeGuide? (): Promise<WotrGameStory>;
  actionResolution? (): Promise<WotrGameStory>;
  activateTableCard? (cardId: WotrCardId): Promise<WotrGameStory>;
  activateCombatCard? (cardId: WotrCardId): Promise<WotrGameStory>;
  activateCharacterAbility? (characterId: WotrCharacterId): Promise<WotrGameStory>;
  forfeitLeadership? (): Promise<WotrGameStory>;
  wantRetreatIntoSiege? (): Promise<WotrGameStory>;
  wantRetreat? (): Promise<WotrGameStory>;
  chooseCombatCard? (): Promise<WotrGameStory>;
  rollCombatDice? (): Promise<WotrGameStory>;
  reRollCombatDice? (): Promise<WotrGameStory>;
  chooseCasualties? (): Promise<WotrGameStory>;
  battleAdvance? (): Promise<WotrGameStory>;
  wantContinueBattle? (): Promise<WotrGameStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
