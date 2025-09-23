import { WotrUiAbility } from "../ability/wotr-ability";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrHuntEffectParams } from "../hunt/wotr-hunt-models";
import { WotrRegionId } from "../region/wotr-region-models";

export interface WotrPlayerStoryService {
  firstPhaseDraw(frontId: WotrFrontId): Promise<WotrStory>;
  firstPhaseDiscard(frontId: WotrFrontId): Promise<WotrStory>;
  fellowshipPhase(): Promise<WotrStory>;
  huntAllocationPhase(): Promise<WotrStory>;
  rollActionDice(frontId: WotrFrontId): Promise<WotrStory>;
  rollHuntDice(): Promise<WotrStory>;
  reRollHuntDice(nReRolls: number): Promise<WotrStory>;
  drawHuntTile(): Promise<WotrStory>;
  huntEffect(huntResolution: WotrHuntEffectParams): Promise<WotrStory>;
  revealFellowship(): Promise<WotrStory>;
  separateCompanions(): Promise<WotrStory>;

  // changeGuide (): Promise<WotrGameStory>;
  actionResolution(frontId: WotrFrontId): Promise<WotrStory>;
  activateTableCard(cardId: WotrCardId): Promise<WotrStory>;
  activateCombatCard(cardId: WotrCardId): Promise<WotrStory>;
  activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId
  ): Promise<WotrStory>;
  forfeitLeadership(): Promise<WotrStory>;
  wantRetreatIntoSiege(): Promise<WotrStory>;
  wantRetreat(): Promise<WotrStory>;
  chooseCombatCard(frontId: WotrFrontId): Promise<WotrStory>;
  rollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrStory>;
  reRollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrStory>;
  chooseCasualties(
    hitPoints: number,
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    frontId: WotrFrontId
  ): Promise<WotrStory>;
  eliminateArmy(
    regionId: WotrRegionId,
    cardId: WotrCardId | null,
    frontId: WotrFrontId
  ): Promise<WotrStory>;
  battleAdvance(frontId: WotrFrontId): Promise<WotrStory>;
  wantContinueBattle(): Promise<WotrStory>;
  discardExcessCards(frontId: WotrFrontId): Promise<WotrStory>;
  playCharacterCardFromHand(frontId: WotrFrontId): Promise<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
