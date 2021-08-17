import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AgotFcPacksComponent } from "./agot-fc-packs.component";

const routes: Routes = [
  { path: "", component: AgotFcPacksComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [AgotFcPacksComponent],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
  ]
})
export class AgotFcPacksModule { }
