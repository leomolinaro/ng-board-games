import { CommonModule } from "@angular/common";
import { NgModule, inject } from "@angular/core";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { BgSvgModule } from "@leobg/commons";
import { BgTransformPipe, NgLetDirective } from "@leobg/commons/utils";
import { WotrMapService } from "./game/board/map/wotr-map.service";
import { WotrGameComponent } from "./game/wotr-game.component";
import { WotrHomeComponent } from "./home/wotr-home.component";

const gameResolvers = {
  mapPaths: () => inject (WotrMapService).loadMapPaths$ (),
  regionSlots: () => inject (WotrMapService).loadRegionSlots$ (),
};

const routes: Routes = [
  { path: "", component: WotrHomeComponent },
  { path: "game/:gameId", component: WotrGameComponent, resolve: gameResolvers },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule ({
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    WotrHomeComponent,
    BgSvgModule,
    BgTransformPipe,
    MatBottomSheetModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    NgLetDirective
  ],
  providers: [
    // { provide: WotrRemoteService, useClass: WotrRemoteMockService }
  ]
})
export class WotrModule {}
