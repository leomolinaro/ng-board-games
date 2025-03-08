import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";

import { AppHomePageComponent } from "./app-home-page.component";

const routes: Routes = [{ path: "", component: AppHomePageComponent }];

@NgModule ({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatToolbarModule,
    AppHomePageComponent,
],
})
export class AppHomePageModule {}
