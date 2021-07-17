import { NgModule } from "@angular/core";
import { BgTransformPipe } from "./bg-transform.pipe";
import { NgLetDirective } from "./ng.util";

@NgModule ({
  declarations: [NgLetDirective, BgTransformPipe],
  exports: [NgLetDirective, BgTransformPipe],
})
export class BgUtilsModule { }
