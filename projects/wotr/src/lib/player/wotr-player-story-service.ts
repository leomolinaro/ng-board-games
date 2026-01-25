import { WotrUiAbility } from "../ability/wotr-ability";
import { WotrCombatRound } from "../battle/wotr-battle-models";
import { WotrCombatCardAbility } from "../battle/wotr-combat-cards";
import { WotrCardId } from "../card/wotr-card-models";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrHuntEffectParams } from "../hunt/wotr-hunt-models";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrEliminateUnitsParams, WotrForfeitLeadershipParams } from "../unit/wotr-unit-models";

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
  lureOfTheRingEffect(character: WotrCharacterId): Promise<WotrStory>;
  revealFellowship(): Promise<WotrStory>;
  separateCompanions(): Promise<WotrStory>;

  // changeGuide (): Promise<WotrGameStory>;
  actionResolution(frontId: WotrFrontId): Promise<WotrStory>;
  activateTableCard(ability: WotrUiAbility, cardId: WotrCardId): Promise<WotrStory>;
  activateCombatCard(ability: WotrCombatCardAbility, cardId: WotrCardId): Promise<WotrStory>;
  activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId
  ): Promise<WotrStory>;
  forfeitLeadership(params: WotrForfeitLeadershipParams): Promise<WotrStory>;
  wantRetreatIntoSiege(): Promise<WotrStory>;
  wantRetreat(): Promise<WotrStory>;
  chooseCombatCard(frontId: WotrFrontId, combatRound: WotrCombatRound): Promise<WotrStory>;
  rollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrStory>;
  reRollCombatDice(nDice: number, frontId: WotrFrontId): Promise<WotrStory>;
  rollShelobsLairDie(): Promise<WotrStory>;
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
  eliminateUnits(
    params: WotrEliminateUnitsParams,
    cardId: WotrCardId,
    frontId: WotrFrontId
  ): Promise<WotrStory>;
  chooseRegion(
    regions: WotrRegionId[],
    cardId: WotrCardId,
    frontId: WotrFrontId
  ): Promise<WotrStory>;
  theEaglesAreComingEffect(
    nHits: number,
    region: WotrRegionId,
    cardId: WotrCardId
  ): Promise<WotrStory>;
  faramirsRangersRecruit(cardId: WotrCardId): Promise<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
}
