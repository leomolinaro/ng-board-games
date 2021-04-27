import { CommonModule } from "@angular/common";
import { Injectable, NgModule } from "@angular/core";
import { Resolve, RouterModule, Routes } from "@angular/router";
import { BgSvgModule } from "@bg-components/svg";
import { Observable } from "rxjs";
import { BritBoardComponent } from "./brit-board/brit-board.component";
import { BritGameComponent } from "./brit-game/brit-game.component";
import { BritHomeComponent } from "./brit-home/brit-home.component";
import { BritHomeModule } from "./brit-home/brit-home.module";
import { BritMapComponent } from "./brit-map/brit-map.component";
import { BritMapService } from "./brit-map/brit-map.service";
import { BritPlayersComponent } from './brit-players/brit-players.component';
import { BritPlayerComponent } from './brit-player/brit-player.component';

@Injectable ()
class BritAreaPathResolver implements Resolve<any> {

  constructor (
    private mapService: BritMapService
  ) { }

  resolve (): Observable<any> {
    return this.mapService.loadAreaPaths$ ();
  } // resolve

} // BritAreaPathResolver

const gameResolvers = {
  areaPaths: BritAreaPathResolver
};

const routes: Routes = [
  { path: "", component: BritHomeComponent },
  { path: "game/:gameId", component: BritGameComponent, resolve: gameResolvers },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  declarations: [
    BritGameComponent,
    BritBoardComponent,
    BritMapComponent,
    BritPlayersComponent,
    BritPlayerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BritHomeModule,
    BgSvgModule
  ],
  providers: [
    BritAreaPathResolver
  ]
})
export class BritModule { }
