import { Injectable } from "@angular/core";
import { BritGameStore } from "./brit-game.store";
import { BritUiStore } from "./brit-ui.store";

@Injectable ()
export class BritPlayerLocalService {

  constructor (
    private game: BritGameStore,
    private ui: BritUiStore
  ) { }

} // BritPlayerLocalService
