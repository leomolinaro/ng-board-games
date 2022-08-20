import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BritNationId } from "../brit-components.models";
import { BritArmyPlacement } from "../brit-story.models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerService } from "./brit-player.service";

@Injectable ()
export class BritPlayerAiService implements BritPlayerService {

  constructor (
    private game: BritGameStore
  ) { }

  armyPlacement$ (nInfantries: number, nationId: BritNationId, playerId: string): Observable<BritArmyPlacement> {
    throw new Error("Method not implemented.");
  } // armiesPlacement$

} // BritPlayerAiService
