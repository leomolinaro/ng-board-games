export interface BgReduxDevtoolsInstance {
  init (initialState: unknown): void;
  send (actionName: string, state: unknown): void;
} // BgReduxDevtoolsInstance

export class BgReduxDevtools {

  constructor (
  ) {
    this.reduxDevtoolsExtension = window ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ : null;
  } // constructor

  private reduxDevtoolsExtension: { connect: (config: { name: string }) => BgReduxDevtoolsInstance };

  connect (name: string): BgReduxDevtoolsInstance | null {
    if (this.reduxDevtoolsExtension) {
      return this.reduxDevtoolsExtension.connect ({ name: name });
    } else {
      return null;
    } // if - else
  } // connect

} // BgReduxDevtools

export const bgReduxDevtools = new BgReduxDevtools ();
