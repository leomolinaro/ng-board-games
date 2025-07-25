import {
  asapScheduler,
  BehaviorSubject,
  combineLatest,
  MonoTypeOperatorFunction,
  Observable,
  Subscription
} from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { bgReduxDevtools, BgReduxDevtoolsInstance } from "./redux-devtools";

export type Exactly<S, T> = {
  [K in keyof S]: K extends keyof T ? T[K] : never;
};

// S extends BaronyUiState & { [K in keyof S]: K extends keyof BaronyUiState ? BaronyUiState[K] : never }

export class BgStore<S extends object> {
  constructor(private defaultState: S, private name: string) {
    this.devtoolsInstance = bgReduxDevtools.connect(name);
    if (this.devtoolsInstance) {
      this.devtoolsInstance.init(defaultState);
    }
  } // constructor

  private $state = new BehaviorSubject<S>(this.defaultState);
  private devtoolsInstance: BgReduxDevtoolsInstance | null;

  get(): S;
  get<R>(projector: (s: S) => R): R;
  get<R>(projector?: (s: S) => R): R | S {
    const state = this.$state.getValue();
    if (projector) {
      return projector(state);
    } else {
      return state;
    } // if - else
  } // get

  select$(): Observable<S>;
  select$<R>(projector: (s: S) => R): Observable<R>;
  select$<R, S1>(s1: Observable<S1>, projector: (s1: S1) => R): Observable<R>;
  select$<R, S1, S2>(s1: Observable<S1>, s2: Observable<S2>, projector: (s1: S1, s2: S2) => R): Observable<R>;
  select$<R, S1, S2, S3>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    projector: (s1: S1, s2: S2, s3: S3) => R
  ): Observable<R>;
  select$<R, S1, S2, S3, S4>(
    s1: Observable<S1>,
    s2: Observable<S2>,
    s3: Observable<S3>,
    s4: Observable<S4>,
    projector: (s1: S1, s2: S2, s3: S3, s4: S4) => R
  ): Observable<R>;
  select$<A extends (Observable<unknown> | P)[], R, P = (...a: any[]) => R>(...args: A): Observable<R> | Observable<S> {
    if (args && args.length) {
      const { observables, projector } = this.processSelectorArgs<A, R, P>(args);

      let observable$: Observable<R>;

      if (observables.length) {
        observable$ = combineLatest(observables).pipe(map(projectorArgs => (projector as any)(...projectorArgs)));
      } else {
        observable$ = this.$state.pipe(map(s => (projector as any)(s)));
      } // if - else

      return observable$.pipe(distinctUntilChanged());
    } else {
      return this.$state.asObservable();
    } // if - else
  } // select$

  private processSelectorArgs<A extends (Observable<unknown> | P)[], R, P = (...a: unknown[]) => R>(
    args: A
  ): {
    observables: Observable<unknown>[];
    projector: P;
  } {
    const selectorArgs = Array.from(args);
    const projector = selectorArgs.pop() as P;
    const observables = selectorArgs as Observable<unknown>[];
    return {
      observables,
      projector
    };
  } // processSelectorArgs

  // selectAsync$<R> (projector: (s: S) => R): Observable<R>;
  // selectAsync$<
  //   O extends Array<Observable<unknown> | ProjectorFn>,
  //   R,
  //   ProjectorFn = (...a: unknown[]) => R
  // > (...args: O): Observable<R> {
  //   (args as any).push ({ debounce: true });
  //   return (this.componentStore as any).select (...args);
  // } // selectSync$

  update(actionName: string, updaterFnOrPatch: ((state: S) => S) | Partial<S>): void {
    const state = this.$state.getValue();
    let newState: S;
    if (typeof updaterFnOrPatch === "function") {
      newState = updaterFnOrPatch(state);
    } else {
      newState = { ...state, ...updaterFnOrPatch };
    } // if - else
    this.$state.next(newState);
    if (this.devtoolsInstance) {
      this.devtoolsInstance.send(actionName, newState);
    } // if
  } // update
} // SStore

export function debounceSync<T>(): MonoTypeOperatorFunction<T> {
  return source =>
    new Observable<T>(observer => {
      let actionSubscription: Subscription | undefined;
      let actionValue: T | undefined;
      const rootSubscription = new Subscription();
      rootSubscription.add(
        // tslint:disable-next-line: deprecation
        source.subscribe({
          complete: () => {
            if (actionSubscription) {
              observer.next(actionValue);
            }
            observer.complete();
          },
          error: error => {
            observer.error(error);
          },
          next: value => {
            actionValue = value;
            if (!actionSubscription) {
              actionSubscription = asapScheduler.schedule(() => {
                observer.next(actionValue);
                actionSubscription = undefined;
              });
              rootSubscription.add(actionSubscription);
            }
          }
        })
      );
      return rootSubscription;
    });
} // debounceSync
