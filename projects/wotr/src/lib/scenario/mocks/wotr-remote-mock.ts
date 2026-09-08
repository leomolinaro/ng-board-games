import { Injectable, inject } from '@angular/core';
import type { BgUser } from '@leobg/commons';
import type { WotrStoryDoc } from '../../game/wotr-story-models';
import type {
  WotrGameDoc,
  WotrPlayerDoc,
} from '../../remote/wotr-remote-models';
import { WotrScenarios } from '../wotr-scenarios';
import { WotrStoriesBuilder } from '../wotr-story-builder';

function mockUser(user: Partial<BgUser>): BgUser {
  return user as BgUser;
}

@Injectable()
export class WotrRemoteMock {
  private examples = inject(WotrScenarios);

  getGame(): WotrGameDoc {
    return {
      id: '123',
      name: 'test',
      state: 'closed',
      online: false,
      owner: mockUser({}),
      options: {
        expansions: [],
        variants: [],
        tokens: [],
      },
    };
  }

  getPlayers(): WotrPlayerDoc[] {
    return [
      {
        id: 'free-peoples',
        name: 'FP',
        controller: mockUser({ id: 'me' }),
        isAi: false,
        sort: 1,
      },
      {
        id: 'shadow',
        name: 'S',
        controller: mockUser({ id: 'me' }),
        isAi: false,
        sort: 2,
      },
    ];
  }

  getStories(gameId: string): WotrStoryDoc[] {
    return this.examples
      .getScenario(gameId)
      .loadDefinition()
      .stories(new WotrStoriesBuilder());
  }
}
