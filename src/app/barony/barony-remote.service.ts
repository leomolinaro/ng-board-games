import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, DocumentData, QueryFn } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { map, mapTo } from "rxjs/operators";
import { BaronyColor, BaronyLandType, landCoordinatesToId } from "./models";
import { BaronyStory } from "./process";

interface BaronyGameDoc {
  id: string;
  name: string;
  open: boolean;
  closed: boolean;
} // BaronyGameDoc

interface BaronyPlayerDoc {
  id: string;
  name: string;
  isAi: boolean;
  sort: number;
  color: BaronyColor;
  userId: string;
} // BaronyPlayerDoc

export interface BaronyLandDoc {
  id: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  type: BaronyLandType;
} // BaronyLandDoc

type BaronyStoryDoc = BaronyStory & { id: number };

@Injectable ({
  providedIn: "root"
})
export class BaronyRemoteService {

  constructor (private afs: AngularFirestore) { }

  private games = this.afs.collection<BaronyGameDoc> ("barony-games");
  private getPlayers (gameId: string, queryFn?: QueryFn<DocumentData> | undefined) { return this.afs.collection<BaronyPlayerDoc> (`barony-games/${gameId}/players`, queryFn); }
  private getLands (gameId: string) { return this.afs.collection<BaronyLandDoc> (`barony-games/${gameId}/lands`); }
  private getStories (gameId: string, queryFn?: QueryFn<DocumentData> | undefined) { return this.afs.collection<BaronyStoryDoc> (`barony-games/${gameId}/stories`, queryFn); }

  gamesChanges$ (): Observable<BaronyGameDoc[]> {
    return this.games.valueChanges ();
  } // selectGames$

  getGame$ (gameId: string): Observable<BaronyGameDoc | undefined> {
    const gameDoc = this.games.doc (gameId);
    return gameDoc.get ().pipe (map (snapshot => snapshot.data ()));
  } // getGame$

  getPlayers$ (gameId: string): Observable<BaronyPlayerDoc[]> {
    return this.getPlayers (gameId, ref => ref.orderBy ("sort")).get ().pipe (
      map (querySnapshot => querySnapshot.docs.map (queryDoc => queryDoc.data ()))
    );
  } // getPlayers$

  getLands$ (gameId: string): Observable<BaronyLandDoc[]> {
    return this.getLands (gameId).get ().pipe (
      map (querySnapshot => querySnapshot.docs.map (queryDoc => queryDoc.data ()))
    );
  } // getLands$

  getStories$ (gameId: string): Observable<BaronyStoryDoc[]> {
    return this.getStories (gameId, r => r.orderBy ("id")).get ().pipe (
      map (querySnapshot => querySnapshot.docs.map (queryDoc => queryDoc.data ()))
    );
  } // getPlayers$

  deleteGame$ (gameId: string): Observable<void> {
    const gameDoc = this.games.doc (gameId);
    return from (gameDoc.delete ());
  } // deleteGame$

  getStory$ (storyId: number, gameId: string): Observable<BaronyStoryDoc | undefined> {
    const storyDoc = this.getStories (gameId).doc (storyId + "");
    return storyDoc.valueChanges ();
  } // getStory$

  insertStory$ (story: BaronyStory, storyId: number, gameId: string) {
    return this.insert$<BaronyStoryDoc> (id => ({
      id: storyId,
      ...story
    }), this.getStories (gameId), storyId + "");
  } // insertAction$

  insertLand$ (coordinates: { x: number; y: number; z: number; }, type: BaronyLandType, gameId: string): Observable<BaronyLandDoc> {
    return this.insert$<BaronyLandDoc> (id => ({
      id: id,
      coordinates: coordinates,
      type: type
    }), this.getLands (gameId), landCoordinatesToId (coordinates));
  } // insertLand$

  insertPlayer$ (name: string, color: BaronyColor, isAi: boolean, sort: number, userId: string, gameId: string): Observable<BaronyPlayerDoc> {
    return this.insert$<BaronyPlayerDoc> (id => ({
      id: id,
      userId: userId,
      name: name,
      isAi: isAi,
      color: color,
      sort: sort
    }), this.getPlayers (gameId));
  } // insertPlayer$

  insertGame$ (name: string, userId: string): Observable<BaronyGameDoc> {
    return this.insert$<BaronyGameDoc> (id => ({
      id: id,
      userId: userId,
      name: name,
      open: true,
      closed: false
    }), this.games);
  } // insertGame$

  private insert$<T> (construction: (id: string) => T, collection: AngularFirestoreCollection<T>, id?: string): Observable<T> {
    if (!id) { id = this.afs.createId (); }
    const doc = collection.doc (id);
    const data = construction (id);
    const p = doc.set (data);
    return from (p).pipe (mapTo (data));
  } // insert$

} // BaronyRemoteService
