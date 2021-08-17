import { Injectable } from "@angular/core";

export const AGOT_UTILITY_PATHS = {
  draft: "draft", 
  fcPacks: "full-collection-packs" 
} // AGOT_UTILITY_PATHS

export interface AgotUtility {
  name: string;
  routerLink: string;
} // AgotUtility

const AGOT_UTILITIES: AgotUtility[] = [
  { name: "Draft", routerLink: AGOT_UTILITY_PATHS.draft },
  { name: "Full collection packs", routerLink: AGOT_UTILITY_PATHS.fcPacks }
];

@Injectable ({
  providedIn: "root"
})
export class AgotUtilityService {

  constructor () { }

  getUtilities () { return AGOT_UTILITIES; }

} // AgotUtilityService
