import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BritGameComponent } from "./brit-game/brit-game.component";
import { BritHomeComponent } from "./brit-home/brit-home.component";
import { BritHomeModule } from "./brit-home/brit-home.module";

const routes: Routes = [
  { path: "", component: BritHomeComponent },
  { path: "game/:gameId", component: BritGameComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  declarations: [BritGameComponent],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    BritHomeModule
  ]
})
export class BritModule { }
