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
import { BaronyLogComponent } from "./barony-log/barony-log.component";
import { BaronyLogsComponent } from "./barony-logs/barony-logs.component";
import { BaronyResourcesSelectorComponent } from "./barony-resources-selector/barony-resources-selector.component";
import { BaronyBuildingsSelectorComponent } from "./barony-buildings-selector/barony-buildings-selector.component";
import { BaronyGameComponent } from "./barony-game/barony-game.component";

// @Injectable ()
// export class BaronyGameResolver implements Resolve<any> {
//   constructor (private firestore: AngularFirestore, private db: AngularFireDatabase) { }
//   resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
//     return this.db.list ('barony').valueChanges ().pipe (tap (x => console.log ("x", x)));
//     return this.firestore.collection ("barony").valueChanges ().pipe (tap (x => console.log ("x", x)));
//   } // resolve
// } // BaronyGameResolver

const routes: Routes = [
  { path: "", component: BaronyHomeComponent },
  { path: "game", component: BaronyGameComponent/* , resolve: { game: BaronyGameResolver } */ },
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
    BgComponentsModule
  ],
  providers: [
    // BaronyGameResolver
  ]
})
export class BaronyModule { }
