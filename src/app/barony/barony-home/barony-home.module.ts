import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { BgComponentsModule } from "@bg-components";
import { BgHomeModule } from "src/app/bg-home/bg-home.module";
import { BaronyArcheoGameFormComponent } from "./barony-archeo-game-form/barony-archeo-game-form.component";
import { BaronyHomeComponent } from "./barony-home.component";
import { BaronyRoomDialogComponent } from "./barony-room-dialog/barony-room-dialog.component";

@NgModule ({
  declarations: [
    BaronyHomeComponent,
    BaronyArcheoGameFormComponent,
    BaronyRoomDialogComponent
  ],
  imports: [
    CommonModule,
    BgHomeModule,
    BgComponentsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class BaronyHomeModule { }
