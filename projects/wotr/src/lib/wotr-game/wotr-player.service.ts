import { Observable } from "rxjs";
import { WotrCardId } from "../wotr-elements/card/wotr-card.models";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrStory } from "../wotr-story.models";

export interface WotrPlayerService {
  firstPhaseDrawCards$ (front: WotrFrontId): Observable<WotrStory>;
  fellowshipDeclaration$? (): Observable<WotrStory>;
  huntAllocation$? (): Observable<WotrStory>;
  rollActionDice$? (front: WotrFrontId): Observable<WotrStory>;
  rollHuntDice$? (): Observable<WotrStory>;
  drawHuntTile$? (): Observable<WotrStory>;
  absorbHuntDamage$? (): Observable<WotrStory>;
  actionResolution$? (front: WotrFrontId): Observable<WotrStory>;
  activateTableCard$? (cardId: WotrCardId): Observable<WotrStory>;
  chooseCombatCard$? (): Observable<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
