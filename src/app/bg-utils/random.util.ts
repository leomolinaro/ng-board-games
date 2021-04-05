export function getRandomInteger (minIncluded: number, maxExcluded: number) {
  return Math.floor (Math.random () * (maxExcluded - minIncluded)) + minIncluded;
} // getRandomInteger

export function getRandomFloat (min: number, max: number) {
  const integer = getRandomInteger (min, max);
  const decimal = getRandomInteger (0, 100);
  return integer + decimal / 100.0;
} // getRandomFloat

export function getRandomBoolean () {
  return Math.random () < 0.5;
} // getRandomBoolean

export function getRandomElement<T> (array: T[]): T {
  return array[getRandomInteger (0, array.length)];
} // getRandomElement

export function getRandomArrayLength<T> (min: number, max: number, pusher: (index: number) => T): T[] {
  const length = getRandomInteger (min, max);
  const array: T[] = [];
  for (let i = 0; i < length; i++) {
    array.push (pusher (i));
  } // for
  return array;
} // getRandomArrayLength

export function getRandomDraws<T> (n: number, pool: T[]) {
  const toReturn: T[] = [];
  pool = [...pool];
  for (let i = 0; i < n; i++) {
    const index = getRandomInteger (0, pool.length);
    const draw = pool.splice (index, 1)[0];
    toReturn.push (draw);
  } // for
  return toReturn;
} // getRandomDraws
