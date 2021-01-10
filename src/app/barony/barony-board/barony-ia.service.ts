import { Injectable } from "@angular/core";
import { asyncScheduler, Observable } from "rxjs";
import { mapTo, observeOn, tap } from "rxjs/operators";
import { BaronyBoardService } from "./barony-board.service";

@Injectable ({
  providedIn: "root"
})
export class BaronyAiService {

  constructor (
    private service: BaronyBoardService
  ) { }

  resolveActions$ (aiPlayerIndicies: number[]): Observable<void> {
    return this.service.selectPendingTask$ ().pipe (
      observeOn (asyncScheduler), // N.B.: non chiarissimo del perchè
      tap (task => {
        if (task && aiPlayerIndicies.includes (task.playerIndex)) {
          this.service.resolveAiTask (task);
        } // if
      }),
      mapTo (void 0)
    );
  } // resolveActions$

} // BaronyAiService
