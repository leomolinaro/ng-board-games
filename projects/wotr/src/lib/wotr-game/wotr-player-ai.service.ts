import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WotrFront } from "../wotr-components/front.models";
import { WotrStory } from "../wotr-story.models";
import { WotrGameStore } from "./wotr-game.store";
import { WotrPlayerService } from "./wotr-player.service";

@Injectable ()
export class WotrPlayerAiService implements WotrPlayerService {

  constructor (private game: WotrGameStore) {}

  firstPhaseDrawCards$ (front: WotrFront): Observable<WotrStory> {
    throw new Error ("Method not implemented.");
  }

  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement> {
  //   throw new Error ("Method not implemented.");
  // } // armiesPlacement$

  // armyMovements$ (nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyMovements> {
  //   throw new Error ("Method not implemented.");
  // } // armyMovements$

  // battleInitiation$ (nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrBattleInitiation> {
  //   throw new Error ("Method not implemented.");
  // } // battleInitiation$
  
} // WotrPlayerAiService