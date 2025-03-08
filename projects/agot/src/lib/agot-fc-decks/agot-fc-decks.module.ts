import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { RouterModule, Routes } from "@angular/router";
import { BgTransformPipe } from "@leobg/commons/utils";
import { AgotFcDecksComponent } from "./agot-fc-decks.component";

const routes: Routes = [
  { path: "", component: AgotFcDecksComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule ({
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    MatTableModule,
    BgTransformPipe,
    AgotFcDecksComponent
  ],
})
export class AgotFcPacksModule {}
