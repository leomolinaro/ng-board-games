import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from "@angular/material/toolbar";
import { BgComponentsModule } from "@bg-components";
import { BgUtilsModule } from "@bg-utils";
import { BaronyHomeGamesComponent } from "./barony-home-games/barony-home-games.component";
import { BaronyHomeComponent } from "./barony-home.component";
import { BaronyIfOwnerOfDirective } from "./barony-if-owner-of.directive";
import { BaronyNewGameComponent } from "./barony-new-game/barony-new-game.component";
import { BaronyNewPlayersComponent } from "./barony-new-players/barony-new-players.component";
import { BaronyRoomDialogComponent } from "./barony-room-dialog/barony-room-dialog.component";

@NgModule ({
  declarations: [
    BaronyHomeComponent,
    BaronyNewGameComponent,
    BaronyNewPlayersComponent,
    BaronyRoomDialogComponent,
    BaronyHomeGamesComponent,
    BaronyIfOwnerOfDirective
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
    MatProgressBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule
  ],
  exports: [
    BaronyHomeComponent
  ]
})
export class BaronyHomeModule { }
