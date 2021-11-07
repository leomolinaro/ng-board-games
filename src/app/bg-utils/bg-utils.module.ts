import { NgModule } from "@angular/core";
import { BgTimesPipe } from "./bg-times.pipe";
import { BgTransformPipe } from "./bg-transform.pipe";
import { NgLetDirective } from "./ng.util";

@NgModule ({
  declarations: [NgLetDirective, BgTransformPipe, BgTimesPipe],
  exports: [NgLetDirective, BgTransformPipe, BgTimesPipe],
})
export class BgUtilsModule { }
