import { Observable } from "rxjs";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrStory } from "../wotr-story.models";

export interface WotrPlayerService {
  firstPhaseDrawCards$ (front: WotrFrontId): Observable<WotrStory>;
  huntAllocation$? (): Observable<WotrStory>;
  rollActionDice$? (front: WotrFrontId): Observable<WotrStory>;
  actionResolution$? (front: WotrFrontId): Observable<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
