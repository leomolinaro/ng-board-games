import { Injectable } from "@angular/core";
import { BritGameStore } from "./brit-game.store";

@Injectable ()
export class BritPlayerAiService {

  constructor (
    private game: BritGameStore
  ) { }

} // BritPlayerAiService
