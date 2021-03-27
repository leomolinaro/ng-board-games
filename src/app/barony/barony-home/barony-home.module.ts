import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BgComponentsModule } from "@bg-components";
import { BgUtilsModule } from "@bg-utils";
import { BaronyHomeComponent } from "./barony-home.component";
import { BaronyNewGameComponent } from './barony-new-game/barony-new-game.component';
import { BaronyNewPlayersComponent } from './barony-new-players/barony-new-players.component';
import { BaronyRoomDialogComponent } from './barony-room-dialog/barony-room-dialog.component';
import { BaronyHomeGamesComponent } from './barony-home-games/barony-home-games.component';

@NgModule ({
  declarations: [
    BaronyHomeComponent,
    BaronyNewGameComponent,
    BaronyNewPlayersComponent,
    BaronyRoomDialogComponent,
    BaronyHomeGamesComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    BgUtilsModule,
    BgComponentsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressBarModule
  ],
  exports: [
    BaronyHomeComponent
  ]
})
export class BaronyHomeModule { }
