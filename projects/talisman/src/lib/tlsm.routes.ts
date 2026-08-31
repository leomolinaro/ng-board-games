import { Routes } from '@angular/router';
import { TlsmDragonScalesPage } from './tlsm-dragon-scales/tlsm-dragon-scales-page';

export const routes: Routes = [
  { path: '', component: TlsmDragonScalesPage },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
