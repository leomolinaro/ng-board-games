import { firstValueFrom, Subject } from "rxjs";

export class UiEvent<E> {
  
  private subject = new Subject<E> ();
  
  emit (event: E): void { this.subject.next (event); }
  get (): Promise<E> { return firstValueFrom (this.subject); }
}

export function uiEvent<E> () { return new UiEvent<E> (); }
