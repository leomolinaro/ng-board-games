import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { BgAuthModule } from "@bg-components/auth";
import { BgFormModule } from "@bg-components/form";
import { BgHomeModule } from "@bg-components/home";
import { BritArcheoGameFormComponent } from "./brit-archeo-game-form/brit-archeo-game-form.component";
import { BritHomeComponent } from "./brit-home.component";
import { BritRoomDialogComponent } from "./brit-room-dialog/brit-room-dialog.component";

@NgModule ({
  declarations: [
    BritHomeComponent,
    BritArcheoGameFormComponent,
    BritRoomDialogComponent
  ],
  imports: [
    CommonModule,
    BgHomeModule,
    BgFormModule,
    BgAuthModule,
    MatFormFieldModule,
    MatRadioModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule
  ]
})
export class BritHomeModule { }
