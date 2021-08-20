import { Injectable } from "@angular/core";

export const AGOT_UTILITY_PATHS = {
  draft: "draft", 
  fcDecks: "full-collection-decks" 
} // AGOT_UTILITY_PATHS

export interface AgotUtility {
  name: string;
  routerLink: string;
} // AgotUtility

const AGOT_UTILITIES: AgotUtility[] = [
  { name: "Draft", routerLink: AGOT_UTILITY_PATHS.draft },
  { name: "Full collection decks", routerLink: AGOT_UTILITY_PATHS.fcDecks }
];

@Injectable ({
  providedIn: "root"
})
export class AgotUtilityService {

  constructor () { }

  getUtilities () { return AGOT_UTILITIES; }

} // AgotUtilityService
