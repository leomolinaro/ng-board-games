import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import {
  TuiButton,
  TuiDialogContext,
  TuiInput,
  TuiLabel,
} from '@taiga-ui/core';
import { TuiRadioList } from '@taiga-ui/kit';
import { TuiForm } from '@taiga-ui/layout';
import { injectContext } from '@taiga-ui/polymorpheus';
import { NewGame } from '../bg-proto-game-service';

@Component({
  selector: 'bg-home-archeo-game-form',
  imports: [
    TuiInput,
    TuiLabel,
    TuiRadioList,
    FormsModule,
    TuiForm,
    TuiAutoFocus,
    TuiButton,
  ],
  template: `
    <div tuiForm>
      <tui-textfield>
        <label tuiLabel>Game name</label>
        <input
          tuiAutoFocus
          name="name"
          tuiInput
          required
          autocomplete="off"
          [ngModel]="game().name"
          (ngModelChange)="nameChange($event)"
        />
      </tui-textfield>
      <tui-radio-list
        name="type"
        [items]="['local', 'online']"
        [itemContent]="typeGameStringify"
        [ngModel]="game().online ? 'online' : 'local'"
        (ngModelChange)="onlineChange($event === 'online')"
      >
      </tui-radio-list>
      <footer>
        <button
          appearance="secondary"
          tuiButton
          (click)="context.completeWith(null)"
        >
          Cancel
        </button>
        <button
          tuiButton
          [disabled]="!gameValid()"
          (click)="context.completeWith(game())"
        >
          Create game
        </button>
      </footer>
    </div>
  `,
})
export class BgNewGameDialog {
  protected readonly context =
    injectContext<TuiDialogContext<NewGame | null>>();

  protected game = signal<NewGame>({ name: '', online: false });

  protected typeGameStringify = ({ $implicit }: { $implicit: string }) =>
    $implicit === 'online' ? 'Online' : 'Local';
  protected gameValid = () => this.game().name.trim().length > 0;

  protected nameChange(name: string) {
    this.game.update((game) => ({ ...game, name }));
  }

  protected onlineChange(online: boolean) {
    this.game.update((game) => ({ ...game, online }));
  }
}
