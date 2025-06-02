import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  BgCheckboxFieldDirective,
  BgFormDirective,
  BgInputFieldDirective,
  BgRadioFieldDirective,
  BgSelectFieldDirective
} from "./bg-form.directive";

const components = [
  BgFormDirective,
  BgInputFieldDirective,
  BgSelectFieldDirective,
  BgRadioFieldDirective,
  BgCheckboxFieldDirective
];

@NgModule({
  exports: [...components],
  imports: [CommonModule, ...components]
})
export class BgFormModule {}
