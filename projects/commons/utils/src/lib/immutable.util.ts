// In caso di errore, stampo in console un messaggio e ritorno le liste originali.

import { Key } from "./types.util";

function error(msg: string) {
  throw new Error(msg);
} // error

function toMap<E, V = E>(list: E[], keyGetter: (e: E) => any, valueGetter?: (e: E) => V): { [key: string]: V } {
  if (list) {
    if (valueGetter) {
      const map: { [key: string]: V } = {};
      list.forEach(e => (map[keyGetter(e)] = valueGetter(e)));
      return map;
    } else {
      const map: { [key: string]: V } = {};
      list.forEach(e => (map[keyGetter(e)] = e as unknown as V));
      return map;
    } // if - else
  } // if
  return {};
} // toMap

/************************************************************************************************/
/**** UTILITA' SULLE LISTE **********************************************************************/
/************************************************************************************************/

export function listGetByIndicies<T>(indicies: number[], list: T[]) {
  const indexMap = toMap(
    indicies,
    i => i,
    i => true
  );
  return list.filter((element, index) => indexMap[index]);
} // listGetByIndicies

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
  createEntity: (p: P, key: any) => E
) {
  const entityOldMap = toMap(entityOldList, entityListKeyGetter);
  const entityNewList: E[] = [];
  let entityListChanged = false;
  patchList.forEach(p => {
    const key = patchListKeyGetter(p);
    let e = entityOldMap[key];
    if (e) {
      delete entityOldMap[key];
    } else {
      e = createEntity(p, key);
      entityListChanged = true;
    } // if
    entityNewList.push(e);
  });
  if (Object.keys(entityOldList).length) {
    entityListChanged = true;
  }
  return entityListChanged ? entityNewList : entityOldList;
} // listMergeLists

export function listRemoveFirst<T>(matcher: (e: T) => boolean, list: T[]) {
  if (list) {
    const index = list.findIndex(matcher);
    if (index >= 0) {
      return listRemoveByIndex(index, list);
    } else {
      error("match not found");
      return list;
    } // if - else
  } else {
    error("empty list");
    return list;
  } // if - else
} // listRemoveFirst

export function listRemoveAll<T>(matcher: (e: T) => boolean, list: T[]) {
  if (list) {
    return list.filter(e => !matcher(e));
  } else {
    error("empty list");
    return list;
  } // if - else
} // listRemoveAll

export function listRemoveByIndex<T>(index: number, list: T[]) {
  return list.filter((el, i) => i !== index);
} // listRemoveByIndex

export function listRemoveByIndicies<T>(indicies: number[], list: T[]) {
  const indexMap = toMap(
    indicies,
    i => i,
    i => true
  );
  return list.filter((element, index) => !indexMap[index]);
} // listRemoveByIndicies

export function listReplaceFirst<T>(matcher: (e: T) => boolean, element: T, list: T[]) {
  if (list) {
    const index = list.findIndex(matcher);
    if (index >= 0) {
      return listReplaceByIndex(index, element, list);
    } else {
      error("match not found");
      return list;
    } // if - else
  } else {
    error("empty list");
    return list;
  } // if - else
} // listReplace

export function listReplaceFirstOrInsert<T>(matcher: (e: T) => boolean, element: T, insertIndex: number, list: T[]) {
  if (list) {
    const index = list.findIndex(matcher);
    if (index >= 0) {
      return listReplaceByIndex(index, element, list);
    } else {
      return listInsert(element, insertIndex, list);
    } // if - else
  } else {
    return listInsert(element, insertIndex, list);
  } // if - else
} // listReplaceFirstOrInsert

export function listUpdateFirstOrPush<T>(matcher: (e: T) => boolean, updater: (e: T) => T, pusher: () => T, list: T[]) {
  const index = list.findIndex(matcher);
  if (index >= 0) {
    const newElement = updater(list[index]);
    return listReplaceByIndex(index, newElement, list);
  } else {
    const newElement = pusher();
    return listPush([newElement], list);
  } // if - else
} // listReplaceFirstOrInsert

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
} // listElementReplacedByIndex

export function listMergeFirst<T>(matcher: (e: T) => boolean, changes: Partial<T>, list: T[]) {
  if (list) {
    const index = list.findIndex(matcher);
    if (index >= 0) {
      return listMergeByIndex(index, changes, list);
    } else {
      error("match not found");
      return list;
    } // if - else
  } else {
    error("empty list");
    return list;
  } // if - else
} // listMergeFirst

export function listMergeAll<T>(keyGetter: (e: T) => string, changesMap: { [id: string]: Partial<T> }, list: T[]) {
  const toReturn: T[] = [];
  let changed = false;
  for (const e of list) {
    const key = keyGetter(e);
    const elementChange = changesMap[key];
    if (elementChange) {
      toReturn.push({ ...e, ...elementChange });
      changed = true;
    } else {
      toReturn.push(e);
    } // if - else
  } // for
  return toReturn;
} // listMergeAll

export function listMergeByIndex<T>(index: number, change: Partial<T>, list: T[]) {
  const newList = [...list];
  newList[index] = { ...newList[index], ...change };
  return newList;
} // listMergeByIndex

export function listInsert<T>(element: T, index: number, list: T[]) {
  if (list) {
    if (index != null && index >= 0) {
      if (index > list.length) {
        error("index greater than list length");
        return list;
      } else {
        const newArray = [...list];
        newArray.splice(index, 0, element);
        return newArray;
      } // if - else
    } else {
      return [...list, element];
    } // if - else
  } else {
    return [element];
  } // if - else
} // listInsert

export function listPush<T>(toPush: T[], list: T[]) {
  if (toPush && toPush.length > 0) {
    if (list) {
      return [...list, ...toPush];
    } else {
      return [...toPush];
    } // if - else
  } else {
    return list;
  } // if - else
} // listPush

/**
 * Crea una nuova lista inserendo gli elementi della lista toInsert nella lista list, nell'ordine
 * dato dal comparatore.
 * N.B.: la lista list dev'essere già ordinata!
 */
export function listInsertBySort<T>(toInsert: T[], comparator: (a: T, b: T) => number, list: T[]) {
  toInsert = [...toInsert];
  toInsert.sort(comparator);
  if (list) {
    const toReturn: T[] = [];
    let toInsertIndex = 0;
    let listIndex = 0;
    while (toInsertIndex < toInsert.length && listIndex < list.length) {
      const toInsertElement = toInsert[toInsertIndex];
      const listElement = list[listIndex];
      const comparison = comparator(toInsertElement, listElement);
      if (comparison > 0) {
        toReturn.push(listElement);
        listIndex++;
      } else {
        toReturn.push(toInsertElement);
        toInsertIndex++;
      } // if - else
    } // while
    for (let i = toInsertIndex; i < toInsert.length; i++) {
      toReturn.push(toInsert[i]);
    } // for
    for (let i = listIndex; i < list.length; i++) {
      toReturn.push(list[i]);
    } // for
    return toReturn;
  } else {
    return toInsert;
  } // if - else
} // listInsertBySort

export function listSortByIndex<T>(fromIndex: number, toIndex: number, list: T[]): T[] {
  if (list && list.length) {
    const element = list[fromIndex];
    let newList = listRemoveByIndex(fromIndex, list);
    newList = listInsert(element, toIndex, newList);
    return newList;
  } else {
    return list;
  } // if - else
} // listSortByIndex

export function listSortByElement<T>(movingElement: T, toElement: T, list: T[]): T[] {
  if (list) {
    const fromIndex = list.indexOf(movingElement);
    const toIndex = list.indexOf(toElement);
    return listSortByIndex(fromIndex, toIndex, list);
  } else {
    return list;
  } // if - else
} // listSortByElement
