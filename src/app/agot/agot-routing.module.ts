import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { AGOT_UTILITY_PATHS } from "./agot-services/agot-utility.service";

const routes: Routes = [
  { path: "", loadChildren: () => import ("./agot-home/agot-home.module").then (m => m.AgotHomeModule) },
  { path: AGOT_UTILITY_PATHS.draft, loadChildren: () => import ("./agot-draft/agot-draft.module").then (m => m.AgotDraftModule) },
  { path: AGOT_UTILITY_PATHS.fcDecks, loadChildren: () => import ("./agot-fc-decks/agot-fc-decks.module").then (m => m.AgotFcPacksModule) },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild (routes)
  ]
})
export class AgotRoutingModule { }
