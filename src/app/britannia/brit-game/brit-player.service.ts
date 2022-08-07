import { Observable } from "rxjs";
import { BritArmiesPlacement, BritNationId, BritPlayerId } from "../brit-models";

export interface BritPlayerService {
  armiesPlacement$ (nInfantries: number, nationId: BritNationId, playerId: BritPlayerId): Observable<BritArmiesPlacement>;
  // turn$ (playerId: string): Observable<BaronyTurn>;
} // BritPlayerService
