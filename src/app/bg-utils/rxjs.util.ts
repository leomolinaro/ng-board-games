import { concat, Observable, ObservableInput, ObservedValuesFromArray } from "rxjs";
import { toArray } from "rxjs/operators";

export function concatJoin<A>(sources: [ObservableInput<A>]): Observable<[A]>;
export function concatJoin<A, B>(sources: [ObservableInput<A>, ObservableInput<B>]): Observable<[A, B]>;
export function concatJoin<A, B, C>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>]): Observable<[A, B, C]>;
export function concatJoin<A, B, C, D>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>]): Observable<[A, B, C, D]>;
export function concatJoin<A, B, C, D, E>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>, ObservableInput<E>]): Observable<[A, B, C, D, E]>;
export function concatJoin<A, B, C, D, E, F>(sources: [ObservableInput<A>, ObservableInput<B>, ObservableInput<C>, ObservableInput<D>, ObservableInput<E>, ObservableInput<F>]): Observable<[A, B, C, D, E, F]>;
export function concatJoin<O>(sources: ObservableInput<O>[]): Observable<O[]>;
export function concatJoin (sources: ObservableInput<any>[]): Observable<any[]>;
export function concatJoin<A extends ObservableInput<any>[]> (sources: A): Observable<ObservedValuesFromArray<A>[]> {
  return concat (...sources).pipe (toArray ());
} // concatJoin
