import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { BaronyGameStore } from "../logic";
import { BaronyProcessTask } from "../process";
import { BaronyUiStore } from "./barony-ui.store";

@Injectable ()
export class BaronyPlayerObserverService {

  constructor (
    private game: BaronyGameStore,
    private ui: BaronyUiStore
  ) { }

  executeTask$ (task: BaronyProcessTask): Observable<null> {
    this.ui.updateUi (s => ({
      ...s,
      turnPlayer: task.data.player,
      ...this.ui.resetUi (),
      message: `${this.game.getPlayer (task.data.player).name} is thinking...`,
    }));
    return of (null);
  } // executeTask$

} // BaronyPlayerObserverService
