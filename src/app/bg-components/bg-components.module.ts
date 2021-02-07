import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BgMapZoomDirective, BgSvgComponent } from "./bg-map-zoom.directive";

const components = [
  BgSvgComponent,
  BgMapZoomDirective
];

@NgModule ({
  declarations: [
    ...components
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ...components
  ]
})
export class BgComponentsModule { }
