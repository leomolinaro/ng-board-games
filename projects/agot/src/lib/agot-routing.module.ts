import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AGOT_FEATURE_PATHS } from "./agot-features";

const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./agot-home").then(m => m.AgotHome)
  },
  {
    path: AGOT_FEATURE_PATHS.draft,
    loadChildren: () => import("./agot-draft/agot-draft.module").then(m => m.AgotDraftModule)
  },
  {
    path: AGOT_FEATURE_PATHS.fcDecks,
    loadChildren: () =>
      import("./agot-fc-decks/agot-fc-decks.module").then(m => m.AgotFcPacksModule)
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)]
})
export class AgotRoutingModule {}
