import { coerceNumberProperty } from "@angular/cdk/coercion";
import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { EMPTY, MonoTypeOperatorFunction, Observable, Subject } from "rxjs";
import { catchError, concatMap, debounceTime, exhaustMap, filter, first, mergeMap, switchMap, takeUntil } from "rxjs/operators";

const untilDestorySymbol = Symbol ("__untilDestroyUsed");
const destroySymbol = Symbol ("__$destroy");
const asyncEventOriginSymbol = Symbol ("__$ascynEventOrigin");

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

export function BooleanInput () {
  return (component: any, inputKey: string) => {
    Object.defineProperty (component, inputKey, {
      get: function () { return this["__" + inputKey]; },
      set: function (value: any) {
        this["__" + inputKey] = (value != null && `${ value }` !== "false");
      }
    });
  };
} // BooleanInput

export function NumberInput () {
  return (component: any, inputKey: string) => {
    Object.defineProperty (component, inputKey, {
      get: function () { return this["__" + inputKey]; },
      set: function (value: any) {
        this["__" + inputKey] = coerceNumberProperty (value);
      }
    });
  };
} // NumberInput

export function UntilDestroy<T extends new (...args: any[]) => { } & OnDestroy> (constructor: T): void {
  const originalDestroy = constructor.prototype.ngOnDestroy;
  if (typeof originalDestroy !== "function") {
    console.warn (`${ constructor.name } is using @TakeUntilDestroy but does not implement OnDestroy`);
  } // if
  if (!constructor.prototype[untilDestorySymbol]) {
    constructor.prototype[untilDestorySymbol] = true;
    constructor.prototype.ngOnDestroy = function (...args: any): void {
      if (typeof originalDestroy === "function") {
        originalDestroy.apply (this, args);
      } // if
      if (this[destroySymbol]) {
        this[destroySymbol].next ();
        this[destroySymbol].complete ();
      } // if
    };
  } // if
} // TakeUntilDestroy

export const untilDestroy = <T> (
  component: OnDestroy
): MonoTypeOperatorFunction<T> => {
  const c = component as any;
  const obs = c[destroySymbol];
  if (!obs) {
    c[destroySymbol] = new Subject ();
  } // if
  if (!c[untilDestorySymbol]) {
    console.warn (`Aggiungi il decoratore @TakeUntilDestroy nella classe [${ c.constructor?.name }] dato che utilizza 'untilDestroy (this)'.`);
  } // if
  return takeUntil<T> (c[destroySymbol]);
}; // untilDestroy

export function subscribeTo (asyncEffect$: Observable<any>, component: OnDestroy) {
  // tslint:disable-next-line: deprecation
  asyncEffect$.pipe (untilDestroy (component)).subscribe ();
} // subscribeTo

export function SwitchingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (switchMap (args => asyncEffect$ (args).pipe (catchError (() => EMPTY)))));
} // SwitchingEvent

export function MergingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (mergeMap (args => asyncEffect$ (args).pipe (catchError (() => EMPTY)))));
} // MergingEvent

export function ConcatingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (concatMap (args => asyncEffect$ (args).pipe (catchError (() => EMPTY)))));
} // ConcatingEvent

export function ExhaustingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (exhaustMap (args => asyncEffect$ (args).pipe (catchError (() => EMPTY)))));
} // ExhaustingEvent

export function DebouncingEvent (config: { dueTime: number }) {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (debounceTime (config?.dueTime || 150), switchMap (args => asyncEffect$ (args).pipe (catchError (() => EMPTY)))));
} // DebouncingEvent

function asyncEventDecorator (generator$: (origin$: Observable<any>, asyncEffect$: (args: any) => Observable<any>) => Observable<any>) {
  return (targetProt: OnDestroy, methodName: string, methodDescriptor: PropertyDescriptor) => {
    const originalMethod: (...args: any) => Observable<any> = methodDescriptor.value;
    const asyncEventSubscribed = "__$" + methodName + "subscribed";
    methodDescriptor.value = function (...args: any): void {
      const thisComponent = this as any;
      let $origin = thisComponent[asyncEventOriginSymbol];
      if (!$origin) {
        $origin = new Subject<any> ();
        thisComponent[asyncEventOriginSymbol] = $origin;
      } // if
      if (!thisComponent[asyncEventSubscribed]) {
        generator$ (
          $origin.pipe (filter (({ eventName }) => eventName === methodName)),
          (d: any) => originalMethod.apply (this, d.args)
        ).pipe (untilDestroy (thisComponent))
        // tslint:disable-next-line: deprecation
        .subscribe ();
        thisComponent[asyncEventSubscribed] = true;
      } // if
      $origin.next ({ args, eventName: methodName });
    };
  };
} // asyncEventDecorator
