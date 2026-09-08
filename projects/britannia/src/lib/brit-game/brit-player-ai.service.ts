import { Injectable } from '@angular/core';
import type {
  BritArmyMovements,
  BritArmyPlacement,
  BritBattleInitiation,
} from '../brit-story.models';
import type { BritPlayerService } from './brit-player.service';

@Injectable()
export class BritPlayerAiService implements BritPlayerService {
  armyPlacement(): Promise<BritArmyPlacement> {
    throw new Error('Method not implemented.');
  }

  armyMovements(): Promise<BritArmyMovements> {
    throw new Error('Method not implemented.');
  }

  battleInitiation(): Promise<BritBattleInitiation> {
    throw new Error('Method not implemented.');
  }
}
