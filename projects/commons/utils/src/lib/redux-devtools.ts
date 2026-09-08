export interface BgReduxDevtoolsInstance {
  init(initialState: unknown): void;
  send(actionName: string, state: unknown): void;
}

export class BgReduxDevtools {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.reduxDevtoolsExtension = window
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (window as any).__REDUX_DEVTOOLS_EXTENSION__
      : null;
  }

  private reduxDevtoolsExtension: {
    connect: (config: { name: string }) => BgReduxDevtoolsInstance;
  };

  connect(name: string): BgReduxDevtoolsInstance | null {
    if (this.reduxDevtoolsExtension) {
      return this.reduxDevtoolsExtension.connect({ name: name });
    } else {
      return null;
    }
  }
}

export const bgReduxDevtools = new BgReduxDevtools();
