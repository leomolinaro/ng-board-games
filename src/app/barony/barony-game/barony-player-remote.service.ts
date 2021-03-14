import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { BaronyRemoteService } from "../barony-remote.service";
import { BaronyGameStore } from "../logic";
import { BaronyProcessTask } from "../process";
import { BaronyUiStore } from "./barony-ui.store";

@Injectable ()
export class BaronyPlayerRemoteService {

  constructor (
    private game: BaronyGameStore,
    private ui: BaronyUiStore,
    private remote: BaronyRemoteService
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

} // BaronyPlayerRemoteService
