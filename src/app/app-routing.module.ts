import { Injectable, NgModule } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from "@angular/router";
import { BgAuthService, BG_PATHS } from "@bg-services";
import { Observable, of } from "rxjs";
import { first, map, switchMap, tap } from "rxjs/operators";

@Injectable ()
export class BgRootGuard implements CanActivate {
  constructor (
    private authService: BgAuthService,
    public router: Router
  ) { }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getUser$ ().pipe (
      first (),
      switchMap (user => {
        if (user) {
          return of (true);
        } else {
          return this.authService.autoSignIn$ ().pipe (map (autoUser => !!autoUser));
        } // if - else
      }),
      tap (hasUser => {
        if (!hasUser) {
          this.router.navigate (["/"]);
        } // if
      })
    );
  } // canActivate
  
} // BgRootGuard

const routes: Routes = [
  { path: "", loadChildren: () => import ("./bg-main-page/bg-main-page.module").then (m => m.BgMainPageModule) },
  { path: BG_PATHS.barony, canActivate: [BgRootGuard], loadChildren: () => import ("./barony/barony.module").then (m => m.BaronyModule) },
  // { path: BG_PATHS.britannia, canActivate: [BgRootGuard], loadChildren: () => import ("./britannia/brit.module").then (m => m.BritModule) },
  // { path: BG_PATHS.agotLcg2, loadChildren: () => import ("./agot/agot.module").then (m => m.AgotModule) },
  // { path: BG_PATHS.talisman, loadChildren: () => import ("./talisman/tlsm.module").then (m => m.TlsmModule) },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  imports: [
    RouterModule.forRoot (routes)
  ],
  exports: [RouterModule],
  providers: [BgRootGuard]
})
export class AppRoutingModule { }
