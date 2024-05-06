import { WotrCardId } from "../wotr-elements/card/wotr-card.models";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrStory } from "../wotr-story.models";

export interface WotrPlayerService {
  firstPhaseDrawCards? (front: WotrFrontId): Promise<WotrStory>;
  fellowshipDeclaration? (): Promise<WotrStory>;
  huntAllocation? (): Promise<WotrStory>;
  rollActionDice? (front: WotrFrontId): Promise<WotrStory>;
  rollHuntDice? (): Promise<WotrStory>;
  drawHuntTile? (): Promise<WotrStory>;
  absorbHuntDamage? (): Promise<WotrStory>;
  actionResolution? (front: WotrFrontId): Promise<WotrStory>;
  activateTableCard? (cardId: WotrCardId): Promise<WotrStory>;
  chooseCombatCard? (): Promise<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
