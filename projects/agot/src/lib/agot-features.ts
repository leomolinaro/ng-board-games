export const AGOT_FEATURE_PATHS = {
  draft: 'draft',
  fcDecks: 'full-collection-decks',
};

export interface AgotFeature {
  name: string;
  routerLink: string;
}

export const AGOT_FEATURES: AgotFeature[] = [
  { name: 'Draft', routerLink: AGOT_FEATURE_PATHS.draft },
  { name: 'Full collection decks', routerLink: AGOT_FEATURE_PATHS.fcDecks },
];
