import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BgTransformPipe } from "@leobg/commons/utils";
import { BgAuthModule } from "../../authentication";
import { BgFormModule } from "../../form";
import { BgHomeArcheoGameFormComponent } from "./bg-home-archeo-game-form.component";
import { BgHomePlayerFormComponent } from "./bg-home-player-form/bg-home-player-form.component";
import { BgHomeRoomDialogComponent } from "./bg-home-room-dialog/bg-home-room-dialog.component";
import { BgHomeComponent } from "./bg-home.component";

const components = [BgHomeComponent];

@NgModule ({
  declarations: [
    ...components,
    BgHomeRoomDialogComponent,
    BgHomePlayerFormComponent,
    BgHomeArcheoGameFormComponent,
  ],
  exports: [
    ...components,
    BgHomePlayerFormComponent, // TODO rimuovere
  ],
  imports: [
    CommonModule,
    BgAuthModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    BgTransformPipe,
    BgFormModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatTableModule,
  ],
})
export class BgHomeModule {}
