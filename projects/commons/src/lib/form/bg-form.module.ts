import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  BgCheckboxFieldDirective,
  BgFormDirective,
  BgInputFieldDirective,
  BgRadioFieldDirective,
  BgSelectFieldDirective,
} from './bg-form.directive';

const components = [
  BgFormDirective,
  BgInputFieldDirective,
  BgSelectFieldDirective,
  BgRadioFieldDirective,
  BgCheckboxFieldDirective,
];

@NgModule({
  declarations: [...components],
  exports: [...components],
  imports: [CommonModule],
})
export class BgFormModule {}
