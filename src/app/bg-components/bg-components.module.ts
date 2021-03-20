import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BgMapZoomDirective, BgSvgComponent } from "./bg-map-zoom.directive";
import { BgToolbarComponent } from "./bg-toolbar/bg-toolbar.component";

const components = [
  BgSvgComponent,
  BgMapZoomDirective,
  BgToolbarComponent
];

@NgModule ({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  exports: [
    ...components
  ]
})
export class BgComponentsModule { }
