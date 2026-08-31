// In caso di errore, stampo in console un messaggio e ritorno le liste originali.

export type Key = string | number;

function error(msg: string) {
  throw new Error(msg);
}

function toMap<E, V = E>(
  list: E[],
  keyGetter: (e: E) => any,
  valueGetter?: (e: E) => V,
): Record<string, V> {
  if (list) {
    if (valueGetter) {
      const map: Record<string, V> = {};
      list.forEach((e) => (map[keyGetter(e)] = valueGetter(e)));
      return map;
    } else {
      const map: Record<string, V> = {};
      list.forEach((e) => (map[keyGetter(e)] = e as unknown as V));
      return map;
    }
  }
  return {};
}

/************************************************************************************************/
/**** UTILITA' SULLE LISTE **********************************************************************/
/************************************************************************************************/

export function listGetByIndicies<T>(indicies: number[], list: T[]) {
  const indexMap = toMap(
    indicies,
    (i) => i,
    (i) => true,
  );
  return list.filter((element, index) => indexMap[index]);
}

/**
 * Crea una lista di entità che corrispondono alla lista patch sulla base del confronto delle chiavi.
 * Se viene trovato un elemento patch che non corrisponde a nessuna entità vecchia, viene creata un'entità nuova.
 * Se viene trovato un elemento patch che corrisponde ad un'entità vecchia, viene mantenuta l'entità vecchia.
 * Se un'entità vecchia non corrisponde a nessun elemento patch, non sarà presente nel risultato.
 * Se tutti gli elementi patch corrispondono esattamente alle entità, viene restituita la lista vecchia.
 * @param patchList La lista patch.
 * @param patchListKeyGetter L'estrattore di chiave dagli elementi patch.
 * @param entityOldList La lista delle vecchie entità.
 * @param entityListKeyGetter L'estrattore di chiave dagli elementi entity.
 * @param createEntity Il creatore di entità a partire dalla chiave.
 */
export function listMergeLists<P, E>(
  patchList: P[],
  patchListKeyGetter: (e: P) => any,
  entityOldList: E[],
  entityListKeyGetter: (e: E) => any,
  createEntity: (p: P, key: any) => E,
) {
  const entityOldMap = toMap(entityOldList, entityListKeyGetter);
  const entityNewList: E[] = [];
  let entityListChanged = false;
  patchList.forEach((p) => {
    const key = patchListKeyGetter(p);
    let e = entityOldMap[key];
    if (e) {
      delete entityOldMap[key];
    } else {
      e = createEntity(p, key);
      entityListChanged = true;
    }
    entityNewList.push(e);
  });
  if (Object.keys(entityOldList).length) {
    entityListChanged = true;
  }
  return entityListChanged ? entityNewList : entityOldList;
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
  return list.filter((el, i) => i !== index);
}

export function listRemoveByIndicies<T>(indicies: number[], list: T[]) {
  const indexMap = toMap(
    indicies,
    (i) => i,
    (i) => true,
  );
  return list.filter((element, index) => !indexMap[index]);
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
