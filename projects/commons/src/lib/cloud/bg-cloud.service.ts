import { Injectable, inject } from "@angular/core";
import { CollectionReference, DocumentReference, FieldPath, Firestore, OrderByDirection, QueryConstraint, WhereFilterOp, collection, collectionData, deleteDoc, doc, docData, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from "@angular/fire/firestore";
import { Observable, from } from "rxjs";

export type BgCloudCollectionQuery<T> = (
  factory: BgCloudQueryContraintFactory
) => unknown;

export class BgCloudQueryContraintFactory {

  private qc: QueryConstraint[] = [];

  where (fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown) {
    this.qc.push (where (fieldPath, opStr, value));
    return this;
  }

  orderBy (fieldPath: string | FieldPath, directionStr?: OrderByDirection) {
    this.qc.push (orderBy (fieldPath, directionStr));
    return this;
  }

  get () { return this.qc; }

}

export class BgCloudCollection<T> {
  constructor (public path: string) {}
}

@Injectable ({
  providedIn: "root",
})
export class BgCloudService {

  private firestore = inject (Firestore);

  collection<T> (path: string): BgCloudCollection<T> {
    return new BgCloudCollection<T> (path); // collection (this.firestore, path, queryFn) as BgCloudCollection<T>;
  }

  selectAll$<T> (coll: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined): Observable<T[]> {
    if (queryFn) {
      const qf = new BgCloudQueryContraintFactory ();
      queryFn (qf);
      const q = query (this.getCollectionRef (coll), ...qf.get ());
      return collectionData (q);
    } else {
      return collectionData (this.getCollectionRef (coll)); // collection.valueChanges ();
    }
  }

  getAll$<T> (coll: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined): Observable<T[]> {
    return from (this.getAll (coll, queryFn));
  }

  async getAll<T> (coll: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined): Promise<T[]> {
    const snapshot = await this.getDocs (coll, queryFn);
    const result: T[] = [];
    snapshot.forEach (d => result.push (d.data ()));
    return result;
  }

  private async getDocs<T> (coll: BgCloudCollection<T>, queryFn?: BgCloudCollectionQuery<T> | undefined) {
    if (queryFn) {
      const qf = new BgCloudQueryContraintFactory ();
      queryFn (qf);
      const q = query (this.getCollectionRef (coll), ...qf.get ());
      return getDocs (q);
    } else {
      return getDocs (this.getCollectionRef (coll));
    }
  }

  private getCollectionRef<T> (coll: BgCloudCollection<T>, ...pathSegments: string[]): CollectionReference<T> {
    return collection (this.firestore, coll.path, ...pathSegments) as CollectionReference<T>;
  }

  select$<T> (path: string, coll: BgCloudCollection<T>): Observable<T | undefined> {
    return docData (this.getDocRef (coll, path));
  }

  get$<T> (path: string, coll: BgCloudCollection<T>): Observable<T | undefined> {
    return from (this.get (coll, path));
  }

  async get<T> (coll: BgCloudCollection<T>, ...pathSegments: string[]): Promise<T | undefined> {
    const snapshot = await getDoc (this.getDocRef (coll, ...pathSegments));
    return snapshot.data ();
  }

  private getDocRef<T> (coll: BgCloudCollection<T>, ...pathSegments: string[]): DocumentReference<T> {
    return doc (this.firestore, coll.path, ...pathSegments) as DocumentReference<T>;
  }

  insert$<T extends object> (constructor: (id: string) => T, coll: BgCloudCollection<T>): Observable<T> {
    return from (this.insert<T> (constructor, coll));
  }

  async insert<T extends object> (constructor: (id: string) => T, coll: BgCloudCollection<T>): Promise<T> {
    const docRef = doc (this.getCollectionRef (coll)); // N.B.: this.getDocRef (coll) dà errore per path non pari
    const id = docRef.id;
    const data = constructor (id);
    await setDoc (docRef, data);
    return data;
  }

  set$<T extends object> (id: string, data: T, coll: BgCloudCollection<T>): Observable<T> {
    return from (this.set (id, data, coll));
  }

  async set<T extends object> (id: string, data: T, coll: BgCloudCollection<T>): Promise<T> {
    await setDoc (this.getDocRef (coll, id), data);
    return data;
  }

  update$<T> (id: string, patch: Partial<T>, coll: BgCloudCollection<T>): Observable<void> {
    return from (this.update (id, patch, coll));
  }

  async update<T> (id: string, patch: Partial<T>, coll: BgCloudCollection<T>): Promise<void> {
    const docRef = this.getDocRef (coll, id);
    await updateDoc (docRef, patch);
  }

  deleteAll$<T> (coll: BgCloudCollection<T>): Observable<void> {
    return from (this.deleteAll (coll));
  }

  async deleteAll<T> (coll: BgCloudCollection<T>) {
    const snapshot = await this.getDocs (coll);
    const deletes: Promise<void>[] = [];
    snapshot.forEach ((r) => deletes.push (this.delete (r.id, coll)));
    await Promise.all (deletes);
  }

  delete$<T> (path: string, coll: BgCloudCollection<T>) {
    return from (this.delete (path, coll));
  }

  async delete<T> (path: string, coll: BgCloudCollection<T>) {
    const docRef = this.getDocRef (coll, path);
    await deleteDoc (docRef);
  }

}
