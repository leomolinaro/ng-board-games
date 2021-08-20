import { Injectable } from "@angular/core";

export const BG_PATHS = {
  barony: "barony",
  britannia: "britannia",
  agotLcg2: "a-game-of-thrones-lcg-2"
} // BG_PATHS

export interface BgApp {
  name: string;
  routerLink: string;
  imageSource: string;
} // BgApp

const APPS: BgApp[] = [
  { name: "Barony", routerLink: BG_PATHS.barony, imageSource: "assets/barony/game-image.jpg" },
  { name: "Britannia", routerLink: BG_PATHS.britannia, imageSource: "assets/britannia/game-image.jpg" },
  { name: "A Game of Thrones LCG 2.0", routerLink: BG_PATHS.agotLcg2, imageSource: "assets/agot/game-image.jpg" },
];

@Injectable ({
  providedIn: "root"
})
export class BgAppService {

  constructor () { }

  getApps () {
    return APPS;
  } // getApps

} // BgAppService
