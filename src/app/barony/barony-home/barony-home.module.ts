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
import { BgUtilsModule } from "@bg-utils";
import { BaronyHomeComponent } from "./barony-home.component";

@NgModule ({
  declarations: [
    BaronyHomeComponent
  ],
  imports: [
    CommonModule,
    BgHomeModule,
    BgFormModule,
    BgAuthModule,
    BgUtilsModule,
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
