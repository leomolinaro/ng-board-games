import { inject } from '@angular/core';
import type { Routes } from '@angular/router';
import { type Observable } from 'rxjs';
import { WotrMapService } from './game/board/map/wotr-map.service';
import { WotrGamePage } from './game/wotr-game-page';
import { WotrHomePage } from './home/wotr-home-page';
import { WotrScenarioPage } from './scenario/wotr-scenario-page';

const gameResolvers = {
  mapPaths: (): Observable<boolean> => inject(WotrMapService).loadMapPaths$(),
  regionSlots: (): Observable<boolean> =>
    inject(WotrMapService).loadRegionSlots$(),
};

export const routes: Routes = [
  { path: '', component: WotrHomePage },
  { path: 'game/:gameId', component: WotrGamePage, resolve: gameResolvers },
  {
    path: 'scenario/:gameId',
    component: WotrScenarioPage,
    resolve: gameResolvers,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
