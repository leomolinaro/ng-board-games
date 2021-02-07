import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaronyComponent } from "../barony/barony.component";
import { BaronyHomeComponent } from "./barony-home/barony-home.component";
import { BaronyBoardComponent } from "./barony-board/barony-board.component";
import { RouterModule, Routes } from "@angular/router";
import { BaronyMapComponent } from "./barony-map/barony-map.component";
import { BaronyLandCoordinatesPipe } from "./pipes/barony-land-tile-coordinates.pipe";
import { BaronyLandComponent } from "./barony-land-tile/barony-land-tile.component";
import { BaronyPlayerStatusComponent } from "./barony-player-status/barony-player-status.component";
import { BaronyActionsComponent } from "./barony-actions/barony-actions.component";
import { BgUtilsModule } from "@bg-utils";
import { BaronyKnightsSelectorComponent } from "./barony-knights-selector/barony-knights-selector.component";
import { BgComponentsModule } from "../bg-components/bg-components.module";

const routes: Routes = [
  { path: "", component: BaronyHomeComponent },
  { path: "board", component: BaronyBoardComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  declarations: [
    BaronyComponent,
    BaronyHomeComponent,
    BaronyBoardComponent,
    BaronyMapComponent,
    BaronyLandCoordinatesPipe,
    BaronyLandComponent,
    BaronyPlayerStatusComponent,
    BaronyActionsComponent,
    BaronyKnightsSelectorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BgUtilsModule,
    BgComponentsModule
  ]
})
export class BaronyModule { }
