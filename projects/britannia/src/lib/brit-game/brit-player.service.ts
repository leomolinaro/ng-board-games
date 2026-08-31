import type { Observable } from 'rxjs';
import type { BritColor, BritNationId } from '../brit-components.models';
import type {
  BritArmyMovements,
  BritArmyPlacement,
  BritBattleInitiation,
} from '../brit-story.models';

export interface BritPlayerService {
  armyPlacement$(
    nInfantries: number,
    nationId: BritNationId,
    playerId: BritColor,
  ): Observable<BritArmyPlacement>;
  armyMovements$(
    nationId: string,
    playerId: string,
  ): Observable<BritArmyMovements>;
  battleInitiation$(
    nationId: string,
    playerId: string,
  ): Observable<BritBattleInitiation>;
}
