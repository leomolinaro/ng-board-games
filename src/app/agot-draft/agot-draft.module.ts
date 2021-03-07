import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { AgotDraftComponent } from "./agot-draft.component";
import { AgotCardGridComponent } from "./agot-card-grid/agot-card-grid.component";
import { FormsModule } from "@angular/forms";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSliderModule } from "@angular/material/slider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { LayoutModule } from "@angular/cdk/layout";

const routes: Routes = [
  { path: "", component: AgotDraftComponent },
  { path: "**", redirectTo: "", pathMatch: "full" }
];

@NgModule ({
  declarations: [
    AgotDraftComponent,
    AgotCardGridComponent
  ],
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
    FormsModule
  ]
})
export class AgotDraftModule { }
