import { Key } from './types.util';

export function range<T = number>(
  length: number,
  supplier?: (index: number) => T
): T[] {
  if (!supplier) {
    supplier = (index) => index as unknown as T;
  }
  const array: T[] = [];
  for (let i = 0; i < length; i++) {
    array.push(supplier(i));
  } // for
  return array;
} // range

export function isEmpty<T>(array: T[]): boolean {
  return !isNotEmpty(array);
} // isEmpty

export function isNotEmpty<T>(array: T[]): boolean {
  return array && array.length ? true : false;
} // isNotEmpty

export function sortComparatorByKey(
  key: string
): (val1: object, val2: object) => number {
  return (val1: { [key: string]: any }, val2: { [key: string]: any }) => {
    return val1[key] < val2[key] ? -1 : val1[key] === val2[key] ? 0 : 1;
  };
} // sortComparatorByKey
/**
 * Trasla un array in modo che il primo elemento diventi quello in posizione firstIndex.
 * @param firstIndex L'indice dell'elemento che diventerà il primo nel nuovo array.
 * @param array L'array da traslare.
 * @return Un nuovo array traslato rispetto al precedente.
 * @template T Il tipo di elemento contenuto nell'array.
 */
export function translate<T>(firstIndex: number, array: T[]): T[] {
  const toReturn: T[] = [];
  for (let i = firstIndex; i < array.length; i++) {
    toReturn.push(array[i]);
  }
  for (let i = 0; i < firstIndex; i++) {
    toReturn.push(array[i]);
  }
  return toReturn;
} // translate

export function toMap<T, K extends Key, V>(
  array: T[],
  keyGetter: (e: T, index: number) => K,
  valueGetter?: (e: T, key: K, index: number) => V
): { [key: string]: V } {
  const vG = valueGetter || ((e) => e as unknown as V);
  const map: { [key: string]: V } = {};
  array?.forEach((e, index) => {
    const key = keyGetter(e, index);
    map[key] = vG(e, key, index);
  });
  return map;
} // toMap

export function safeArray<T>(array: T[]): T[] {
  return array || [];
} // safeArray

export function mapToDistinct<T, V extends string | number>(
  array: T[],
  valueGetter: (e: T) => V
): V[] {
  const toReturn: V[] = [];
  const set: { [key: string]: boolean } = {};
  array.forEach((e) => {
    const value = valueGetter(e);
    if (!set[value]) {
      set[value] = true;
      toReturn.push(value);
    } // if
  });
  return toReturn;
} // mapToDistinct

export function flattify<T>(arrays: T[][]): T[] {
  return ([] as T[]).concat.apply([] as T[], arrays);
} // flattify

export function entitiesToNodes<E, N>(
  entities: E[],
  oldMap: Record<string | number, N>,
  getEntityId: (entity: E) => string | number,
  isEntityUnchanged: (entity: E, node: N) => boolean,
  entityToNode: (entity: E, index: number, oldNode: N | null) => N
): { nodes: N[]; map: Record<string | number, N> } {
  const map: Record<string | number, N> = {};
  const nodes: N[] = [];
  entities.forEach((entity, index) => {
    const id = getEntityId(entity);
    let node!: N;
    const oldNode = oldMap[id];
    if (oldNode) {
      if (isEntityUnchanged(entity, oldNode)) {
        node = oldNode;
      } else {
        node = entityToNode(entity, index, oldNode);
      } // if - else
    } else {
      node = entityToNode(entity, index, null);
    } // if - else
    map[id] = node;
    nodes.push(node);
  });
  return { map, nodes };
} // entitiesToNodes

export function group<T, K extends number | string, V = T>(
  array: T[],
  getKey: (e: T) => K,
  getValue?: (e: T) => V
): Record<K, V[]> {
  if (!getValue) {
    getValue = (e) => e as unknown as V;
  }
  const map = {} as Record<K, V[]>;
  array?.forEach((e) => {
    const key = getKey(e);
    let groupList = map[key];
    if (!groupList) {
      groupList = [];
      map[key] = groupList;
    } // if
    groupList.push(getValue!(e));
  });
  return map;
} // group
