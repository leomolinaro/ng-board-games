import type { Routes } from '@angular/router';
import { BgRootGuard } from '@leobg/commons';
import { GAME_PATH } from './app-games';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: async () =>
      (await import('./app-home-page/app-home-page.routes')).routes,
  },
  {
    path: GAME_PATH.barony,
    canActivate: [BgRootGuard],
    loadChildren: async () => (await import('@leobg/barony')).routes,
  },
  {
    path: GAME_PATH.britannia,
    canActivate: [BgRootGuard],
    loadChildren: async () => (await import('@leobg/britannia')).routes,
  },
  {
    path: GAME_PATH.agotLcg2,
    loadChildren: async () => (await import('@leobg/agot')).routes,
  },
  {
    path: GAME_PATH.talisman,
    loadChildren: async () => (await import('@leobg/talisman')).routes,
  },
  {
    path: GAME_PATH.wort,
    canActivate: [BgRootGuard],
    loadChildren: async () => (await import('@leobg/wotr')).routes,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
