import type { Injector, Type } from '@angular/core';
import { inject, Injectable } from '@angular/core';
import type { TuiDialogContext, TuiDialogOptions } from '@taiga-ui/core';
import { TuiDialogService } from '@taiga-ui/core';
import { injectContext, PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { firstValueFrom } from 'rxjs';

export class DialogContext<TData, TResult> {
  constructor(
    private readonly tuiContext: TuiDialogContext<TResult | null, TData>,
  ) {}

  complete(result?: TResult | null) {
    this.tuiContext.completeWith(result ?? null);
  }

  get data(): TData extends void ? undefined : TData {
    return this.tuiContext.data;
  }
}

export function injectDialogContext<
  TData = void,
  TResult = void,
>(): DialogContext<TData, TResult> {
  const tuiContext = injectContext<TuiDialogContext<TResult | null, TData>>();
  return new DialogContext<TData, TResult>(tuiContext);
}

export interface DialogComponent<TData, TResult> {
  readonly context: DialogContext<TData, TResult>;
}

export type DialogOptions<TData> = Partial<TuiDialogOptions<TData>> & {
  injector?: Injector;
} & (TData extends void
    ? object
    : {
        data: TData;
      });

@Injectable({
  providedIn: 'root',
})
export class BgDialogService {
  private dialogs = inject(TuiDialogService);

  open<TData, TResult>(
    component: Type<DialogComponent<TData, TResult>>,
    options: DialogOptions<TData>,
  ): Promise<TResult | null> {
    const { injector, ...dialogOptions } = options;
    const resultObs = this.dialogs.open<TResult | null>(
      new PolymorpheusComponent(component, injector),
      dialogOptions,
    );
    return firstValueFrom(resultObs, { defaultValue: null });
  }
}
