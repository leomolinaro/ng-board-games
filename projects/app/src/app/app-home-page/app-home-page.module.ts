import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { BgAuthModule, BgUtilsModule } from "@leobg/commons";
import { AppHomePageComponent } from "./app-home-page.component";

const routes: Routes = [{ path: "", component: AppHomePageComponent }];

@NgModule ({
  declarations: [AppHomePageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BgUtilsModule,
    BgAuthModule,
    MatToolbarModule,
  ],
})
export class AppHomePageModule {}
