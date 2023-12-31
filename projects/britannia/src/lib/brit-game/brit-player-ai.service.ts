import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BritNationId } from '../brit-components.models';
import { BritPlayerId } from '../brit-game-state.models';
import {
  BritArmyMovements,
  BritArmyPlacement,
  BritBattleInitiation,
} from '../brit-story.models';
import { BritGameStore } from './brit-game.store';
import { BritPlayerService } from './brit-player.service';

@Injectable()
export class BritPlayerAiService implements BritPlayerService {
  constructor(private game: BritGameStore) {}

  armyPlacement$(
    nInfantries: number,
    nationId: BritNationId,
    playerId: BritPlayerId
  ): Observable<BritArmyPlacement> {
    throw new Error('Method not implemented.');
  } // armiesPlacement$

  armyMovements$(
    nationId: BritNationId,
    playerId: BritPlayerId
  ): Observable<BritArmyMovements> {
    throw new Error('Method not implemented.');
  } // armyMovements$

  battleInitiation$(
    nationId: BritNationId,
    playerId: BritPlayerId
  ): Observable<BritBattleInitiation> {
    throw new Error('Method not implemented.');
  } // battleInitiation$
} // BritPlayerAiService
