import { Pipe, PipeTransform } from "@angular/core";

@Pipe ({
  name: "bgTransform"
})
export class BgTransformPipe<I, O, P> implements PipeTransform {

  transform (value: I, transformFn: (value: I, params: P) => O, params: P): O {
    return transformFn (value, params);
  } // transform

} // BgTransformPipe
