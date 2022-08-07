import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BritArmiesPlacement, BritNationId } from "../brit-models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerService } from "./brit-player.service";

@Injectable ()
export class BritPlayerAiService implements BritPlayerService {

  constructor (
    private game: BritGameStore
  ) { }

  armiesPlacement$ (nInfantries: number, nationId: BritNationId, playerId: string): Observable<BritArmiesPlacement> {
    throw new Error("Method not implemented.");
  } // armiesPlacement$

} // BritPlayerAiService
