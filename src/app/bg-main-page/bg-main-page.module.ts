import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { BgUtilsModule } from "@bg-utils";
import { BgComponentsModule } from "../bg-components/bg-components.module";
import { BgMainPageComponent } from "./bg-main-page.component";

const routes: Routes = [
  { path: "", component: BgMainPageComponent }
];

@NgModule ({
  declarations: [
    BgMainPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BgUtilsModule,
    BgComponentsModule,
    MatToolbarModule
  ]
})
export class BgMainPageModule { }