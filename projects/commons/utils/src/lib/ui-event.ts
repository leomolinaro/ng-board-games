import { firstValueFrom, Subject } from 'rxjs';

export class UiEvent<E> {
  private subject: Subject<E> | undefined = undefined;

  emit(event: E): void {
    if (!this.subject) {
      return;
    }
    this.subject.next(event);
  }

  get(): Promise<E> {
    if (this.subject) {
      this.subject.complete();
    }
    this.subject = new Subject<E>();
    return firstValueFrom(this.subject);
  }
}

export function uiEvent<E>(): UiEvent<E> {
  return new UiEvent<E>();
}
