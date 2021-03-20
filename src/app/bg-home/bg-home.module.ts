import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BgUtilsModule } from "@bg-utils";
import { BgComponentsModule } from "../bg-components/bg-components.module";
import { BgHomeComponent } from "./bg-home.component";

const routes: Routes = [
  { path: "", component: BgHomeComponent }
];

@NgModule ({
  declarations: [
    BgHomeComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BgUtilsModule,
    BgComponentsModule
  ]
})
export class BgHomeModule { }
