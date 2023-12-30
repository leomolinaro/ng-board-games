import { inject, Injectable } from "@angular/core";
import { Auth, GoogleAuthProvider, signInWithPopup, User, user } from "@angular/fire/auth";
import { BehaviorSubject, from, Observable, of, throwError } from "rxjs";
import { catchError, first, map, switchMap } from "rxjs/operators";
import { BgCloudService } from "./bg-cloud.service";

export type BgUserLoginType = "guest" | "google";

const LOCALSTORAGE_BG_LOGIN_TYPE_KEY = "bg:loginType";
const LOCALSTORAGE_BG_PROVIDER_GUEST_KEY = "bg:guestId";

export interface BgUser {
  id: string;
  email: string;
  displayName: string;
  loginType: BgUserLoginType;
} // BgUser

interface IBgAuthProvider {
  signIn$: () => Observable<BgUser | null>;
  autoSignIn$: () => Observable<BgUser | null>;
  signOut$: () => Observable<void>;
} // IBgAuthProvider

@Injectable ({
  providedIn: "root"
})
export class BgAuthService {

  constructor (
    public googleProvider: BgGoogleAuthProvider,
    public guestProvider: BgGuestAuthProvider,
    private cloud: BgCloudService
  ) { }

  private $user = new BehaviorSubject<BgUser | null> (null);
  private setUser (user: BgUser | null) { this.$user.next (user); }

  private users () { return this.cloud.collection<BgUser> ("users"); }

  getUser$ () { return this.$user.asObservable (); }
  getUser () { return this.$user.getValue () as BgUser; }
  hasUser () { return !!this.$user.getValue (); }
  isUserId (userId: string) { return this.getUser ()?.id === userId; }

  autoSignIn$ () {
    const loginType = localStorage.getItem (LOCALSTORAGE_BG_LOGIN_TYPE_KEY) as BgUserLoginType | null;
    if (loginType) {
      return this.provider (loginType).autoSignIn$ ().pipe (
        switchMap (user => this.login$ (user))
      );
    } else {
      return of (null);
    } // if - else
  } // autoSignIn$

  signIn$ (type: BgUserLoginType) {
    return this.provider (type).signIn$ ().pipe (
      switchMap (user => this.login$ (user)),
      catchError (e => {
        this.setUser (null);
        return throwError (e);
      })
    );
  } // signIn$

  signOut$ () {
    const user = this.$user.getValue ();
    if (user) {
      this.setUser (null);
      localStorage.removeItem (LOCALSTORAGE_BG_LOGIN_TYPE_KEY);
      return this.provider (user.loginType).signOut$ ();
    } else {
      return of (void 0);
    } // if - else
  } // signOut

  deleteUser$ () {
    const user = this.$user.getValue ();
    if (user) {
      return this.signOut$ ().pipe (
        switchMap (() => this.cloud.delete$ (user.id, this.users ()))
      );
    } else {
      return of (void 0);
    } // if - else
  } // deleteUser$

  private provider (type: BgUserLoginType): IBgAuthProvider {
    switch (type) {
      case "google": return this.googleProvider;
      case "guest": return this.guestProvider;
      default: throw new Error (`Login type ${type} not implemented.`);
    } // switch
  } // provider

  private login$ (user: BgUser | null) {
    if (user) {
      this.setUser (user);
      localStorage.setItem (LOCALSTORAGE_BG_LOGIN_TYPE_KEY, user.loginType);
      return this.upsertUser$ (user);
    } else {
      this.setUser (null);
      return of (null);
    } // if - else
  } // login$

  private upsertUser$ (user: BgUser) {
    const users = this.users ();
    return this.cloud.insert$<BgUser> (user, user.id, users);
  } // checkUser$

} // BgAuthServiceService

@Injectable ({
  providedIn: "root"
})
class BgGoogleAuthProvider implements IBgAuthProvider {

  private auth: Auth = inject (Auth);

  signIn$ (): Observable<BgUser | null> {
    return from (signInWithPopup (this.auth, new GoogleAuthProvider ())).pipe (
      map (userCredential => this.googleUserToBgUser (userCredential.user))
    );
  } // signIn$

  signOut$ () {
    return from (this.auth.signOut ());
  } // signOut

  autoSignIn$ (): Observable<BgUser | null> {
    return user (this.auth).pipe (
      first (),
      map (authUser => this.googleUserToBgUser (authUser))
    );
  } // autoSignIn$

  private googleUserToBgUser (authUser: User | null): BgUser | null {
    return authUser ? {
      id: authUser.uid,
      email: authUser.email || "",
      displayName: authUser.displayName || authUser.email || "",
      loginType: "google"
    } : null;
  } // googleUserToBgUser

} // GoogleAuthProvider

@Injectable ({
  providedIn: "root"
})
class BgGuestAuthProvider implements IBgAuthProvider {

  signIn$ (): Observable<BgUser | null> {
    const guestKey = `guestKey${new Date ().getTime ()}`;
    localStorage.setItem (LOCALSTORAGE_BG_PROVIDER_GUEST_KEY, guestKey);
    const user = this.guestKeyToBgUser (guestKey);
    return of (user);
  } // signIn$

  signOut$ () {
    localStorage.removeItem (LOCALSTORAGE_BG_PROVIDER_GUEST_KEY);
    return of (void 0);
  } // signOut

  autoSignIn$ (): Observable<BgUser | null> {
    const guestKey = localStorage.getItem (LOCALSTORAGE_BG_PROVIDER_GUEST_KEY);
    if (guestKey) {
      const user = this.guestKeyToBgUser (guestKey);
      return of (user);
    } else {
      return of (null);
    } // if - else
  } // autoSignIn$

  private guestKeyToBgUser (guestKey: string): BgUser | null {
    return guestKey ? {
      displayName: "Guest " + guestKey,
      email: "",
      id: guestKey,
      loginType: "guest",
    } : null;
  } // guestKeyToBgUser

} // GuestAuthProvider
