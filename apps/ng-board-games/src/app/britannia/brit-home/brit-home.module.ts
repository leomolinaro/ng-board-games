import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BgHomeModule } from '@bg-components/home';
import { BritHomeComponent } from './brit-home.component';

@NgModule({
  declarations: [BritHomeComponent],
  imports: [CommonModule, BgHomeModule],
})
export class BritHomeModule {}
