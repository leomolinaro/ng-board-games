import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BgSvgModule } from "@bg-components/svg";
import { BgUtilsModule } from "@bg-utils";
import { BaronyActionsComponent } from "./barony-actions/barony-actions.component";
import { BaronyBoardComponent } from "./barony-board/barony-board.component";
import { BaronyBuildingsSelectorComponent } from "./barony-buildings-selector/barony-buildings-selector.component";
import { BaronyGameComponent } from "./barony-game/barony-game.component";
import { BaronyHomeComponent } from "./barony-home/barony-home.component";
import { BaronyHomeModule } from "./barony-home/barony-home.module";
import { BaronyKnightsSelectorComponent } from "./barony-knights-selector/barony-knights-selector.component";
import { BaronyLandComponent } from "./barony-land-tile/barony-land-tile.component";
import { BaronyLogComponent } from "./barony-log/barony-log.component";
import { BaronyLogsComponent } from "./barony-logs/barony-logs.component";
import { BaronyMapComponent } from "./barony-map/barony-map.component";
import { BaronyPlayerStatusComponent } from "./barony-player-status/barony-player-status.component";
import { BaronyResourcesSelectorComponent } from "./barony-resources-selector/barony-resources-selector.component";
import { BaronyLandCoordinatesPipe } from "./pipes/barony-land-tile-coordinates.pipe";

const routes: Routes = [
  { path: "", component: BaronyHomeComponent },
  { path: "game/:gameId", component: BaronyGameComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  declarations: [
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
    BaronyGameComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BgUtilsModule,
    BgSvgModule,
    BaronyHomeModule
  ],
  providers: [
    // BaronyGameResolver
  ]
})
export class BaronyModule { }
