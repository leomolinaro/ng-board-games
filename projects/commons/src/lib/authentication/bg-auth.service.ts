import { inject, Injectable } from "@angular/core";
import { Auth, user as fireUser, GoogleAuthProvider, signInWithPopup, User } from "@angular/fire/auth";
import { BehaviorSubject, from, Observable, of, throwError } from "rxjs";
import { catchError, first, map, switchMap } from "rxjs/operators";
import { BgCloudService } from "../cloud/bg-cloud.service";

export type BgUserLoginType = "guest" | "google";

const LOCALSTORAGE_BG_LOGIN_TYPE_KEY = "bg:loginType";
const LOCALSTORAGE_BG_PROVIDER_GUEST_KEY = "bg:guestId";

export interface BgUser {
  id: string;
  email: string;
  displayName: string;
  loginType: BgUserLoginType;
}

interface IBgAuthProvider {
  signIn$: () => Observable<BgUser | null>;
  autoSignIn$: () => Observable<BgUser | null>;
  signOut$: () => Observable<void>;
}

@Injectable ({
  providedIn: "root",
})
export class BgAuthService {
  
  private googleProvider = inject (BgGoogleAuthProvider);
  private guestProvider = inject (BgGuestAuthProvider);
  private cloud = inject (BgCloudService);

  private $user = new BehaviorSubject<BgUser | null> (null);
  // TO MOCK
  // private $user = new BehaviorSubject<BgUser | null> ({ email: "rhapsody.leo@gmail.com" } as any);
  private setUser (user: BgUser | null) {
    this.$user.next (user);
  }

  private users () {
    return this.cloud.collection<BgUser> ("users");
  }

  getUser$ () {
    return this.$user.asObservable ();
  }
  getUser () {
    return this.$user.getValue () as BgUser;
  }
  hasUser () {
    return !!this.$user.getValue ();
  }
  isUserId (userId: string) {
    return this.getUser ()?.id === userId;
  }

  autoSignIn$ () {
    const loginType = localStorage.getItem (
      LOCALSTORAGE_BG_LOGIN_TYPE_KEY
    ) as BgUserLoginType | null;
    if (loginType) {
      return this.provider (loginType)
        .autoSignIn$ ()
        .pipe (switchMap ((user) => this.login$ (user)));
    } else {
      return of (null);
    }
  }

  signIn$ (type: BgUserLoginType) {
    return this.provider (type)
      .signIn$ ()
      .pipe (
        switchMap ((user) => this.login$ (user)),
        catchError ((e) => {
          this.setUser (null);
          return throwError (e);
        })
      );
  }

  signOut$ () {
    const user = this.$user.getValue ();
    if (user) {
      this.setUser (null);
      localStorage.removeItem (LOCALSTORAGE_BG_LOGIN_TYPE_KEY);
      return this.provider (user.loginType).signOut$ ();
    } else {
      return of (void 0);
    }
  }

  deleteUser$ () {
    const user = this.$user.getValue ();
    if (user) {
      return this.signOut$ ().pipe (
        switchMap (() => this.cloud.delete$ (user.id, this.users ()))
      );
    } else {
      return of (void 0);
    }
  }

  private provider (type: BgUserLoginType): IBgAuthProvider {
    switch (type) {
      case "google":
        return this.googleProvider;
      case "guest":
        return this.guestProvider;
      default:
        throw new Error (`Login type ${type} not implemented.`);
    }
  }

  private login$ (user: BgUser | null) {
    if (user) {
      this.setUser (user);
      localStorage.setItem (LOCALSTORAGE_BG_LOGIN_TYPE_KEY, user.loginType);
      return this.upsertUser$ (user);
    } else {
      this.setUser (null);
      return of (null);
    }
  }

  private upsertUser$ (user: BgUser) {
    const users = this.users ();
    return this.cloud.set$<BgUser> (user.id, user, users);
  }
}

@Injectable ({
  providedIn: "root",
})
class BgGoogleAuthProvider implements IBgAuthProvider {
  private auth: Auth = inject (Auth);

  signIn$ (): Observable<BgUser | null> {
    return from (signInWithPopup (this.auth, new GoogleAuthProvider ())).pipe (
      map ((userCredential) => this.googleUserToBgUser (userCredential.user))
    );
  }

  signOut$ () {
    return from (this.auth.signOut ());
  }

  autoSignIn$ (): Observable<BgUser | null> {
    return fireUser (this.auth).pipe (
      first (),
      map ((authUser) => this.googleUserToBgUser (authUser))
    );
  }

  private googleUserToBgUser (authUser: User | null): BgUser | null {
    return authUser
      ? {
        id: authUser.uid,
        email: authUser.email || "",
        displayName: authUser.displayName || authUser.email || "",
        loginType: "google",
      }
      : null;
  }
}

@Injectable ({
  providedIn: "root",
})
class BgGuestAuthProvider implements IBgAuthProvider {
  signIn$ (): Observable<BgUser | null> {
    const guestKey = `guestKey${new Date ().getTime ()}`;
    localStorage.setItem (LOCALSTORAGE_BG_PROVIDER_GUEST_KEY, guestKey);
    const user = this.guestKeyToBgUser (guestKey);
    return of (user);
  }

  signOut$ () {
    localStorage.removeItem (LOCALSTORAGE_BG_PROVIDER_GUEST_KEY);
    return of (void 0);
  }

  autoSignIn$ (): Observable<BgUser | null> {
    const guestKey = localStorage.getItem (LOCALSTORAGE_BG_PROVIDER_GUEST_KEY);
    if (guestKey) {
      const user = this.guestKeyToBgUser (guestKey);
      return of (user);
    } else {
      return of (null);
    }
  }

  private guestKeyToBgUser (guestKey: string): BgUser | null {
    return guestKey
      ? {
        displayName: "Guest " + guestKey,
        email: "",
        id: guestKey,
        loginType: "guest",
      }
      : null;
  }
}
