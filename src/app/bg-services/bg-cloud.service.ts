import { Injectable, inject } from "@angular/core";
import { CollectionReference, DocumentReference, FieldPath, Firestore, OrderByDirection, QueryConstraint, WhereFilterOp, collection, collectionData, deleteDoc, doc, docData, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "@angular/fire/firestore";
import { Observable, from } from "rxjs";

// export type BgCloudCollection<T> = CollectionReference<T>;
export type BgCloudCollectionQuery<T> = (factory: BgCloudQueryContraintFactory) => QueryConstraint;

export class BgCloudQueryContraintFactory {

  where (fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown) {
    return where (fieldPath, opStr, value);
  } // where

  orderBy (fieldPath: string | FieldPath, directionStr?: OrderByDirection) {
    return orderBy (fieldPath, directionStr);
  } // orderBy

} // BgCloudQueryContraintFactory

export class BgCloudCollection<T> {
  constructor (
    public path: string,
  ) { }
} // BgCloudCollection

@Injectable ({
  providedIn: "root"
})
export class BgCloudService {

  private firestore: Firestore = inject (Firestore);
  private queryFactory = new BgCloudQueryContraintFactory ();

  collection<T> (path: string): BgCloudCollection<T> {
    return new BgCloudCollection<T> (path); // collection (this.firestore, path, queryFn) as BgCloudCollection<T>;
  } // collection

  selectAll$<T> (collection: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined): Observable<T[]> {
    if (queryFn) {
      const q = query (this.getCollectionRef (collection), queryFn (this.queryFactory));
      return collectionData (q);
    } else {
      return collectionData (this.getCollectionRef (collection)); // collection.valueChanges ();
    } // if - else
  } // selectAll$

  getAll$<T> (collection: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined): Observable<T[]> {
    return from (this.getAll (collection, queryFn));
  } // getAll$

  async getAll<T> (collection: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined): Promise<T[]> {
    const snapshot = await this.getDocs (collection, queryFn);
    const result: T[] = [];
    snapshot.forEach (doc => result.push (doc.data ()));
    return result;
  } // getAll

  private async getDocs<T> (collection: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined) {
    if (queryFn) {
      const q = query (this.getCollectionRef (collection), queryFn (this.queryFactory));
      return getDocs (q);
    } else {
      return getDocs (this.getCollectionRef (collection));
    } // if - else
  } // getDocs

  private getCollectionRef<T> (coll: BgCloudCollection<T>, ...pathSegments: string[]): CollectionReference<T> {
    return collection (this.firestore, coll.path, ...pathSegments) as CollectionReference<T>;
  } // getCollectionRef

  select$<T> (path: string, collection: BgCloudCollection<T>): Observable<T | undefined> {
    return docData (this.getDocRef (collection, path));
  } // select$

  get$<T> (path: string, collection: BgCloudCollection<T>): Observable<T | undefined> {
    return from (this.get (collection, path));
  } // get$

  async get<T> (collection: BgCloudCollection<T>, ...pathSegments: string[]): Promise<T | undefined> {
    const snapshot = await getDoc (this.getDocRef (collection, ...pathSegments));
    return snapshot.data ();
  } // get

  private getDocRef<T> (collection: BgCloudCollection<T>, ...pathSegments: string[]): DocumentReference<T> {
    return doc (this.firestore, collection.path, ...pathSegments) as DocumentReference<T>;
  } // getDocRef

  insert$<T extends object> (constructor: (id: string) => T, collection: BgCloudCollection<T>): Observable<T>;
  insert$<T extends object> (data: T, id: string, collection: BgCloudCollection<T>): Observable<T>;
  insert$<T extends object> (...args: any[]): Observable<T> { return from (this._insert<T> (...args)); }

  async insert<T extends object> (constructor: (id: string) => T, collection: BgCloudCollection<T>): Promise<T>;
  async insert<T extends object> (data: T, id: string, coll: BgCloudCollection<T>): Promise<T>;
  async insert<T extends object> (...args: any[]): Promise<T> { return this._insert (...args); }
  async _insert<T extends object> (...args: any[]): Promise<T> {
    let id: string;
    let data: T;
    let coll: BgCloudCollection<T>;
    if (args.length === 2) {
      const constructor: (id: string) => T = args[0];
      coll = args[1];
      const docRef = doc (this.getCollectionRef (coll)); // N.B.: this.getDocRef (coll) dà errore per path non pari
      const id = docRef.id;
      data = constructor (id);
      await setDoc (docRef, data);
      return data;
    } else {
      data = args[0];
      id = args[1];
      coll = args[2];
      await setDoc (this.getDocRef (coll, id), data);
      return data;
    } // if - else
  } // _insert

  update$<T> (patch: Partial<T>, id: string, collection: BgCloudCollection<T>): Observable<void> {
    console.log (collection, id, patch);
    return from (this.update (patch, id, collection));
  } // update$

  async update<T> (patch: Partial<T>, id: string, collection: BgCloudCollection<T>): Promise<void> {
    const docRef = this.getDocRef (collection, id);
    await updateDoc (docRef, patch)
  } // update

  deleteAll$<T> (collection: BgCloudCollection<T>): Observable<void> {
    return from (this.deleteAll (collection));
  } // deleteAll$

  async deleteAll<T> (collection: BgCloudCollection<T>) {
    const snapshot = await this.getDocs (collection);
    const deletes: Promise<void>[] = [];
    snapshot.forEach (r => deletes.push (this.delete (r.id, collection)));
    await Promise.all (deletes);
  } // deleteAll$

  delete$<T> (path: string, collection: BgCloudCollection<T>) {
    return from (this.delete (path, collection));
  } // delete$

  async delete<T> (path: string, collection: BgCloudCollection<T>) {
    const docRef = this.getDocRef (collection, path);
    await deleteDoc (docRef);
  } // delete$

} // BgCloudService
