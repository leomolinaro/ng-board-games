import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BgMapZoomButtonsComponent } from './bg-map-zoom-buttons.component';
import { BgMapZoomDirective, BgSvgComponent } from './bg-map-zoom.directive';

const components = [
  BgSvgComponent,
  BgMapZoomDirective,
  BgMapZoomButtonsComponent,
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, MatButtonModule, MatIconModule],
  exports: [...components],
})
export class BgSvgModule {}
