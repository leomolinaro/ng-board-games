import { Injectable } from "@angular/core";
import { WotrGameStore } from "../game/wotr-game.store";
import { WotrPlayerService } from "./wotr-player.service";

@Injectable ()
export class WotrPlayerAiService implements WotrPlayerService {

  constructor (private game: WotrGameStore) {}

  async firstPhase (): Promise<never> {
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
