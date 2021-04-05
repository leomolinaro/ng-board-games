import { coerceNumberProperty } from "@angular/cdk/coercion";
import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, EMPTY, MonoTypeOperatorFunction, Observable, Subject } from "rxjs";
import { catchError, concatMap, debounceTime, exhaustMap, filter, finalize, map, mergeMap, switchMap, takeUntil } from "rxjs/operators";

const destroyUsedSymbol = Symbol ("__destroyUsed");
const destroyObsSymbol = Symbol ("__destroy$");
const destorySubjectSymbol = Symbol ("__$destroy");
const loadingUsedSymbol = Symbol ("__loadingUsed");
const loadingObsSymbol = Symbol ("__loading$");
const loadingSubjectSymbol = Symbol ("__$loading");
const asyncEventSubjectSymbol = Symbol ("__$ascynEvent");
function asyncEventSubscribedSymbol (methodName: string) { return Symbol (`__$${methodName}Subscribed`); }
function rawBooleanSymbol (propName: string) { return Symbol (`__${propName}Raw`); }
function rawNumberSymbol (propName: string) { return Symbol (`__${propName}Raw`); }

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
  return <K extends string> (componentProt: Record<K, boolean>, inputKey: K) => {
    const rawBooleanKey = rawBooleanSymbol (inputKey);
    Object.defineProperty (componentProt, inputKey, {
      get: function () { return this[rawBooleanKey]; },
      set: function (value: any) {
        this[rawBooleanKey] = (value != null && `${ value }` !== "false");
      }
    });
  };
} // BooleanInput

export function NumberInput () {
  return <K extends string> (componentProt: Record<K, number>, inputKey: K) => {
    const rawNumberKey = rawNumberSymbol (inputKey);
    Object.defineProperty (componentProt, inputKey, {
      get: function () { return this[rawNumberKey]; },
      set: function (value: any) {
        this[rawNumberKey] = coerceNumberProperty (value);
      }
    });
  };
} // NumberInput

export function UntilDestroy (
  constructor: new (...args: any[]) => OnDestroy
): void {
  const prot = constructor.prototype;
  const originalDestroy = prot.ngOnDestroy;
  if (!prot[destroyUsedSymbol]) {
    prot[destroyUsedSymbol] = true;
    prot.ngOnDestroy = function (): void {
      if (this[destorySubjectSymbol]) {
        this[destorySubjectSymbol].next ();
        this[destorySubjectSymbol].complete ();
      } // if
      originalDestroy.apply (this);
    };
  } // if
} // UntilDestroy

export const untilDestroy = <T> (
  component: OnDestroy
): MonoTypeOperatorFunction<T> => {
  const c = component as any;
  const obs = c[destroyObsSymbol];
  if (!obs) {
    c[destorySubjectSymbol] = new Subject ();
    c[destroyObsSymbol] = c[destorySubjectSymbol].asObservable ();
  } // if
  if (!c[destroyUsedSymbol]) {
    console.warn (`Aggiungi il decoratore @TakeUntilDestroy nella classe [${ c.constructor?.name }] dato che utilizza 'untilDestroy (this)'.`);
  } // if
  return takeUntil<T> (c[destroyObsSymbol]);
}; // untilDestroy

export function Loading () {
  return <K extends string> (componentProt: Record<K, Observable<boolean>>, inputKey: K) => {
    (componentProt as any)[loadingUsedSymbol] = true;
    Object.defineProperty (componentProt, inputKey, {
      get: function () { return this[loadingObsSymbol]; },
    });
  };
} // Loading

export function ChangeListener () {
  return <V, O extends Observable<V>>(
    targetProt: OnDestroy,
    methodName: string,
    methodDescriptor: TypedPropertyDescriptor<((...args: any) => O)>
  ) => {
    const originalMethod = methodDescriptor.value;
    if (originalMethod) {
      methodDescriptor.value = function (...args: any) {
        const obs$ = originalMethod.apply (this, args);
        // tslint:disable-next-line: deprecation
        obs$.pipe (untilDestroy (this)).subscribe ();
        return obs$;
      };
    } // if
  };
} // ChangeListener

export function InitEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (switchMap (args => asyncEffect$ (args))));
} // InitEvent

export function SwitchingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (switchMap (args => asyncEffect$ (args))));
} // SwitchingEvent

export function MergingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (mergeMap (args => asyncEffect$ (args))));
} // MergingEvent

export function ConcatingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (concatMap (args => asyncEffect$ (args))));
} // ConcatingEvent

export function ExhaustingEvent () {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (exhaustMap (args => asyncEffect$ (args))));
} // ExhaustingEvent

export function DebouncingEvent (config: { dueTime: number }) {
  return asyncEventDecorator ((origin$, asyncEffect$) => origin$.pipe (debounceTime (config?.dueTime || 150), switchMap (args => asyncEffect$ (args))));
} // DebouncingEvent

function asyncEventDecorator (
  generator$: (
    origin$: Observable<any>,
    asyncEffect$: (args: any) => Observable<any>
  ) => Observable<any>
) {
  return (targetProt: OnDestroy, methodName: string, methodDescriptor: TypedPropertyDescriptor<((...args: any) => Observable<any>)>) => {
    const originalMethod: (...args: any) => Observable<any> = methodDescriptor.value as any;
    const asyncEventSubscribed = asyncEventSubscribedSymbol (methodName);
    methodDescriptor.value = function (...args: any): void {
      let $origin: Subject<{ args: any[], eventName: string }> = this[asyncEventSubjectSymbol];
      if (!$origin) {
        $origin = new Subject<{ args: any[], eventName: string }> ();
        this[asyncEventSubjectSymbol] = $origin;
      } // if
      let $loading: BehaviorSubject<number> = this[loadingSubjectSymbol];
      if (this[loadingUsedSymbol]) {
        if (!$loading) {
          $loading = new BehaviorSubject<number> (0);
          this[loadingSubjectSymbol] = $loading;
          this[loadingObsSymbol] = $loading.asObservable ().pipe (map (l => l > 0));
        } // if
      } // if
      if (!this[asyncEventSubscribed]) {
        const asyncEffect$: (args: any) => Observable<any> = $loading ?
          (x: { args: any[], eventName: string }) => {
            if ($loading) { $loading.next ($loading.getValue () + 1); }
            return originalMethod.apply (this, x.args).pipe (
              catchError (() => EMPTY),
              finalize (() => $loading.next ($loading.getValue () - 1))
            );
          } :
          (x: { args: any[], eventName: string }) => {
            return originalMethod.apply (this, x.args).pipe (
              catchError (() => EMPTY),
            );
          };
        generator$ (
          $origin.pipe (filter (({ eventName }) => eventName === methodName)),
          asyncEffect$
        ).pipe (untilDestroy (this))
        // tslint:disable-next-line: deprecation
        .subscribe ();
        this[asyncEventSubscribed] = true;
      } // if
      $origin.next ({ args, eventName: methodName });
    } as any; // questo cast è sensato in quanto viene cambiato l'output del metodo
  };
} // asyncEventDecorator
