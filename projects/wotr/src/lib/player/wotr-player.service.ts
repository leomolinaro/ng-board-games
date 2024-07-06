import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrStory } from "../game/wotr-story.models";
import { WotrHuntEffectStory, WotrHuntReRollStory, WotrHuntRollStory, WotrHuntTileDrawStory } from "../hunt/wotr-hunt-actions";

export interface WotrPlayerService {
  firstPhaseDrawCards? (): Promise<WotrStory>;
  wantDeclareFellowship? (): Promise<WotrStory>;
  huntAllocation? (): Promise<WotrStory>;
  rollActionDice? (): Promise<WotrStory>;
  rollHuntDice? (): Promise<WotrHuntRollStory>;
  reRollHuntDice? (): Promise<WotrHuntReRollStory>;
  drawHuntTile? (): Promise<WotrHuntTileDrawStory>;
  huntEffect? (): Promise<WotrHuntEffectStory>;
  revealFellowship? (): Promise<WotrStory>;
  separateCompanions? (): Promise<WotrStory>;
  changeGuide? (): Promise<WotrStory>;
  actionResolution? (): Promise<WotrStory>;
  activateTableCard? (cardId: WotrCardId): Promise<WotrStory>;
  activateCombatCard? (cardId: WotrCardId): Promise<WotrStory>;
  activateCharacterAbility? (characterId: WotrCharacterId): Promise<WotrStory>;
  forfeitLeadership? (): Promise<WotrStory>;
  wantRetreatIntoSiege? (): Promise<WotrStory>;
  wantRetreat? (): Promise<WotrStory>;
  chooseCombatCard? (): Promise<WotrStory>;
  rollCombatDice? (): Promise<WotrStory>;
  reRollCombatDice? (): Promise<WotrStory>;
  chooseCasualties? (): Promise<WotrStory>;
  battleAdvance? (): Promise<WotrStory>;
  wantContinueBattle? (): Promise<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
