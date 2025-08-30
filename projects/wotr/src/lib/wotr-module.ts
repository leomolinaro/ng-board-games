import { NgModule, inject } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { WotrMapService } from "./game/board/map/wotr-map.service";
import { WotrGamePage } from "./game/wotr-game-page";
import { WotrHomePage } from "./home/wotr-home-page";

const gameResolvers = {
  mapPaths: () => inject(WotrMapService).loadMapPaths$(),
  regionSlots: () => inject(WotrMapService).loadRegionSlots$()
};

const routes: Routes = [
  { path: "", component: WotrHomePage },
  { path: "game/:gameId", component: WotrGamePage, resolve: gameResolvers },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
  // providers: [{ provide: WotrRemoteService, useClass: WotrRemoteMock }]
})
export class WotrModule {}
