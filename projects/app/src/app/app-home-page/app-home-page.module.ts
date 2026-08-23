import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AppHomePage } from "./app-home-page";

const routes: Routes = [{ path: "", component: AppHomePage }];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class AppHomePageModule {}
