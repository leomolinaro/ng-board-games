import type { BritColor, BritNationId } from '../brit-components.models';
import type {
  BritArmyMovements,
  BritArmyPlacement,
  BritBattleInitiation,
} from '../brit-story.models';

export interface BritPlayerService {
  armyPlacement(
    nInfantries: number,
    nationId: BritNationId,
    playerId: BritColor,
  ): Promise<BritArmyPlacement>;
  armyMovements(nationId: string, playerId: string): Promise<BritArmyMovements>;
  battleInitiation(
    nationId: string,
    playerId: string,
  ): Promise<BritBattleInitiation>;
}
