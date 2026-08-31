import { Routes } from '@angular/router';
import { BgRootGuard } from '@leobg/commons';
import { GAME_PATH } from './app-games';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./app-home-page/app-home-page.routes').then((m) => m.routes),
  },
  {
    path: GAME_PATH.barony,
    canActivate: [BgRootGuard],
    loadChildren: () => import('@leobg/barony').then((m) => m.routes),
  },
  {
    path: GAME_PATH.britannia,
    canActivate: [BgRootGuard],
    loadChildren: () => import('@leobg/britannia').then((m) => m.routes),
  },
  {
    path: GAME_PATH.agotLcg2,
    loadChildren: () => import('@leobg/agot').then((m) => m.routes),
  },
  {
    path: GAME_PATH.talisman,
    loadChildren: () => import('@leobg/talisman').then((m) => m.routes),
  },
  {
    path: GAME_PATH.wort,
    canActivate: [BgRootGuard],
    loadChildren: () => import('@leobg/wotr').then((m) => m.routes),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
