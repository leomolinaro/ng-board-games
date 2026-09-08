import type { ProviderToken } from '@angular/core';
import { Injector, inject, runInInjectionContext } from '@angular/core';

export function lazyInject<T extends object>(token: ProviderToken<T>): T {
  const injector = inject(Injector);

  let instance: T | undefined;

  const getInstance = () => {
    instance ??= runInInjectionContext(injector, () => inject(token));
    return instance;
  };

  return new Proxy({} as T, {
    get(_, prop) {
      return Reflect.get(getInstance(), prop);
    },
    set(_, prop, value) {
      return Reflect.set(getInstance(), prop, value);
    },
    has(_, prop) {
      return prop in getInstance();
    },
    ownKeys() {
      return Reflect.ownKeys(getInstance());
    },
    getOwnPropertyDescriptor(_, prop) {
      return Object.getOwnPropertyDescriptor(getInstance(), prop);
    },
  });
}
