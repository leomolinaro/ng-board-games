import { Pipe, PipeTransform } from "@angular/core";

export type BgTransformFn<I, O, P = any> = (value: I, params: P) => O;

@Pipe({
  name: "bgTransform",
  standalone: true
})
export class BgTransformPipe<I, O> implements PipeTransform {
  transform(value: I, transformFn: (value: I, ...params: any[]) => O, ...params: any[]): O {
    return transformFn(value, ...params);
  } // transform
} // BgTransformPipe
