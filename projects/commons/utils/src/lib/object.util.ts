export function forEachProp<K extends string | number, V>(
  obj: Record<K, V>,
  fn: (key: K, value: V) => void,
) {
  (Object.entries(obj) as [K, V][]).forEach(([k, v]) => fn(k, v));
}
