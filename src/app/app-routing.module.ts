import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BgHomeComponent } from "./bg-home/bg-home.component";

const routes: Routes = [
  { path: "", component: BgHomeComponent },
  { path: "barony", loadChildren: () => import ("./barony/barony.module").then (m => m.BaronyModule) },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  imports: [RouterModule.forRoot (routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
