import { LayoutModule } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { NgLetDirective } from "@leobg/commons/utils";
import { AgotCardGridComponent } from "./agot-card-grid/agot-card-grid.component";
import { AgotDraftComponent } from "./agot-draft.component";

const routes: Routes = [
  { path: "", component: AgotDraftComponent },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule ({
  declarations: [AgotDraftComponent, AgotCardGridComponent],
  imports: [
    CommonModule,
    RouterModule.forChild (routes),
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    LayoutModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSliderModule,
    FormsModule,
    NgLetDirective
  ],
})
export class AgotDraftModule {}
