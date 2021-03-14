import { Injectable } from "@angular/core";
import { AngularFirestore, DocumentData, QueryFn } from "@angular/fire/firestore";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";

export interface BgUser {
  id: string;
  username: string;
} // BgUser

@Injectable ({
  providedIn: "root"
})
export class BgAuthService {

  constructor (
    private afs: AngularFirestore
  ) { }

  private $loggedUser = new BehaviorSubject<BgUser | null> (null);

  private getUsers (queryFn?: QueryFn<DocumentData>) { return this.afs.collection<BgUser> ("users", queryFn); }

  userChanges$ () { return this.getUsers ().valueChanges (); }

  getLoggedUser$ () { return this.$loggedUser.asObservable (); }
  getLoggedUser () { return this.$loggedUser.getValue () as BgUser; }
  isLoggedUserId (userId: string) { return this.getLoggedUser ()?.id === userId; }

  loadUserByUsername$ (username: string) {
    return this.getUsers (ref => ref.where ("username", "==", username))
    .get ().pipe (
      map (snapshot => snapshot.size ? snapshot.docs[0].data () : null),
    );
  } // loadUserByUsername$

  login$ (username: string) {
    return this.getUsers (ref => ref.where ("username", "==", username))
    .get ().pipe (
      map (snapshot => snapshot.size ? snapshot.docs[0].data () : null),
      tap (user => this.$loggedUser.next (user))
    );
  } // login

} // BgAuthServiceService
