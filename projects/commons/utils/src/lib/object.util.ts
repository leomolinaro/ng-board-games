export function forEachProp<T extends object>(
  obj: T,
  fn: (key: string, value: any) => void,
) {
  Object.entries(obj).forEach(([k, v]) => fn(k, v));
}
