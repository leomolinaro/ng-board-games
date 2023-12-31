import { Routes } from '@angular/router';
import { BG_PATHS } from './bg-services/bg-app.service';
import { BgRootGuard } from './bg-services/bg-root.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./bg-main-page/bg-main-page.module').then(
        (m) => m.BgMainPageModule
      ),
  },
  {
    path: BG_PATHS.barony,
    canActivate: [BgRootGuard],
    loadChildren: () =>
      import('./barony/barony.module').then((m) => m.BaronyModule),
  },
  {
    path: BG_PATHS.britannia,
    canActivate: [BgRootGuard],
    loadChildren: () =>
      import('./britannia/brit.module').then((m) => m.BritModule),
  },
  {
    path: BG_PATHS.agotLcg2,
    loadChildren: () => import('./agot/agot.module').then((m) => m.AgotModule),
  },
  {
    path: BG_PATHS.talisman,
    loadChildren: () =>
      import('./talisman/tlsm.module').then((m) => m.TlsmModule),
  },
  // { path: BG_PATHS.wort, canActivate: [BgRootGuard], loadChildren: () => import ("./barony/barony.module").then (m => m.BaronyModule) },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
