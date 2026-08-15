import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BaronyGameComponent } from "./barony-game/barony-game.component";
import { BaronyHomeComponent } from "./barony-home/barony-home.component";

const routes: Routes = [
  { path: "", component: BaronyHomeComponent },
  { path: "game/:gameId", component: BaronyGameComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class BaronyModule {}
