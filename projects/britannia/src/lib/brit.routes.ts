import { Injectable, inject } from '@angular/core';
import type { Resolve, Routes } from '@angular/router';
import type { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';
import { BritGamePage } from './brit-game/brit-game-page';
import { BritHome } from './brit-home';
import { BritMapService } from './brit-map/brit-map.service';

@Injectable({
  providedIn: 'root',
})
export class BritAreaPathResolver implements Resolve<unknown> {
  private mapService = inject(BritMapService);

  resolve(): Observable<unknown> {
    return forkJoin([
      this.mapService.loadAreaPaths$(),
      this.mapService.loadAreaSlots$(),
    ]);
  }
}

const gameResolvers = {
  areaPaths: BritAreaPathResolver,
};

export const routes: Routes = [
  { path: '', component: BritHome },
  { path: 'game/:gameId', component: BritGamePage, resolve: gameResolvers },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
