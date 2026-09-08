export function getRandomInteger(minIncluded: number, maxExcluded: number) {
  return Math.floor(Math.random() * (maxExcluded - minIncluded)) + minIncluded;
}

export function getRandomFloat(min: number, max: number) {
  const integer = getRandomInteger(min, max);
  const decimal = getRandomInteger(0, 100);
  return integer + decimal / 100;
}

export function getRandomBoolean() {
  return Math.random() < 0.5;
}

export function getRandomElement<T>(array: T[]): T {
  return array[getRandomInteger(0, array.length)];
}

export function getRandomElements<T>(
  min: number,
  max: number,
  array: T[],
): T[] {
  const length = getRandomInteger(min, max);
  const toReturn: T[] = [];
  const remainings = [...array];
  let i = 0;
  while (i < length && remainings.length > 0) {
    const index = getRandomInteger(0, remainings.length);
    const choosen = remainings.splice(index, 1)[0];
    toReturn.push(choosen);
    i++;
  }
  return toReturn;
}

export function getRandomArrayLength<T>(
  min: number,
  max: number,
  pusher: (index: number) => T,
): T[] {
  const length = getRandomInteger(min, max);
  const array: T[] = [];
  for (let i = 0; i < length; i++) {
    array.push(pusher(i));
  }
  return array;
}

export function getRandomDraws<T>(n: number, pool: T[]) {
  const toReturn: T[] = [];
  pool = [...pool];
  for (let i = 0; i < n; i++) {
    const index = getRandomInteger(0, pool.length);
    const draw = pool.splice(index, 1)[0];
    toReturn.push(draw);
  }
  return toReturn;
}

export class BgSimulatedAnnealing<S> {
  constructor(
    private energy: (s: S) => number,
    private neighbour: (s: S) => S,
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
      }
    }
    return s;
  }

  private probability(e: number, eNew: number, t: number) {
    if (eNew === e) {
      return 0;
    }
    return eNew > e ? Math.exp((e - eNew) / t) : 1;
  }
}
