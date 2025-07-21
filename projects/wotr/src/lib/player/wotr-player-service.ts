import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameStory } from "../game/wotr-story-models";
import { WotrPlayer } from "./wotr-player";

export interface WotrPlayerService {
  firstPhase(player: WotrPlayer): Promise<WotrGameStory>;
  fellowshipPhase(): Promise<WotrGameStory>;
  huntAllocationPhase(): Promise<WotrGameStory>;
  rollActionDice(player: WotrPlayer): Promise<WotrGameStory>;
  rollHuntDice(): Promise<WotrGameStory>;
  reRollHuntDice(): Promise<WotrGameStory>;
  drawHuntTile(): Promise<WotrGameStory>;
  huntEffect(damage: number): Promise<WotrGameStory>;
  revealFellowship(): Promise<WotrGameStory>;
  separateCompanions(): Promise<WotrGameStory>;

  // changeGuide (): Promise<WotrGameStory>;
  actionResolution(player: WotrPlayer): Promise<WotrGameStory>;
  activateTableCard(cardId: WotrCardId): Promise<WotrGameStory>;
  activateCombatCard(cardId: WotrCardId): Promise<WotrGameStory>;
  activateCharacterAbility(characterId: WotrCharacterId): Promise<WotrGameStory>;
  forfeitLeadership(): Promise<WotrGameStory>;
  wantRetreatIntoSiege(): Promise<WotrGameStory>;
  wantRetreat(): Promise<WotrGameStory>;
  chooseCombatCard(frontId: WotrFrontId): Promise<WotrGameStory>;
  rollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrGameStory>;
  reRollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrGameStory>;
  chooseCasualties(hitPoints: number, frontId: WotrFrontId): Promise<WotrGameStory>;
  eliminateArmy(frontId: WotrFrontId): Promise<WotrGameStory>;
  battleAdvance(frontId: WotrFrontId): Promise<WotrGameStory>;
  wantContinueBattle(): Promise<WotrGameStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
