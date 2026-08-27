import { Injectable, inject } from "@angular/core";
import { Resolve, Routes } from "@angular/router";
import { Observable, forkJoin } from "rxjs";
import { BritGameComponent } from "./brit-game/brit-game.component";
import { BritHomeComponent } from "./brit-home.component";
import { BritMapService } from "./brit-map/brit-map.service";

@Injectable({
  providedIn: "root"
})
export class BritAreaPathResolver implements Resolve<any> {
  private mapService = inject(BritMapService);

  resolve(): Observable<any> {
    return forkJoin([this.mapService.loadAreaPaths$(), this.mapService.loadAreaSlots$()]);
  }
}

const gameResolvers = {
  areaPaths: BritAreaPathResolver
};

export const routes: Routes = [
  { path: "", component: BritHomeComponent },
  { path: "game/:gameId", component: BritGameComponent, resolve: gameResolvers },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
