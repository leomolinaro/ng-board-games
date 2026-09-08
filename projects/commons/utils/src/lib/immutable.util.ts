export type Key = string | number;

function error(msg: string) {
  throw new Error(msg);
}

export function listRemoveFirst<T>(matcher: (e: T) => boolean, list: T[]) {
  if (list) {
    const index = list.findIndex(matcher);
    if (index >= 0) {
      return listRemoveByIndex(index, list);
    } else {
      error('match not found');
      return list;
    }
  } else {
    error('empty list');
    return list;
  }
}

export function listRemoveAll<T>(matcher: (e: T) => boolean, list: T[]) {
  if (list) {
    return list.filter((e) => !matcher(e));
  } else {
    error('empty list');
    return list;
  }
}

export function listRemoveByIndex<T>(index: number, list: T[]) {
  return list.filter((_el, i) => i !== index);
}

export function listReplaceFirst<T>(
  matcher: (e: T) => boolean,
  element: T,
  list: T[],
) {
  if (list) {
    const index = list.findIndex(matcher);
    if (index >= 0) {
      return listReplaceByIndex(index, element, list);
    } else {
      error('match not found');
      return list;
    }
  } else {
    error('empty list');
    return list;
  }
}

export function listReplaceFirstOrInsert<T>(
  matcher: (e: T) => boolean,
  element: T,
  insertIndex: number,
  list: T[],
) {
  if (list) {
    const index = list.findIndex(matcher);
    if (index >= 0) {
      return listReplaceByIndex(index, element, list);
    } else {
      return listInsert(element, insertIndex, list);
    }
  } else {
    return listInsert(element, insertIndex, list);
  }
}

export function listUpdateFirstOrPush<T>(
  matcher: (e: T) => boolean,
  updater: (e: T) => T,
  pusher: () => T,
  list: T[],
) {
  const index = list.findIndex(matcher);
  if (index >= 0) {
    const newElement = updater(list[index]);
    return listReplaceByIndex(index, newElement, list);
  } else {
    const newElement = pusher();
    return listPush([newElement], list);
  }
}

/**
 * Rimpiazza l'elemento della lista posizionato all'indice dato con un nuovo elemento.
 * @param index L'indice dell'elemento da rimpiazzare.
 * @param element L'elemento nuovo.
 * @param list La lista.
 * @return La lista risultante.
 */
export function listReplaceByIndex<T>(index: number, element: T, list: T[]) {
  const newList = [...list];
  newList[index] = element;
  return newList;
}

export function listInsert<T>(element: T, index: number, list: T[]) {
  if (list) {
    if (index != null && index >= 0) {
      if (index > list.length) {
        error('index greater than list length');
        return list;
      } else {
        const newArray = [...list];
        newArray.splice(index, 0, element);
        return newArray;
      }
    } else {
      return [...list, element];
    }
  } else {
    return [element];
  }
}

export function listPush<T>(toPush: T[], list: T[]) {
  if (toPush && toPush.length > 0) {
    if (list) {
      return [...list, ...toPush];
    } else {
      return [...toPush];
    }
  } else {
    return list;
  }
}
