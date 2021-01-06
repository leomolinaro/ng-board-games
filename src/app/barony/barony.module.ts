import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BaronyComponent } from "../barony/barony.component";
import { BaronyHomeComponent } from "./barony-home/barony-home.component";
import { BaronyBoardComponent } from "./barony-board/barony-board.component";
import { RouterModule, Routes } from "@angular/router";
import { BaronyMapComponent } from "./barony-map/barony-map.component";
import { BaronyLandTileCoordinatesPipe } from "./pipes/barony-land-tile-coordinates.pipe";
import { BaronyLandTileComponent } from "./barony-land-tile/barony-land-tile.component";
import { BaronyPlayerStatusComponent } from "./barony-player-status/barony-player-status.component";
import { BaronyActionsComponent } from "./barony-actions/barony-actions.component";

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
    BaronyLandTileCoordinatesPipe,
    BaronyLandTileComponent,
    BaronyPlayerStatusComponent,
    BaronyActionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes)
  ]
})
export class BaronyModule { }
