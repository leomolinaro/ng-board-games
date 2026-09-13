import {
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiCheckbox,
  TuiInput,
  TuiLabel,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiForm } from '@taiga-ui/layout';
import type { BgUser } from '../../authentication';
import { BgAuthService } from '../../authentication';
import type {
  BgProtoPlayer,
  BgProtoPlayerType,
} from '../bg-proto-game-service';

interface PlayerType {
  type: BgProtoPlayerType;
  icon: string;
  label: string;
}

@Component({
  selector: 'bg-player-form',
  imports: [
    FormsModule,
    TuiButton,
    TuiForm,
    TuiTextfield,
    TuiInput,
    TuiLabel,
    TuiCheckbox,
  ],
  template: `
    <div tuiForm>
      @let type = playerType();
      <button
        tuiIconButton
        [disabled]="!(player().type === 'open' || isOwner() || isPlayer())"
        [iconStart]="type.icon"
        (click)="setNextPlayerType()"
      ></button>
      <span>{{ type.label }}</span>
      @if (player().type === 'user' || player().type === 'ai') {
        <tui-textfield>
          <label tuiLabel>Player name</label>
          @let editableName = editablePlayerName();
          <input
            name="name"
            tuiInput
            [required]="editableName"
            [disabled]="!editableName"
            autocomplete="off"
            [ngModel]="player().name"
            (ngModelChange)="changeName($event)"
          />
        </tui-textfield>
        @if (onlineGame() && player().type === 'user') {
          <label tuiLabel>
            <input
              tuiCheckbox
              type="checkbox"
              [disabled]="!isPlayer()"
              [ngModel]="player().ready"
              (ngModelChange)="changeReady($event)"
            />
            Ready
          </label>
        } @else {
          <span></span>
        }
      } @else {
        <span></span>
        <span></span>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      [tuiForm] {
        display: contents;

        tui-textfield {
          min-width: 0;
        }

        --tui-background-accent-1: var(--bg-player-color);
        --tui-background-accent-1-hover: color-mix(
          in srgb,
          var(--bg-player-color),
          white 15%
        );

        // tui-textfield {
        //   flex: 1;
        // }
      }
    `,
  ],
})
export class BgPlayerForm {
  private authService = inject(BgAuthService);

  readonly onlineGame = input.required<boolean>();
  readonly player = model.required<BgProtoPlayer>();
  readonly isOwner = input.required({ transform: booleanAttribute });
  readonly isPlayer = input.required({ transform: booleanAttribute });

  protected playerType = computed<PlayerType>(() => {
    const type = this.player().type;
    switch (type) {
      case 'closed':
        return { type, icon: 'circle-slash', label: 'Closed' };
      case 'user':
        return {
          type,
          icon: 'circle-user-round',
          label: this.isPlayer() ? 'Me' : 'Player',
        };
      case 'ai':
        return { type, icon: 'bot', label: 'Bot' };
      case 'open':
        return { type, icon: 'circle-question-mark', label: 'Open' };
    }
  });

  protected editablePlayerName = computed(() => {
    const player = this.player();
    return (player.type === 'ai' && this.isOwner()) || this.isPlayer();
  });

  protected playerNameActive: (player: BgProtoPlayer) => boolean = (player) => {
    return (player.type === 'ai' && this.isOwner()) || this.isPlayer();
  };

  protected changeName(name: string): void {
    this.player.set({ ...this.player(), name });
  }

  protected changeReady(ready: boolean): void {
    this.player.set({ ...this.player(), ready });
  }

  protected setNextPlayerType(): void {
    const controllerPatch: { controller?: BgUser | null } = {};
    const namePatch: { name?: string } = {};
    const readyPatch: { ready?: boolean } = {};
    const nextPlayerType = this.getNextPlayerType(this.player().type);
    switch (nextPlayerType) {
      case 'user': {
        controllerPatch.controller = this.authService.getUser();
        namePatch.name = this.authService.getUser().displayName;
        if (!this.onlineGame()) {
          readyPatch.ready = true;
        }
        break;
      }
      case 'closed': {
        controllerPatch.controller = null;
        namePatch.name = '';
        readyPatch.ready = false;
        break;
      }
      case 'open': {
        controllerPatch.controller = null;
        namePatch.name = '';
        readyPatch.ready = false;
        break;
      }
      case 'ai': {
        controllerPatch.controller = null;
        namePatch.name = 'AI';
        readyPatch.ready = true;
        break;
      }
    }
    this.player.set({
      ...this.player(),
      type: nextPlayerType,
      ...controllerPatch,
      ...namePatch,
      ...readyPatch,
    });
  }

  private getNextPlayerType(currentType: BgProtoPlayerType): BgProtoPlayerType {
    if (this.isOwner()) {
      switch (currentType) {
        case 'closed':
          return 'user';
        case 'user':
          return this.onlineGame() ? 'open' : 'ai';
        case 'open':
          return 'ai';
        case 'ai':
          return 'closed';
      }
    } else {
      switch (currentType) {
        case 'closed':
          return 'closed';
        case 'user':
          return 'open';
        case 'open':
          return 'user';
        case 'ai':
          return 'ai';
      }
    }
  }
}
