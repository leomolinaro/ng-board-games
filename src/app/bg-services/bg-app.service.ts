import { Injectable } from "@angular/core";

export interface BgApp {
  name: string;
  routerLink: string;
  imageSource: string;
} // BgApp

const APPS: BgApp[] = [
  { name: "Barony", routerLink: "barony", imageSource: "assets/barony/game-image.jpg" },
  { name: "Britannia", routerLink: "britannia", imageSource: "assets/britannia/game-image.jpg" },
  { name: "Agot draft", routerLink: "agot-draft", imageSource: "assets/agot-draft/game-image.jpg" },
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
