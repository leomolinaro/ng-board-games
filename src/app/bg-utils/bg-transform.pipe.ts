import { Pipe, PipeTransform } from "@angular/core";

@Pipe ({
  name: "bgTransform"
})
export class BgTransformPipe<I, O> implements PipeTransform {

  transform (value: I, transformFn: (value: I) => O): O {
    return transformFn (value);
  } // transform

} // BgTransformPipe
