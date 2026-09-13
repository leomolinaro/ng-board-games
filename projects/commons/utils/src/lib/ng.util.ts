import type { ProviderToken } from '@angular/core';
import { Injector, inject, runInInjectionContext } from '@angular/core';

export function lazyInject<T extends object>(token: ProviderToken<T>): T {
  const injector = inject(Injector);

  let instance: T | undefined;

  const getInstance: () => T = () => {
    instance ??= runInInjectionContext(injector, () => inject(token));
    return instance;
  };

  return new Proxy({} as T, {
    get(_, prop): unknown {
      return Reflect.get(getInstance(), prop);
    },
    set(_, prop, value): boolean {
      return Reflect.set(getInstance(), prop, value);
    },
    has(_, prop): boolean {
      return prop in getInstance();
    },
    ownKeys(): (string | symbol)[] {
      return Reflect.ownKeys(getInstance());
    },
    getOwnPropertyDescriptor(_, prop): PropertyDescriptor | undefined {
      return Object.getOwnPropertyDescriptor(getInstance(), prop);
    },
  });
}
