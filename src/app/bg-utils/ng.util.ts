import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";

export interface NgLetContext<T> {
  $implicit: T | null;
  ngLet: T | null;
} // NgLetContext

@Directive ({
  selector: "[ngLet]",
})
export class NgLetDirective<T> implements OnInit {
  
  constructor (
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<NgLetContext<T>>
  ) { }

  private context: NgLetContext<T> = {
    $implicit: null,
    ngLet: null
  };

  @Input ()
  set ngLet (value: T) {
    this.context.$implicit = this.context.ngLet = value;
  } // ngLet

  ngOnInit () {
    this.vcr.createEmbeddedView (this.templateRef, this.context);
  } // ngOnInit

} // NgLetDirective

export type SimpleChanges<C> = {
  [K in keyof C]: {
    isFirstChange: () => boolean;
    currentValue: C[K],
    firstChange: boolean,
    previousValue: C[K];
  }
};

/**
 * Da usare come annotazione sugli @Input () booleani.
 * es. @Input () @BooleanInput () readOnly: boolean;
 * Permette di poter utilizzare l'input nei seguenti modi:
 * - per true: readOnly | readOnly=true | [readOnly]="true"
 * - per false: readOnly=false | [readOnly]="false"
 */
export function BooleanInput () {
  return (component: any, inputKey: string) => {
    Object.defineProperty (component, inputKey, {
      get: function () { return this["__" + inputKey]; },
      set: function (value: any) {
        this["__" + inputKey] = (value != null && `${value}` !== "false");
      }
    });
  };
} // BooleanInput
