import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

export type BgTransformFn<I, O, P = unknown> = (value: I, params: P) => O;

@Pipe({
  name: 'bgTransform',
  standalone: true,
})
export class BgTransformPipe<I, O> implements PipeTransform {
  transform(
    value: I,
    transformFn: (value: I, ...params: unknown[]) => O,
    ...params: unknown[]
  ): O {
    return transformFn(value, ...params);
  }
}
