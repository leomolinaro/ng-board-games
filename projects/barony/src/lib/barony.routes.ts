import type { Routes } from '@angular/router';
import { BaronyGamePage } from './barony-game/barony-game-page';
import { BaronyHomeComponent } from './barony-home/barony-home.component';

export const routes: Routes = [
  { path: '', component: BaronyHomeComponent },
  { path: 'game/:gameId', component: BaronyGamePage },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
