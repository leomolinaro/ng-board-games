import { inject, Injectable } from '@angular/core';
import type { Auth, User } from 'firebase/auth';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import type { BgCloudCollection } from '../cloud';
import { BgCloudService } from '../cloud';

export type BgUserLoginType = 'guest' | 'google';

const LOCALSTORAGE_BG_LOGIN_TYPE_KEY = 'bg:loginType';
const LOCALSTORAGE_BG_PROVIDER_GUEST_KEY = 'bg:guestId';

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

@Injectable({
  providedIn: 'root',
})
export class BgAuthService {
  private googleProvider = inject(BgGoogleAuthProvider);
  private guestProvider = inject(BgGuestAuthProvider);
  private cloud = inject(BgCloudService);

  private $user = new BehaviorSubject<BgUser | null>(null);
  // TO MOCK
  // private $user = new BehaviorSubject<BgUser | null> ({ email: "rhapsody.leo@gmail.com" } as any);
  private setUser(user: BgUser | null): void {
    this.$user.next(user);
  }

  private users(): BgCloudCollection<BgUser> {
    return this.cloud.collection<BgUser>('users');
  }

  getUser$(): Observable<BgUser | null> {
    return this.$user.asObservable();
  }
  getUser(): BgUser {
    return this.$user.getValue()!;
  }
  hasUser(): boolean {
    return !!this.$user.getValue();
  }
  isUserId(userId: string): boolean {
    return this.getUser()?.id === userId;
  }

  autoSignIn$(): Observable<BgUser | null> {
    const loginType = localStorage.getItem(
      LOCALSTORAGE_BG_LOGIN_TYPE_KEY,
    ) as BgUserLoginType | null;
    return loginType
      ? this.provider(loginType)
          .autoSignIn$()
          .pipe(switchMap((user) => this.login$(user)))
      : of(null);
  }

  signIn$(type: BgUserLoginType): Observable<BgUser | null> {
    return this.provider(type)
      .signIn$()
      .pipe(
        switchMap((user) => this.login$(user)),
        catchError((e: Error) => {
          this.setUser(null);
          return throwError(() => e);
        }),
      );
  }

  signOut$(): Observable<void> {
    const user = this.$user.getValue();
    if (user) {
      this.setUser(null);
      localStorage.removeItem(LOCALSTORAGE_BG_LOGIN_TYPE_KEY);
      return this.provider(user.loginType).signOut$();
    }
    return of(void 0);
  }

  deleteUser$(): Observable<void> {
    const user = this.$user.getValue();
    return user
      ? this.signOut$().pipe(
          switchMap(() => this.cloud.delete$(user.id, this.users())),
        )
      : of(void 0);
  }

  private provider(type: BgUserLoginType): IBgAuthProvider {
    switch (type) {
      case 'google':
        return this.googleProvider;
      case 'guest':
        return this.guestProvider;
      default:
        throw new Error(`Login type not implemented.`);
    }
  }

  private login$(user: BgUser | null): Observable<BgUser | null> {
    if (user) {
      this.setUser(user);
      localStorage.setItem(LOCALSTORAGE_BG_LOGIN_TYPE_KEY, user.loginType);
      return this.upsertUser$(user);
    }
    this.setUser(null);
    return of(null);
  }

  private upsertUser$(user: BgUser): Observable<BgUser | null> {
    const users = this.users();
    return this.cloud.set$<BgUser>(user.id, user, users);
  }
}

@Injectable({
  providedIn: 'root',
})
class BgGoogleAuthProvider implements IBgAuthProvider {
  private auth: Auth = getAuth();

  signIn$(): Observable<BgUser | null> {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider())).pipe(
      map((userCredential) => this.googleUserToBgUser(userCredential.user)),
    );
  }

  signOut$(): Observable<void> {
    return from(signOut(this.auth));
  }

  autoSignIn$(): Observable<BgUser | null> {
    return new Observable((subscriber) => {
      const unsubscribe = onAuthStateChanged(
        this.auth,
        (authUser) => {
          subscriber.next(this.googleUserToBgUser(authUser));
          subscriber.complete();
        },
        (error) => subscriber.error(error),
      );

      return unsubscribe;
    });
  }

  private googleUserToBgUser(authUser: User | null): BgUser | null {
    return authUser
      ? {
          id: authUser.uid,
          email: authUser.email ?? '',
          displayName: authUser.displayName ?? authUser.email ?? '',
          loginType: 'google',
        }
      : null;
  }
}

@Injectable({
  providedIn: 'root',
})
class BgGuestAuthProvider implements IBgAuthProvider {
  signIn$(): Observable<BgUser | null> {
    const guestKey = `guestKey${Date.now()}`;
    localStorage.setItem(LOCALSTORAGE_BG_PROVIDER_GUEST_KEY, guestKey);
    const user = this.guestKeyToBgUser(guestKey);
    return of(user);
  }

  signOut$(): Observable<void> {
    localStorage.removeItem(LOCALSTORAGE_BG_PROVIDER_GUEST_KEY);
    return of(void 0);
  }

  autoSignIn$(): Observable<BgUser | null> {
    const guestKey = localStorage.getItem(LOCALSTORAGE_BG_PROVIDER_GUEST_KEY);
    if (guestKey) {
      const user = this.guestKeyToBgUser(guestKey);
      return of(user);
    }
    return of(null);
  }

  private guestKeyToBgUser(guestKey: string): BgUser | null {
    return guestKey
      ? {
          displayName: 'Guest ' + guestKey,
          email: '',
          id: guestKey,
          loginType: 'guest',
        }
      : null;
  }
}
