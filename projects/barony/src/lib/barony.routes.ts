import { Routes } from "@angular/router";
import { BaronyGameComponent } from "./barony-game/barony-game.component";
import { BaronyHomeComponent } from "./barony-home/barony-home.component";

export const routes: Routes = [
  { path: "", component: BaronyHomeComponent },
  { path: "game/:gameId", component: BaronyGameComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];
