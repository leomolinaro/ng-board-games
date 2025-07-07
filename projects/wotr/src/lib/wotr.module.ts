import { NgModule, inject } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WotrMapService } from "./game/board/map/wotr-map.service";
import { WotrGameComponent } from "./game/wotr-game.component";
import { WotrHomeComponent } from "./home/wotr-home.component";

const gameResolvers = {
  mapPaths: () => inject(WotrMapService).loadMapPaths$(),
  regionSlots: () => inject(WotrMapService).loadRegionSlots$()
};

const routes: Routes = [
  { path: "", component: WotrHomeComponent },
  { path: "game/:gameId", component: WotrGameComponent, resolve: gameResolvers },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
  // providers: [{ provide: WotrRemoteService, useClass: WotrRemoteMockService }]
})
export class WotrModule {}
