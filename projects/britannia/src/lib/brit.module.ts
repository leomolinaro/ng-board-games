import { CommonModule } from "@angular/common";
import { Injectable, NgModule } from "@angular/core";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Resolve, RouterModule, Routes } from "@angular/router";
import { BgSvgModule } from "@leobg/commons";
import { BgTransformPipe, NgLetDirective } from "@leobg/commons/utils";
import { Observable, forkJoin } from "rxjs";
import { BritActionsComponent } from "./brit-board/brit-actions.component";
import { BritBoardComponent } from "./brit-board/brit-board.component";
import { BritLogComponent } from "./brit-board/brit-log.component";
import { BritLogsComponent } from "./brit-board/brit-logs.component";
import { BritNationCardSheetComponent } from "./brit-board/brit-nation-card-sheet.component";
import { BritUnitsSelectorSheetComponent } from "./brit-board/brit-units-selector-sheet.component";
import { BritGameComponent } from "./brit-game/brit-game.component";
import { BritHomeComponent } from "./brit-home.component";
import { BritMapComponent } from "./brit-map/brit-map.component";
import { BritMapService } from "./brit-map/brit-map.service";
import { BritPlayerComponent } from "./brit-player/brit-player.component";
import { BritUnitsSelectorComponent } from "./brit-units-selector/brit-units-selector.component";

@Injectable ()
export class BritAreaPathResolver implements Resolve<any> {
  constructor (private mapService: BritMapService) {}

  resolve (): Observable<any> {
    return forkJoin ([
      this.mapService.loadAreaPaths$ (),
      this.mapService.loadAreaSlots$ (),
    ]);
  } // resolve
} // BritAreaPathResolver

const gameResolvers = {
  areaPaths: BritAreaPathResolver,
};

const routes: Routes = [
  { path: "", component: BritHomeComponent },
  { path: "game/:gameId", component: BritGameComponent, resolve: gameResolvers },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule ({
  declarations: [
    BritGameComponent,
    BritBoardComponent,
    BritMapComponent,
    BritPlayerComponent,
    BritNationCardSheetComponent,
    BritUnitsSelectorSheetComponent,
    BritUnitsSelectorComponent,
    BritLogsComponent,
    BritLogComponent,
    BritActionsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BritHomeComponent,
    BgSvgModule,
    BgTransformPipe,
    MatBottomSheetModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    NgLetDirective
  ],
  providers: [BritAreaPathResolver],
})
export class BritModule {}
