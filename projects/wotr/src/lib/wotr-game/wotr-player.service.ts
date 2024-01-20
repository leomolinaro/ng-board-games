import { Observable } from "rxjs";
import { WotrFront } from "../wotr-components/front.models";
import { WotrStory } from "../wotr-story.models";

export interface WotrPlayerService {
  firstPhaseDrawCards$ (front: WotrFront): Observable<WotrStory>;
  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement>;
  // armyMovements$ (nationId: string, playerId: string): Observable<WotrArmyMovements>;
  // battleInitiation$ (nationId: string, playerId: string): Observable<WotrBattleInitiation>;
} // WotrPlayerService
