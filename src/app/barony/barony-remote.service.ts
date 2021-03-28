import { Injectable } from "@angular/core";
import { BgUser } from "@bg-services";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { BgCloudCollectionQuery, BgCloudService } from "../bg-services/bg-cloud.service";
import { BaronyColor, BaronyLandType, landCoordinatesToId } from "./models";
import { BaronyStory } from "./process";

export interface BaronyGameDoc {
  id: string;
  name: string;
  owner: {
    id: string;
    displayName: string;
  };
  local: boolean;
  state: "open" | "closed";
} // BaronyGameDoc

export interface BaronyPlayerDoc {
  id: string;
  name: string;
  isAi: boolean;
  sort: number;
  color: BaronyColor;
  userId: string | null;
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

  constructor (
    private cloud: BgCloudService
  ) { }

  private games = this.cloud.collection<BaronyGameDoc> ("barony-games");
  private getPlayers (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyPlayerDoc> | undefined) { return this.cloud.collection<BaronyPlayerDoc> (`barony-games/${gameId}/players`, queryFn); }
  private getLands (gameId: string) { return this.cloud.collection<BaronyLandDoc> (`barony-games/${gameId}/lands`); }
  private getStories (gameId: string, queryFn?: BgCloudCollectionQuery<BaronyStoryDoc> | undefined) { return this.cloud.collection<BaronyStoryDoc> (`barony-games/${gameId}/stories`, queryFn); }

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
    return this.cloud.insert$<BaronyStoryDoc> (id => ({
      id: storyId,
      ...story
    }), this.getStories (gameId), storyId + "");
  } // insertAction$

  insertLand$ (coordinates: { x: number; y: number; z: number; }, type: BaronyLandType, gameId: string): Observable<BaronyLandDoc> {
    return this.cloud.insert$<BaronyLandDoc> (id => ({
      id: id,
      coordinates: coordinates,
      type: type
    }), this.getLands (gameId), landCoordinatesToId (coordinates));
  } // insertLand$

  insertPlayer$ (name: string, color: BaronyColor, isAi: boolean, sort: number, userId: string | null, gameId: string): Observable<BaronyPlayerDoc> {
    return this.cloud.insert$<BaronyPlayerDoc> (id => ({
      id: id,
      userId: userId,
      name: name,
      isAi: isAi,
      color: color,
      sort: sort
    }), this.getPlayers (gameId));
  } // insertPlayer$

  insertGame$ (name: string, owner: BgUser, local: boolean): Observable<BaronyGameDoc> {
    return this.cloud.insert$<BaronyGameDoc> (id => ({
      id: id,
      owner: {
        id: owner.id,
        displayName: owner.displayName
      },
      name: name,
      local: local,
      state: "open"
    }), this.games);
  } // insertGame$

} // BaronyRemoteService
