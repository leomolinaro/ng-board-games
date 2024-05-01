import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { BehaviorSubject, EMPTY, MonoTypeOperatorFunction, Observable, Subject, catchError, concatMap, debounceTime, exhaustMap, filter, finalize, map, mergeMap, of, switchMap, takeUntil } from "rxjs";

const destroyUsedSymbol = Symbol ("__destroyUsed");
const destroyObsSymbol = Symbol ("__destroy$");
const destorySubjectSymbol = Symbol ("__$destroy");
const loadingUsedSymbol = Symbol ("__loadingUsed");
const loadingObsSymbol = Symbol ("__loading$");
const loadingSubjectSymbol = Symbol ("__$loading");
const asyncEventSubjectSymbol = Symbol ("__$ascynEvent");
function asyncEventSubscribedSymbol (methodName: string) {
  return Symbol (`__$${methodName}Subscribed`);
}
function rawBooleanSymbol (propName: string) {
  return Symbol (`__${propName}Raw`);
}
function rawNumberSymbol (propName: string) {
  return Symbol (`__${propName}Raw`);
}

export interface NgLetContext<T> {
  $implicit: T | null;
  ngLet: T | null;
} // NgLetContext

@Directive ({
  selector: "[ngLet]",
  standalone: true
})
export class NgLetDirective<T> implements OnInit {
  constructor (
    private vcr: ViewContainerRef,
    private templateRef: TemplateRef<NgLetContext<T>>
  ) {}

  private context: NgLetContext<T> = {
    $implicit: null,
    ngLet: null,
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
    currentValue: C[K];
    firstChange: boolean;
    previousValue: C[K];
  };
};

export function BooleanInput () {
  return <K extends string>(componentProt: Record<K, boolean>, inputKey: K) => {
    const rawBooleanKey = rawBooleanSymbol (inputKey);
    Object.defineProperty (componentProt, inputKey, {
      get: function () {
        return this[rawBooleanKey];
      },
      set: function (value: any) {
        this[rawBooleanKey] = value != null && `${value}` !== "false";
      },
    });
  };
} // BooleanInput

export function NumberInput (fallbackValue?: number) {
  if (fallbackValue === undefined) {
    fallbackValue = 0;
  }
  return <K extends string>(componentProt: Record<K, number>, inputKey: K) => {
    const rawNumberKey = rawNumberSymbol (inputKey);
    Object.defineProperty (componentProt, inputKey, {
      get: function () {
        return this[rawNumberKey];
      },
      set: function (value: any) {
        this[rawNumberKey] =
          !isNaN (parseFloat (value)) && !isNaN (Number (value))
            ? Number (value)
            : fallbackValue;
      }, // set
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

export const untilDestroy = <T>(
  component: OnDestroy
): MonoTypeOperatorFunction<T> => {
  const c = component as any;
  const obs = c[destroyObsSymbol];
  if (!obs) {
    c[destorySubjectSymbol] = new Subject ();
    c[destroyObsSymbol] = c[destorySubjectSymbol].asObservable ();
  } // if
  if (!c[destroyUsedSymbol]) {
    console.warn (
      `Aggiungi il decoratore @TakeUntilDestroy nella classe [${c.constructor?.name}] dato che utilizza 'untilDestroy (this)'.`
    );
  } // if
  return takeUntil<T> (c[destroyObsSymbol]);
}; // untilDestroy

export function Loading () {
  return <K extends string>(
    componentProt: Record<K, Observable<boolean>>,
    inputKey: K
  ) => {
    (componentProt as any)[loadingUsedSymbol] = true;
    Object.defineProperty (componentProt, inputKey, {
      get: function () {
        // Controllo l'esistenza ed istanzio se necessario il subject per il loading.
        initLoading (this);
        return this[loadingObsSymbol];
      },
    });
  };
} // Loading

function initLoading (componentInstance: any) {
  let loading$ = componentInstance[loadingObsSymbol];
  if (!loading$) {
    const $loading = new BehaviorSubject<number> (0);
    loading$ = $loading.asObservable ().pipe (map ((l) => l > 0));
    componentInstance[loadingSubjectSymbol] = $loading;
    componentInstance[loadingObsSymbol] = loading$;
  } // if
} // initLoading

export function ChangeListener () {
  return <V, O extends Observable<V>>(
    targetProt: OnDestroy,
    methodName: string,
    methodDescriptor: TypedPropertyDescriptor<(...args: any) => O>
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

interface AsyncEventConfig {
  suppressLoading?: boolean;
} // AsyncEventConfig

interface DebouncingEventConfig extends AsyncEventConfig {
  dueTime?: number;
} // DebouncingEventConfig

export function SingleEvent (config?: AsyncEventConfig) {
  return asyncEventDecorator (
    (origin$, asyncEffect$) =>
      origin$.pipe (switchMap ((args) => asyncEffect$ (args))),
    config,
    false
  );
} // SingleEvent

export function SwitchingEvent (config?: AsyncEventConfig) {
  return asyncEventDecorator (
    (origin$, asyncEffect$) =>
      origin$.pipe (switchMap ((args) => asyncEffect$ (args))),
    config,
    false
  );
} // SwitchingEvent

export function MergingEvent (config?: AsyncEventConfig) {
  return asyncEventDecorator (
    (origin$, asyncEffect$) =>
      origin$.pipe (mergeMap ((args) => asyncEffect$ (args))),
    config,
    false
  );
} // MergingEvent

export function ConcatingEvent (config?: AsyncEventConfig) {
  return asyncEventDecorator (
    (origin$, asyncEffect$) =>
      origin$.pipe (concatMap ((args) => asyncEffect$ (args))),
    config,
    true
  );
} // ConcatingEvent

export function ExhaustingEvent (config?: AsyncEventConfig) {
  return asyncEventDecorator (
    (origin$, asyncEffect$) =>
      origin$.pipe (exhaustMap ((args) => asyncEffect$ (args))),
    config,
    false
  );
} // ExhaustingEvent

export function DebouncingEvent (config?: DebouncingEventConfig) {
  return asyncEventDecorator (
    (origin$, asyncEffect$) =>
      origin$.pipe (
        debounceTime (config?.dueTime || 150),
        switchMap ((args) => asyncEffect$ (args))
      ),
    config,
    true
  );
} // DebouncingEvent

function asyncEventDecorator (
  generator$: (
    origin$: Observable<any>,
    asyncEffect$: (args: any) => Observable<any>
  ) => Observable<any>,
  config: AsyncEventConfig | undefined,
  copyNgOnChangesArg: boolean
) {
  return (
    targetProt: OnDestroy,
    methodName: string,
    methodDescriptor: TypedPropertyDescriptor<(...args: any) => Observable<any>>
  ) => {
    const copyArgs = copyNgOnChangesArg && methodName === "ngOnChanges";
    const originalMethod: (...args: any) => Observable<any> | void =
      methodDescriptor.value!;
    const asyncEventSubscribed = asyncEventSubscribedSymbol (methodName);
    methodDescriptor.value = function (...args: any): void {
      // Controllo l'esistenza e eventualmente istanzio il subject origine di tutti gli eventi asincroni.
      let $origin: Subject<{ args: any[]; eventName: string }> =
        this[asyncEventSubjectSymbol];
      if (!$origin) {
        $origin = new Subject<{ args: any[]; eventName: string }> ();
        this[asyncEventSubjectSymbol] = $origin;
      } // if
      // Ricavo il subject per il loading, se esistente.
      let $loading: BehaviorSubject<number> | null = null;
      if (this[loadingUsedSymbol]) {
        initLoading (this);
        $loading = this[loadingSubjectSymbol];
      } // if
      if (!this[asyncEventSubscribed]) {
        // Istanzio la funzione che dato l'observable originale, lo wrappa gestendo il catchError e il loading, se attivo.
        const getWrappedObservable$: (
          originalObservable$: Observable<any>
        ) => Observable<any> =
          $loading && !config?.suppressLoading
            ? (originalObservable$) => {
              $loading!.next ($loading!.getValue () + 1);
              return originalObservable$.pipe (
                catchError ((e) => {
                  console.error (e);
                  return EMPTY;
                }),
                finalize (() => $loading!.next ($loading!.getValue () - 1))
              );
            }
            : (originalObservable$) => {
              return originalObservable$.pipe (
                catchError ((e) => {
                  console.error (e);
                  return EMPTY;
                })
              );
            };
        const asyncEffect$: (x: {
          args: any[];
          eventName: string;
        }) => Observable<any> = (x) => {
          const originalObservable$: Observable<any> | void =
            originalMethod.apply (this, x.args);
          if (originalObservable$) {
            return getWrappedObservable$ (originalObservable$);
          } else {
            return of (void 0);
          } // if - else
        };
        generator$ (
          $origin.pipe (filter (({ eventName }) => eventName === methodName)),
          asyncEffect$
        )
          .pipe (untilDestroy (this))
          .subscribe ();
        this[asyncEventSubscribed] = true;
      } // if
      if (copyArgs) {
        args = args.map ((arg: any) => ({ ...arg }));
      }
      $origin.next ({ args, eventName: methodName });
    } as any; // questo cast è sensato in quanto viene cambiato l'output del metodo
  };
} // asyncEventDecorator
