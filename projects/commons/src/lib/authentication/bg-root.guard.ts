import { Injectable, inject } from '@angular/core';
import type { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import type { Observable } from 'rxjs';
import { first, map, of, switchMap } from 'rxjs';
import { BgAuthService } from './bg-auth.service';

@Injectable({ providedIn: 'root' })
export class BgRootGuard implements CanActivate {
  private authService = inject(BgAuthService);
  router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.getUser$().pipe(
      first(),
      switchMap((user) => {
        if (user) {
          return of(true);
        } else {
          return this.authService
            .autoSignIn$()
            .pipe(map((autoUser) => !!autoUser));
        }
      }),
      switchMap((hasUser) => {
        if (!hasUser) return this.router.navigate(['/']);
        return of(hasUser);
      }),
    );
  }
}
