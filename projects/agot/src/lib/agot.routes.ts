import type { Routes } from '@angular/router';
import { AGOT_FEATURE_PATHS } from './agot-features';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./agot-home').then((m) => m.AgotHome),
  },
  {
    path: AGOT_FEATURE_PATHS.draft,
    loadComponent: () =>
      import('./agot-draft/agot-draft-page').then((m) => m.AgotDraftPage),
  },
  {
    path: AGOT_FEATURE_PATHS.fcDecks,
    loadComponent: () =>
      import('./agot-fc-decks/agot-fc-decks-page').then(
        (m) => m.AgotFcDecksPage,
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
