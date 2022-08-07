import { CommonModule } from "@angular/common";
import { Injectable, NgModule } from "@angular/core";
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from "@angular/material/tooltip";
import { Resolve, RouterModule, Routes } from "@angular/router";
import { BgSvgModule } from "@bg-components/svg";
import { BgUtilsModule } from "@bg-utils";
import { Observable } from "rxjs";
import { BritBoardComponent } from "./brit-board/brit-board.component";
import { BritNationCardSheetComponent } from './brit-board/brit-nation-card-sheet.component';
import { BritGameComponent } from "./brit-game/brit-game.component";
import { BritHomeComponent } from "./brit-home/brit-home.component";
import { BritHomeModule } from "./brit-home/brit-home.module";
import { BritLogComponent } from "./brit-logs/brit-log.component";
import { BritLogsComponent } from "./brit-logs/brit-logs.component";
import { BritMapComponent } from "./brit-map/brit-map.component";
import { BritMapService } from "./brit-map/brit-map.service";
import { BritPlayerComponent } from './brit-player/brit-player.component';
import { BritRemoteService } from "./brit-remote.service";

@Injectable ()
export class BritAreaPathResolver implements Resolve<any> {

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
    BritPlayerComponent,
    BritNationCardSheetComponent,
    BritLogsComponent,
    BritLogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BritHomeModule,
    BgSvgModule,
    BgUtilsModule,
    MatBottomSheetModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    BritAreaPathResolver,
    BritRemoteService
  ]
})
export class BritModule { }
