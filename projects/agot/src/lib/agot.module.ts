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
    loadComponent: () => import("./agot-draft/agot-draft-page").then(m => m.AgotDraftPage)
  },
  {
    path: AGOT_FEATURE_PATHS.fcDecks,
    loadComponent: () => import("./agot-fc-decks/agot-fc-decks-page").then(m => m.AgotFcDecksPage)
  },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class AgotModule {}
