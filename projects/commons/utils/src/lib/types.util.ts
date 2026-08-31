export type Key = string | number;

export function isEmptyKey(key: any) {
  return !(key || key === 0);
}

export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}
export function isString(value: any): value is string {
  return typeof value === 'string';
}
export function isArrayOfStrings(value: any[]): value is string[] {
  return !value || !value.length || value.every((v) => isString(v));
}

export type KeyOfType<T, TProp> = {
  [P in keyof T]: T[P] extends TProp ? P : never;
}[keyof T]; // funziona?

/** @deprecated */
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/*
  DeepPartial
  N.B.: non si riesce ad ottenere un DeepPartial sensato. Ci sono tre problemi:
  1. il tipo dei campi primitivi non viene compreso (es. se entity è DeepPartial<E>, entity.uid dà come tipo DeepPartial<E["uid"]>);
  2. non si riesce ad assegnare una valore di tipo T o Partial<T> a DeepPartial<T>;
  3. gli array perdono i metodi a loro associati (es. map, filter...).

  Abbiamo tre soluzioni che tuttavia hanno ciascuna uno dei tre problemi:

  1. soluzione A non risolve il problema 1;
  2. soluzione B non risolve il problema 2;
  3. soluzione C non risolve il problema 3.

  // Soluzione A
  // export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
  // Soluzione B
  // export type DeepPartial<T> = T extends (infer U)[] ? DeepPartial<U>[] : (T extends object ? { [P in keyof T]?: DeepPartial<T[P]>; } : T);
  // Soluzione C
  // export type DeepPartial<T> = T | Partial<T> | (T extends object ? ({ [P in keyof T]?: DeepPartial<T[P]>; }) : T);

  // Test 1
  function function1<T extends { field: number }> (model: DeepPartial<T>): number { return model.field; }
  // Test 2
  function function2<T> (model: Partial<T>): DeepPartial<T> { return model; }
  // Test 3
  function function3<T> (array: DeepPartial<T[]>): DeepPartial<T[]> { return array.map (a => a); }
*/
