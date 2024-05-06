import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrStory } from "../wotr-story.models";
import { WotrPlayerService } from "./wotr-player.service";

@Injectable ()
export class WotrPlayerAiService implements WotrPlayerService {

  constructor (private game: WotrGameStore) {}

  firstPhaseDrawCards$ (front: WotrFrontId): Observable<WotrStory> {
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
