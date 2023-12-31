import { Injectable } from "@angular/core";

export const GAME_PATH = {
  barony: "barony",
  britannia: "britannia",
  wort: "war-of-the-ring-2",
  agotLcg2: "a-game-of-thrones-lcg-2",
  talisman: "talisman",
}; // GAME_PATH

export interface Games {
  name: string;
  routerLink: string;
  imageSource: string;
} // Games

const GAMES: Games[] = [
  { name: "Barony", routerLink: GAME_PATH.barony, imageSource: "assets/barony/game-image.jpg" },
  { name: "Britannia", routerLink: GAME_PATH.britannia, imageSource: "assets/britannia/game-image.jpg" },
  { name: "A Game of Thrones LCG 2.0", routerLink: GAME_PATH.agotLcg2, imageSource: "assets/agot/game-image.jpg" },
  { name: "Talisman", routerLink: GAME_PATH.talisman, imageSource: "assets/talisman/game-image.jpg" },
  { name: "War of the Ring", routerLink: GAME_PATH.wort, imageSource: "assets/wotr/game-image.png" },
];

@Injectable ({
  providedIn: "root",
})
export class AppGamesService {
  constructor () {}

  getGames () {
    return GAMES;
  } // getGames

} // AppGamesService
