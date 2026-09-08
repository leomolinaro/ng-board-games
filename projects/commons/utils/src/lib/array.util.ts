export function range<T = number>(
  length: number,
  supplier?: (index: number) => T,
): T[] {
  supplier ??= (index) => index as unknown as T;
  const array: T[] = [];
  for (let i = 0; i < length; i++) {
    array.push(supplier(i));
  }
  return array;
}

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
}

export function toMap<T, K extends string, V>(
  array: T[],
  keyGetter: (e: T, index: number) => K,
  valueGetter?: (e: T, key: K, index: number) => V,
): Record<K, V> {
  const vG = valueGetter ?? ((e) => e as unknown as V);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const map: Record<K, V> = {} as any;
  array?.forEach((e, index) => {
    const key = keyGetter(e, index);
    map[key] = vG(e, key, index);
  });
  return map;
}

export function entitiesToNodes<E, N>(
  entities: E[],
  oldMap: Record<string | number, N>,
  getEntityId: (entity: E) => string | number,
  isEntityUnchanged: (entity: E, node: N) => boolean,
  entityToNode: (entity: E, index: number, oldNode: N | null) => N,
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
      }
    } else {
      node = entityToNode(entity, index, null);
    }
    map[id] = node;
    nodes.push(node);
  });
  return { map, nodes };
}

export function group<T, K extends number | string, V = T>(
  array: T[],
  getKey: (e: T) => K,
  getValue?: (e: T) => V,
): Record<K, V[]> {
  getValue ??= (e) => e as unknown as V;
  const map = {} as Record<K, V[]>;
  array?.forEach((e) => {
    const key = getKey(e);
    let groupList = map[key];
    if (!groupList) {
      groupList = [];
      map[key] = groupList;
    }
    groupList.push(getValue(e));
  });
  return map;
}

export function shuffle<T>(array: T[]): T[] {
  const newArray = array.slice();
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
