import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";

interface BaronyGame {
  id: string;
  name: string;
} // BaronyGame

@Injectable ({
  providedIn: "root"
})
export class BaronyRemoteService {

  constructor (private afs: AngularFirestore) { }

  private games = this.afs.collection<BaronyGame> ("barony-games");

  selectGames$ (): Observable<BaronyGame[]> {
    return this.games.valueChanges ();
  } // selectGames$

  generateExampleData$ (): Observable<void> {
    const gameId = this.afs.createId ();
    const gameDoc = this.games.doc (gameId);
    return from (gameDoc.set ({
      id: gameId,
      name: "Partita 1"
    }));
  } // generateExampleData

} // BaronyRemoteService
