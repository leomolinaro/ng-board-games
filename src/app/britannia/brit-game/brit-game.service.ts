import { Injectable } from "@angular/core";
import { EMPTY, Observable, of } from "rxjs";
import { expand, last, mapTo } from "rxjs/operators";
import { BritStoryDoc } from "../brit-remote.service";

@Injectable ()
export class BritGameService {

  constructor () { }

  private lastStoryId: number = 0;
  private stories: BritStoryDoc[] | null = null;

  game$ (stories: BritStoryDoc[]): Observable<void> {
    this.stories = stories;
    this.setup ();
    return this.round$ (1).pipe (
      expand (prevRoundNumber => {
        const roundNumber = prevRoundNumber + 1;
        if (roundNumber <= 16) {
          return this.round$ (roundNumber);
        } else {
          return EMPTY;
        } // if - else
      }),
      last (),
      mapTo (void 0)
    );
  } // game$

  setup () { }

  round$ (roundNumber: number): Observable<number> {
    return of (roundNumber);
  } // round$

} // BritGameService
