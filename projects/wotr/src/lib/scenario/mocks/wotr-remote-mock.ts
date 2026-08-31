import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import type { WotrStoryDoc } from '../../game/wotr-story-models';
import type {
  WotrGameDoc,
  WotrPlayerDoc,
} from '../../remote/wotr-remote-models';
import { WotrScenarios } from '../wotr-scenarios';
import { WotrStoriesBuilder } from '../wotr-story-builder';

@Injectable()
export class WotrRemoteMock {
  private examples = inject(WotrScenarios);

  async getGame(): Promise<WotrGameDoc> {
    return {
      id: '123',
      name: 'test',
      state: 'closed',
      online: false,
      owner: {} as any,
      options: {
        expansions: [],
        variants: [],
        tokens: [],
      },
    };
  }
  selectGames$(): any {
    throw new Error('Mock remote');
  }
  insertGame$(): Observable<WotrGameDoc> {
    throw new Error('Mock remote');
  }
  updateGame$(): any {
    throw new Error('Mock remote');
  }
  deleteGame$(): any {
    throw new Error('Mock remote');
  }

  async getPlayers(): Promise<WotrPlayerDoc[]> {
    return [
      { id: 'free-peoples', name: 'FP', controller: { id: 'me' } },
      { id: 'shadow', name: 'S', controller: { id: 'me' } },
    ] as any;
  }
  selectPlayers$(): any {
    throw new Error('Mock remote');
  }
  selectPlayer$(): any {
    throw new Error('Mock remote');
  }
  insertPlayer$(): any {
    throw new Error('Mock remote');
  }
  updatePlayer$(): any {
    throw new Error('Mock remote');
  }
  deletePlayer$(): any {
    throw new Error('Mock remote');
  }
  deletePlayers$(): any {
    throw new Error('Mock remote');
  }

  async getStories(gameId: string): Promise<WotrStoryDoc[]> {
    return (await this.examples.getScenario(gameId).loadDefinition()).stories(
      new WotrStoriesBuilder(),
    );
  }
  getStory$(): any {
    throw new Error('Mock remote');
  }
  selectStories$(): any {
    throw new Error('Mock remote');
  }
  selectStory$(): any {
    throw new Error('Mock remote');
  }
  insertStory$(): any {
    // throw new Error("Mock remote");
    return of(null);
  }
  deleteStory$(): any {
    throw new Error('Mock remote');
  }
  deleteStories$(): any {
    throw new Error('Mock remote');
  }
}
