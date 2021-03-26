import { Injectable, NgModule } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterModule, RouterStateSnapshot, Routes } from "@angular/router";
import { BgAuthService } from "@bg-services";
import { Observable } from "rxjs";
import { filter, first, map } from "rxjs/operators";

@Injectable ()
class BgRootGuard implements CanActivate {
  constructor (
    private authService: BgAuthService
  ) { }

  canActivate (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getUser$ ().pipe (
      map (user => !!user),
      filter (hasUser => hasUser),
      first ()
    );
  } // canActivate
  
} // BgRootGuard

const routes: Routes = [
  { path: "", loadChildren: () => import ("./bg-home/bg-home.module").then (m => m.BgHomeModule) },
  { path: "barony", canActivate: [BgRootGuard], loadChildren: () => import ("./barony/barony.module").then (m => m.BaronyModule) },
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
