import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BgHomeModule } from "@leobg/commons";
import { BritHomeComponent } from "./brit-home.component";

@NgModule ({
  declarations: [BritHomeComponent],
  imports: [CommonModule, BgHomeModule],
})
export class BritHomeModule {}
