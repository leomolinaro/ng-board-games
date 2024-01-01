import { Pipe, PipeTransform } from "@angular/core";

@Pipe ({
  name: "bgTimes",
  standalone: true
})
export class BgTimesPipe implements PipeTransform {

  transform (value: number): any {
    const iterable = {
      [Symbol.iterator]: function *() {
        let n = 0;
        while (n < value) {
          yield ++n;
        }
      },
    };
    return iterable;
  } // transform
  
} // TimesPipe
