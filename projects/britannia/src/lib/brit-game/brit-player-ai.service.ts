import { Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type {
  BritArmyMovements,
  BritArmyPlacement,
  BritBattleInitiation,
} from '../brit-story.models';
import type { BritPlayerService } from './brit-player.service';

@Injectable()
export class BritPlayerAiService implements BritPlayerService {
  armyPlacement$(): Observable<BritArmyPlacement> {
    throw new Error('Method not implemented.');
  }

  armyMovements$(): Observable<BritArmyMovements> {
    throw new Error('Method not implemented.');
  }

  battleInitiation$(): Observable<BritBattleInitiation> {
    throw new Error('Method not implemented.');
  }
}
