import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { BgSvgModule } from "@leobg/commons";
import { BgTransformPipe, NgLetDirective } from "@leobg/commons/utils";
import { WotrHomeComponent } from "./wotr-home.component";

const routes: Routes = [
  { path: "", component: WotrHomeComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule ({
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    WotrHomeComponent,
    BgSvgModule,
    BgTransformPipe,
    MatBottomSheetModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    NgLetDirective
  ]
})
export class WotrModule {}
