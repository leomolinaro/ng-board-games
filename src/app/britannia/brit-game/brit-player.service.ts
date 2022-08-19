import { Observable } from "rxjs";
import { BritNationId } from "../brit-components.models";
import { BritPlayerId } from "../brit-game-state.models";
import { BritArmiesPlacement } from "../brit-story.models";

export interface BritPlayerService {
  armiesPlacement$ (nInfantries: number, nationId: BritNationId, playerId: BritPlayerId): Observable<BritArmiesPlacement>;
  // turn$ (playerId: string): Observable<BaronyTurn>;
} // BritPlayerService
