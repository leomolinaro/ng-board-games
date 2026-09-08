import type { Routes } from '@angular/router';
import { AGOT_FEATURE_PATHS } from './agot-features';

export const routes: Routes = [
  {
    path: '',
    loadComponent: async () => (await import('./agot-home')).AgotHome,
  },
  {
    path: AGOT_FEATURE_PATHS.draft,
    loadComponent: async () =>
      (await import('./agot-draft/agot-draft-page')).AgotDraftPage,
  },
  {
    path: AGOT_FEATURE_PATHS.fcDecks,
    loadComponent: async () =>
      (await import('./agot-fc-decks/agot-fc-decks-page')).AgotFcDecksPage,
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
