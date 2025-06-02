import { Observable } from "rxjs";
import { BritColor, BritNationId } from "../brit-components.models";
import { BritArmyMovements, BritArmyPlacement, BritBattleInitiation } from "../brit-story.models";

export interface BritPlayerService {
  armyPlacement$(nInfantries: number, nationId: BritNationId, playerId: BritColor): Observable<BritArmyPlacement>;
  armyMovements$(nationId: string, playerId: string): Observable<BritArmyMovements>;
  battleInitiation$(nationId: string, playerId: string): Observable<BritBattleInitiation>;
} // BritPlayerService
