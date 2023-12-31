import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BgHomeModule } from "@leobg/commons";
import { BaronyHomeComponent } from "./barony-home.component";

@NgModule ({
  declarations: [BaronyHomeComponent],
  imports: [CommonModule, BgHomeModule],
})
export class BaronyHomeModule {}
