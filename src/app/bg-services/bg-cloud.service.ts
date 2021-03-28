import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, DocumentData, QueryFn } from "@angular/fire/firestore";
import { from, Observable } from "rxjs";
import { mapTo } from "rxjs/operators";

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

  insert$<T> (construction: (id: string) => T, collection: BgCloudCollection<T>, id?: string): Observable<T> {
    if (!id) { id = this.afs.createId (); }
    const doc = collection.doc (id);
    const data = construction (id);
    const p = doc.set (data);
    return from (p).pipe (mapTo (data));
  } // insert$

  update$<T> (patch: Partial<T>, id: string, collection: BgCloudCollection<T>): Observable<void> {
    const doc = collection.doc (id);
    const p = doc.update (patch);
    return from (p);
  } // insert$

} // BgCloudService
