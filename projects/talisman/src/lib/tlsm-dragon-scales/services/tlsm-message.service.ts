import { Component, inject, Injectable } from '@angular/core';
import type { TuiDialogContext} from '@taiga-ui/core';
import { TuiButton, TuiDialogService } from '@taiga-ui/core';
import { injectContext, PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import { firstValueFrom } from 'rxjs';

interface DialogData {
  tokenSource: string;
  confirm?: string;
}

@Injectable({
  providedIn: 'root',
})
export class TlsmMessageService {
  private dialogs = inject(TuiDialogService);

  public alert(message: string, tokenSource: string): Promise<void> {
    const dialog$ = this.dialogs.open(
      new PolymorpheusComponent(TlsmMessageDialog),
      {
        label: message,
        size: 's',
        data: { tokenSource: tokenSource } satisfies DialogData,
      },
    );
    return firstValueFrom(dialog$);
  }

  public confirm(
    message: string,
    tokenSource: string,
    confirm: string,
  ): Promise<boolean> {
    const dialog$ = this.dialogs.open<boolean>(
      new PolymorpheusComponent(TlsmMessageDialog),
      {
        label: message,
        size: 's',
        data: {
          tokenSource: tokenSource,
          confirm: confirm,
        } satisfies DialogData,
      },
    );
    return firstValueFrom(dialog$);
  }
}

@Component({
  selector: 'tlsm-message-dialog',
  imports: [TuiButton],
  template: `
    <img
      [src]="tokenSource"
      alt="token"
      style="width: 100px"
    />
    <p>{{ confirm }}</p>
    <footer>
      @if (confirm) {
        <button
          tuiButton
          (click)="context.completeWith(false)"
        >
          No
        </button>
      }
      @if (confirm) {
        <button
          tuiButton
          (click)="context.completeWith(true)"
        >
          Yes
        </button>
      }
      @if (!confirm) {
        <button
          tuiButton
          (click)="context.completeWith(true)"
        >
          Ok
        </button>
      }
    </footer>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    footer {
      display: flex;
      width: 100%;
      justify-content: flex-end;
      gap: 8px;
    }
  `,
})
export class TlsmMessageDialog {
  context = injectContext<TuiDialogContext<boolean, DialogData>>();

  tokenSource: string;
  confirm: string | undefined;

  constructor() {
    const data = this.context.data;

    this.tokenSource = data.tokenSource;
    this.confirm = data.confirm;
  }
}
