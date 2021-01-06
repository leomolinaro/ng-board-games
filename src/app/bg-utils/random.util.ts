export function getRandomInteger (min: number, max: number) {
  return Math.floor (Math.random () * (max - min)) + min;
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
  return array[Math.floor (Math.random () * array.length)];
} // getRandomElement

export function getRandomArrayLength<T> (min: number, max: number, pusher: (index: number) => T): T[] {
  const length = getRandomInteger (min, max);
  const array: T[] = [];
  for (let i = 0; i < length; i++) {
    array.push (pusher (i));
  } // for
  return array;
} // getRandomArrayLength
