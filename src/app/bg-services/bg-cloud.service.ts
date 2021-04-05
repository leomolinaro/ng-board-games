import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, DocumentData, QueryFn } from "@angular/fire/firestore";
import { forkJoin, from, Observable } from "rxjs";
import { map, mapTo, switchMap } from "rxjs/operators";

export type BgCloudCollection<T> = AngularFirestoreCollection<T>;
export type BgCloudCollectionQuery<T> = QueryFn<DocumentData>;

@Injectable ({
  providedIn: "root"
})
export class BgCloudService {
  
  constructor (
    private afs: AngularFirestore
  ) { }

  collection<T> (path: string, queryFn?: BgCloudCollectionQuery<T> | undefined): BgCloudCollection<T> {
    return this.afs.collection (path, queryFn);
  } // collection

  selectAll$<T> (collection: BgCloudCollection<T>): Observable<T[]> {
    return collection.valueChanges ();
  } // selectAll$

  select$<T> (path: string, collection: BgCloudCollection<T>): Observable<T | undefined> {
    const doc = collection.doc (path);
    return doc.valueChanges ();
  } // select$

  get$<T> (path: string, collection: BgCloudCollection<T>): Observable<T | undefined> {
    const gameDoc = collection.doc (path);
    return gameDoc.get ().pipe (map (snapshot => snapshot.data ()));
  } // get$

  getAll$<T> (collection: BgCloudCollection<T>): Observable<T[]> {
    return collection.get ().pipe (map (snapshot => snapshot.docs.map (d => d.data ())));
  } // getAll$

  insert$<T> (constructor: (id: string) => T, collection: BgCloudCollection<T>): Observable<T>;
  insert$<T> (data: T, id: string, collection: BgCloudCollection<T>): Observable<T>;
  insert$<T> (...args: any[]): Observable<T> {
    let id: string;
    let data: T;
    let collection: BgCloudCollection<T>;
    if (args.length === 2) {
      const constructor: (id: string) => T = args[0];
      collection = args[1];
      id = this.afs.createId ();
      data = constructor (id);
    } else {
      data = args[0];
      id = args[1];
      collection = args[2];
    } // if - else
    const doc = collection.doc (id);
    const p = doc.set (data);
    return from (p).pipe (mapTo (data));
  } // insert

  update$<T> (patch: Partial<T>, id: string, collection: BgCloudCollection<T>): Observable<void> {
    const doc = collection.doc (id);
    const p = doc.update (patch);
    return from (p);
  } // insert$

  deleteAll$<T> (collection: BgCloudCollection<T>): Observable<void> {
    return collection.get ().pipe (
      switchMap (querySnapshot => forkJoin (
        querySnapshot.docs.map (queryDocSnapshot => {
          const doc = collection.doc (queryDocSnapshot.id);
          return from (doc.delete ());
        })
      )),
      mapTo (void 0)
    );
  } // deleteAll$

  delete$<T> (path: string, collection: BgCloudCollection<T>) {
    const doc = collection.doc (path);
    return from (doc.delete ());
  } // delete$

} // BgCloudService
