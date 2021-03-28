import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { BgAccountButtonComponent } from "./bg-account-button/bg-account-button.component";
import { BgFormDirective, BgInputFieldDirective, BgRadioFieldDirective, BgSelectFieldDirective } from "./bg-form.directive";
import { BgIfUserDirective } from "./bg-if-owner-of.directive";
import { BgMapZoomDirective, BgSvgComponent } from "./bg-map-zoom.directive";

const components = [
  BgSvgComponent,
  BgMapZoomDirective,
  BgAccountButtonComponent,
  BgFormDirective,
  BgInputFieldDirective,
  BgSelectFieldDirective,
  BgRadioFieldDirective,
  BgIfUserDirective
];

@NgModule ({
  declarations: [
    ...components,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
  ],
  exports: [
    ...components
  ]
})
export class BgComponentsModule { }
