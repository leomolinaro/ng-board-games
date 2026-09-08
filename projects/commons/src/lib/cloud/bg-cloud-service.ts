import { Injectable } from '@angular/core';
import type {
  CollectionReference,
  DocumentReference,
  FieldPath,
  Firestore,
  OrderByDirection,
  Query,
  QueryConstraint,
  WhereFilterOp,
} from 'firebase/firestore';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { Observable, from } from 'rxjs';

export type BgCloudCollectionQuery<_T> = (
  factory: BgCloudQueryContraintFactory,
) => unknown;

export class BgCloudQueryContraintFactory {
  private qc: QueryConstraint[] = [];

  where(fieldPath: string | FieldPath, opStr: WhereFilterOp, value: unknown) {
    this.qc.push(where(fieldPath, opStr, value));
    return this;
  }

  orderBy(fieldPath: string | FieldPath, directionStr?: OrderByDirection) {
    this.qc.push(orderBy(fieldPath, directionStr));
    return this;
  }

  get() {
    return this.qc;
  }
}

export class BgCloudCollection<_T> {
  constructor(public path: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class BgCloudService {
  private firestore: Firestore = getFirestore();

  collection<T>(path: string): BgCloudCollection<T> {
    return new BgCloudCollection<T>(path); // collection (this.firestore, path, queryFn) as BgCloudCollection<T>;
  }

  selectAll$<T>(
    coll: BgCloudCollection<T>,
    queryFn?: BgCloudCollectionQuery<T>,
  ): Observable<T[]> {
    if (queryFn) {
      const qf = new BgCloudQueryContraintFactory();
      queryFn(qf);
      const q = query(this.getCollectionRef(coll), ...qf.get());
      return this.collectionData$<T>(q);
    }
    return this.collectionData$<T>(this.getCollectionRef(coll));
  }

  getAll$<T>(
    coll: BgCloudCollection<T>,
    queryFn?: BgCloudCollectionQuery<T>,
  ): Observable<T[]> {
    return from(this.getAll(coll, queryFn));
  }

  async getAll<T>(
    coll: BgCloudCollection<T>,
    queryFn?: BgCloudCollectionQuery<T>,
  ): Promise<T[]> {
    const snapshot = await this.getDocs(coll, queryFn);
    const result: T[] = [];
    snapshot.forEach((d) => {
      result.push(d.data());
    });
    return result;
  }

  private async getDocs<T>(
    coll: BgCloudCollection<T>,
    queryFn?: BgCloudCollectionQuery<T>,
  ) {
    if (queryFn) {
      const qf = new BgCloudQueryContraintFactory();
      queryFn(qf);
      const q = query(this.getCollectionRef(coll), ...qf.get());
      return getDocs(q);
    }

    return getDocs(this.getCollectionRef(coll));
  }

  private getCollectionRef<T>(
    coll: BgCloudCollection<T>,
    ...pathSegments: string[]
  ): CollectionReference<T> {
    return collection(
      this.firestore,
      coll.path,
      ...pathSegments,
    ) as CollectionReference<T>;
  }

  select$<T>(
    path: string,
    coll: BgCloudCollection<T>,
  ): Observable<T | undefined> {
    return this.docData$<T>(this.getDocRef(coll, path));
  }

  get$<T>(path: string, coll: BgCloudCollection<T>): Observable<T | undefined> {
    return from(this.get(path, coll));
  }

  async get<T>(
    path: string,
    coll: BgCloudCollection<T>,
  ): Promise<T | undefined> {
    const snapshot = await getDoc(this.getDocRef(coll, path));
    return snapshot.data();
  }

  private getDocRef<T>(
    coll: BgCloudCollection<T>,
    ...pathSegments: string[]
  ): DocumentReference<T> {
    return doc(
      this.firestore,
      coll.path,
      ...pathSegments,
    ) as DocumentReference<T>;
  }

  insert$<T extends object>(
    constructor: (id: string) => T,
    coll: BgCloudCollection<T>,
  ): Observable<T> {
    return from(this.insert<T>(constructor, coll));
  }

  async insert<T extends object>(
    constructor: (id: string) => T,
    coll: BgCloudCollection<T>,
  ): Promise<T> {
    const docRef = doc(this.getCollectionRef(coll)); // N.B.: this.getDocRef (coll) dà errore per path non pari
    const id = docRef.id;
    const data = constructor(id);
    await setDoc(docRef, data);
    return data;
  }

  set$<T extends object>(
    id: string,
    data: T,
    coll: BgCloudCollection<T>,
  ): Observable<T> {
    return from(this.set(id, data, coll));
  }

  async set<T extends object>(
    id: string,
    data: T,
    coll: BgCloudCollection<T>,
  ): Promise<T> {
    await setDoc(this.getDocRef(coll, id), data);
    return data;
  }

  update$<T>(
    id: string,
    patch: Partial<T>,
    coll: BgCloudCollection<T>,
  ): Observable<void> {
    return from(this.update(id, patch, coll));
  }

  async update<T>(
    id: string,
    patch: Partial<T>,
    coll: BgCloudCollection<T>,
  ): Promise<void> {
    const docRef = this.getDocRef(coll, id);
    await updateDoc(docRef, patch);
  }

  deleteAll$<T>(coll: BgCloudCollection<T>): Observable<void> {
    return from(this.deleteAll(coll));
  }

  async deleteAll<T>(coll: BgCloudCollection<T>) {
    const snapshot = await this.getDocs(coll);
    const deletes: Promise<void>[] = [];
    snapshot.forEach((r) => {
      deletes.push(this.delete(r.id, coll));
    });
    await Promise.all(deletes);
  }

  delete$<T>(path: string, coll: BgCloudCollection<T>) {
    return from(this.delete(path, coll));
  }

  async delete<T>(path: string, coll: BgCloudCollection<T>) {
    const docRef = this.getDocRef(coll, path);
    await deleteDoc(docRef);
  }

  private collectionData$<T>(ref: Query<T> | CollectionReference<T>) {
    return new Observable<T[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          subscriber.next(snapshot.docs.map((docSnap) => docSnap.data()));
        },
        (error) => subscriber.error(error),
      );

      return unsubscribe;
    });
  }

  private docData$<T>(ref: DocumentReference<T>) {
    return new Observable<T | undefined>((subscriber) => {
      const unsubscribe = onSnapshot(
        ref,
        (snapshot) => {
          subscriber.next(snapshot.data());
        },
        (error) => subscriber.error(error),
      );

      return unsubscribe;
    });
  }
}
