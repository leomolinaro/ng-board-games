import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { BritColor, BritNationId } from "../brit-components.models";
import { BritArmyMovements, BritArmyPlacement, BritBattleInitiation } from "../brit-story.models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerService } from "./brit-player.service";

@Injectable()
export class BritPlayerAiService implements BritPlayerService {
  private game = inject(BritGameStore);

  armyPlacement$(nInfantries: number, nationId: BritNationId, playerId: BritColor): Observable<BritArmyPlacement> {
    throw new Error("Method not implemented.");
  } // armiesPlacement$

  armyMovements$(nationId: BritNationId, playerId: BritColor): Observable<BritArmyMovements> {
    throw new Error("Method not implemented.");
  } // armyMovements$

  battleInitiation$(nationId: BritNationId, playerId: BritColor): Observable<BritBattleInitiation> {
    throw new Error("Method not implemented.");
  } // battleInitiation$
} // BritPlayerAiService
