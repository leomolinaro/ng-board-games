import { Pipe, PipeTransform } from "@angular/core";

export type BgTransformFn<I, O, P = any> = (value: I, params: P) => O

@Pipe ({
  name: "bgTransform"
})
export class BgTransformPipe<I, O, P> implements PipeTransform {

  transform (value: I, transformFn: (value: I, params: P) => O, params: P): O {
    return transformFn (value, params);
  } // transform

} // BgTransformPipe
