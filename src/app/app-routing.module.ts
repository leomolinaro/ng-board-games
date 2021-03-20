import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", loadChildren: () => import ("./bg-home/bg-home.module").then (m => m.BgHomeModule) },
  { path: "barony", loadChildren: () => import ("./barony/barony.module").then (m => m.BaronyModule) },
  { path: "agot-draft", loadChildren: () => import ("./agot-draft/agot-draft.module").then (m => m.AgotDraftModule) },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  imports: [
    RouterModule.forRoot (routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
