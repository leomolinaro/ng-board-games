import { Observable } from "rxjs";
import { BritNationId } from "../brit-components.models";
import { BritPlayerId } from "../brit-game-state.models";
import { BritArmyMovements, BritArmyPlacement } from "../brit-story.models";

export interface BritPlayerService {
  armyPlacement$ (nInfantries: number, nationId: BritNationId, playerId: BritPlayerId): Observable<BritArmyPlacement>;
  armyMovements$ (nationId: string, playerId: string): Observable<BritArmyMovements>;
} // BritPlayerService
