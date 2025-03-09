import { Injectable, inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable, first, map, of, switchMap, tap } from "rxjs";
import { BgAuthService } from "./bg-auth.service";

@Injectable ({ providedIn: "root" })
export class BgRootGuard implements CanActivate {
  
  private authService = inject (BgAuthService);
  router = inject (Router);

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getUser$ ().pipe (
      first (),
      switchMap ((user) => {
        if (user) {
          return of (true);
        } else {
          return this.authService
            .autoSignIn$ ()
            .pipe (map ((autoUser) => !!autoUser));
        } // if - else
      }),
      tap ((hasUser) => {
        if (!hasUser) {
          this.router.navigate (["/"]);
        } // if
      })
    );
  } // canActivate
} // BgRootGuard
