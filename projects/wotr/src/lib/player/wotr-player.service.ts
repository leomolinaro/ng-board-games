import { WotrCardId } from "../card/wotr-card.models";
import { WotrStory } from "../game/wotr-story.models";

export interface WotrPlayerService {
  firstPhaseDrawCards? (): Promise<WotrStory>;
  wantDeclareFellowship? (): Promise<WotrStory>;
  huntAllocation? (): Promise<WotrStory>;
  rollActionDice? (): Promise<WotrStory>;
  rollHuntDice? (): Promise<WotrStory>;
  drawHuntTile? (): Promise<WotrStory>;
  absorbHuntDamage? (): Promise<WotrStory>;
  actionResolution? (): Promise<WotrStory>;
  activateTableCard? (cardId: WotrCardId): Promise<WotrStory>;
  activateCombatCard? (cardId: WotrCardId): Promise<WotrStory>;
  wantRetreatIntoSiege? (): Promise<WotrStory>;
  chooseCombatCard? (): Promise<WotrStory>;
  rollCombatDice? (): Promise<WotrStory>;
  chooseCasualties? (): Promise<WotrStory>;
  battleAdvance? (): Promise<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
