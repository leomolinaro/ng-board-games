export function getRandomInteger(minIncluded: number, maxExcluded: number) {
  return Math.floor(Math.random() * (maxExcluded - minIncluded)) + minIncluded;
} // getRandomInteger

export function getRandomFloat(min: number, max: number) {
  const integer = getRandomInteger(min, max);
  const decimal = getRandomInteger(0, 100);
  return integer + decimal / 100.0;
} // getRandomFloat

export function getRandomBoolean() {
  return Math.random() < 0.5;
} // getRandomBoolean

export function getRandomElement<T>(array: T[]): T {
  return array[getRandomInteger(0, array.length)];
} // getRandomElement

export function getRandomElements<T>(
  min: number,
  max: number,
  array: T[]
): T[] {
  const length = getRandomInteger(min, max);
  const toReturn: T[] = [];
  const remainings = [...array];
  let i = 0;
  while (i < length && remainings.length) {
    const index = getRandomInteger(0, remainings.length);
    const choosen = remainings.splice(index, 1)[0];
    toReturn.push(choosen);
    i++;
  } // while
  return toReturn;
} // getRandomElement

export function getRandomArrayLength<T>(
  min: number,
  max: number,
  pusher: (index: number) => T
): T[] {
  const length = getRandomInteger(min, max);
  const array: T[] = [];
  for (let i = 0; i < length; i++) {
    array.push(pusher(i));
  } // for
  return array;
} // getRandomArrayLength

export function getRandomDraws<T>(n: number, pool: T[]) {
  const toReturn: T[] = [];
  pool = [...pool];
  for (let i = 0; i < n; i++) {
    const index = getRandomInteger(0, pool.length);
    const draw = pool.splice(index, 1)[0];
    toReturn.push(draw);
  } // for
  return toReturn;
} // getRandomDraws

export class BgSimulatedAnnealing<S> {
  constructor(
    private energy: (s: S) => number,
    private neighbour: (s: S) => S
  ) {}

  run(s0: S, t0: number, kMax: number): S {
    let s = s0;
    let e = this.energy(s);
    for (let k = 0; k < kMax; k++) {
      const t = t0 * (1 - (k + 1) / kMax);
      const sNew = this.neighbour(s);
      const eNew = this.energy(sNew);
      const probability = this.probability(e, eNew, t);
      if (probability > getRandomFloat(0, 1)) {
        s = sNew;
        e = eNew;
      } // if
    } // for
    return s;
  } // run

  private probability(e: number, eNew: number, t: number) {
    if (eNew === e) {
      return 0;
    }
    if (eNew > e) {
      return Math.exp((e - eNew) / t);
    } else {
      return 1;
    } // if - else
  } // probability
} // BgSimulatedAnnealing
