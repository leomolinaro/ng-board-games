export type Key = string | number;

function error(msg: string): never {
  throw new Error(msg);
}

export function listRemoveFirst<T>(matcher: (e: T) => boolean, list: T[]): T[] {
  if (list) {
    const index = list.findIndex((element) => matcher(element));
    if (index === -1) {
      error('match not found');
      return list;
    }
    return listRemoveByIndex(index, list);
  }
  error('empty list');
  return list;
}

export function listRemoveAll<T>(matcher: (e: T) => boolean, list: T[]): T[] {
  if (list) {
    return list.filter((e) => !matcher(e));
  }
  error('empty list');
  return list;
}

export function listRemoveByIndex<T>(index: number, list: T[]): T[] {
  return list.filter((_el, i) => i !== index);
}

export function listReplaceFirst<T>(
  matcher: (e: T) => boolean,
  element: T,
  list: T[],
): T[] {
  if (list) {
    const index = list.findIndex((element) => matcher(element));
    if (index === -1) {
      error('match not found');
      return list;
    }
    return listReplaceByIndex(index, element, list);
  }
  error('empty list');
  return list;
}

export function listReplaceFirstOrInsert<T>(
  matcher: (e: T) => boolean,
  element: T,
  insertIndex: number,
  list: T[],
): T[] {
  if (list) {
    const index = list.findIndex((element) => matcher(element));
    return index === -1
      ? listInsert(element, insertIndex, list)
      : listReplaceByIndex(index, element, list);
  }
  return listInsert(element, insertIndex, list);
}

export function listUpdateFirstOrPush<T>(
  matcher: (e: T) => boolean,
  updater: (e: T) => T,
  pusher: () => T,
  list: T[],
): T[] {
  const index = list.findIndex((element) => matcher(element));
  if (index === -1) {
    const newElement = pusher();
    return listPush([newElement], list);
  }
  const newElement = updater(list[index]);
  return listReplaceByIndex(index, newElement, list);
}

/**
 * Rimpiazza l'elemento della lista posizionato all'indice dato con un nuovo elemento.
 * @param index L'indice dell'elemento da rimpiazzare.
 * @param element L'elemento nuovo.
 * @param list La lista.
 * @return La lista risultante.
 */
export function listReplaceByIndex<T>(
  index: number,
  element: T,
  list: T[],
): T[] {
  const newList = [...list];
  newList[index] = element;
  return newList;
}

export function listInsert<T>(element: T, index: number, list: T[]): T[] {
  if (list) {
    if (index != undefined && index >= 0) {
      if (index > list.length) {
        error('index greater than list length');
        return list;
      }
      const newArray = [...list];
      newArray.splice(index, 0, element);
      return newArray;
    }
    return [...list, element];
  }
  return [element];
}

export function listPush<T>(toPush: T[], list: T[]): T[] {
  if (toPush && toPush.length > 0) {
    return list ? [...list, ...toPush] : [...toPush];
  }
  return list;
}
