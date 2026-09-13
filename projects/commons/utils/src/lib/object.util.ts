export function forEachProp<K extends string | number, V>(
  obj: Record<K, V>,
  fn: (key: K, value: V) => void,
): void {
  for (const [k, v] of Object.entries(obj) as [K, V][]) fn(k, v);
}
