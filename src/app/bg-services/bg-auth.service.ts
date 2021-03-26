import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import firebase from "firebase/app";
import { BehaviorSubject, from, of, throwError } from "rxjs";
import { catchError, first, switchMap } from "rxjs/operators";
import { BgCloudCollectionQuery, BgCloudService } from "./bg-cloud.service";

export interface BgUser {
  id: string;
  email: string;
  displayName: string;
} // BgUser

@Injectable ({
  providedIn: "root"
})
export class BgAuthService {

  constructor (
    public afa: AngularFireAuth,
    private cloud: BgCloudService
  ) { }

  private $user = new BehaviorSubject<BgUser | null> (null);

  private getUsers (queryFn?: BgCloudCollectionQuery<BgUser>) { return this.cloud.collection<BgUser> ("users", queryFn); }

  getUser$ () { return this.$user.asObservable (); }
  getUser () { return this.$user.getValue () as BgUser; }
  hasUser () { return !!this.$user.getValue (); }
  isUserId (userId: string) { return this.getUser ()?.id === userId; }

  autoSignIn$ () {
    return this.afa.user.pipe (
      first (),
      switchMap (authUser => this.login$ (authUser))
    );
  } // autoSignIn$

  signIn$ () {
    return from (this.afa.signInWithPopup (new firebase.auth.GoogleAuthProvider ())).pipe (
      switchMap (userCredential => this.login$ (userCredential.user)),
      catchError (e => {
        this.$user.next (null);
        return throwError (e);
      })
    );
  } // signIn$

  signOut$ () {
    this.$user.next (null);
    return from (this.afa.signOut ());
  } // signOut

  private login$ (authUser: firebase.User | null) {
    if (authUser) {
      const user: BgUser = this.fireUserToBgUser (authUser);
      this.$user.next (user);
      return this.upsertUser$ (user);
    } else {
      this.$user.next (null);
      return of (null);
    } // if - else
  } // login$

  private fireUserToBgUser (authUser: firebase.User): BgUser {
    return {
      id: authUser.uid,
      email: authUser.email || "",
      displayName: authUser.displayName || authUser.email || ""
    };
  } // fireUserToBgUser

  private upsertUser$ (user: BgUser) {
    const users = this.getUsers ();
    return this.cloud.insert$<BgUser> (id => user, users, user.id);
  } // checkUser$

} // BgAuthServiceService
