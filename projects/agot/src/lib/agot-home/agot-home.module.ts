import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { AgotHomeComponent } from "./agot-home.component";

const routes: Routes = [{ path: "", component: AgotHomeComponent }];

@NgModule ({
  declarations: [AgotHomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    MatToolbarModule,
  ],
})
export class AgotHomeModule {}
