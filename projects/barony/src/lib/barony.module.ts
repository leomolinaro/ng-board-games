import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { BgSvgModule } from "@leobg/commons";
import { BgTransformPipe } from "@leobg/commons/utils";
import { BaronyActionsComponent } from "./barony-board/barony-actions.component";
import { BaronyBoardComponent } from "./barony-board/barony-board.component";
import { BaronyBuildingsSelectorComponent } from "./barony-board/barony-buildings-selector.component";
import { BaronyEndGameComponent } from "./barony-board/barony-end-game/barony-end-game.component";
import { BaronyKnightsSelectorComponent } from "./barony-board/barony-knights-selector.component";
import { BaronyLandCoordinatesPipe } from "./barony-board/barony-land-tile/barony-land-tile-coordinates.pipe";
import { BaronyLandComponent } from "./barony-board/barony-land-tile/barony-land-tile.component";
import { BaronyLogComponent } from "./barony-board/barony-log.component";
import { BaronyLogsComponent } from "./barony-board/barony-logs.component";
import { BaronyMapComponent } from "./barony-board/barony-map/barony-map.component";
import { BaronyPlayerStatusComponent } from "./barony-board/barony-player-status/barony-player-status.component";
import { BaronyResourcesSelectorComponent } from "./barony-board/barony-resources-selector.component";
import { BaronyScoreboardComponent } from "./barony-board/barony-scoreboard.component";
import { BaronyGameComponent } from "./barony-game/barony-game.component";
import { BaronyHomeComponent } from "./barony-home/barony-home.component";

const routes: Routes = [
  { path: "", component: BaronyHomeComponent },
  { path: "game/:gameId", component: BaronyGameComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BgTransformPipe,
    BgSvgModule,
    BaronyHomeComponent,
    MatIconModule,
    MatTableModule,
    BaronyBoardComponent,
    BaronyMapComponent,
    BaronyLandCoordinatesPipe,
    BaronyLandComponent,
    BaronyPlayerStatusComponent,
    BaronyActionsComponent,
    BaronyKnightsSelectorComponent,
    BaronyLogComponent,
    BaronyLogsComponent,
    BaronyResourcesSelectorComponent,
    BaronyBuildingsSelectorComponent,
    BaronyGameComponent,
    BaronyEndGameComponent,
    BaronyScoreboardComponent
  ],
  providers: [
    // BaronyGameResolver
  ]
})
export class BaronyModule {}
