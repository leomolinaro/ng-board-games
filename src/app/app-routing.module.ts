import { Injectable, NgModule } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterModule, RouterStateSnapshot, Routes } from "@angular/router";
import { BgAuthService } from "@bg-services";
import { Observable, of } from "rxjs";
import { first, map, switchMap, tap } from "rxjs/operators";

@Injectable ()
class BgRootGuard implements CanActivate {
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
  { path: "barony", canActivate: [BgRootGuard], loadChildren: () => import ("./barony/barony.module").then (m => m.BaronyModule) },
  { path: "britannia", canActivate: [BgRootGuard], loadChildren: () => import ("./britannia/brit.module").then (m => m.BritModule) },
  { path: "agot-draft", canActivate: [BgRootGuard], loadChildren: () => import ("./agot-draft/agot-draft.module").then (m => m.AgotDraftModule) },
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
