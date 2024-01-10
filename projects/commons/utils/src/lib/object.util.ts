export function forEachProp<T> (obj: T, fn: (key: string, value: any) => void) {
  Object.entries (obj as any).forEach (([k, v]) => fn (k, v));
} // forEachProp

export function isEmpty<T extends object> (obj: T): boolean {
  return !obj || Object.keys (obj).length === 0;
} // isEmpty
