import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type {
  TuiDialogContext} from '@taiga-ui/core';
import {
  TuiButton,
  TuiInput,
  TuiLabel,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiForm } from '@taiga-ui/layout';
import { injectContext } from '@taiga-ui/polymorpheus';

export interface Settings {
  players: string[];
  scalesPerCrown: number;
}

@Component({
  selector: 'tlsm-settings-dialog',
  standalone: true,
  imports: [FormsModule, TuiButton, TuiForm, TuiInput, TuiLabel, TuiTextfield],
  template: `
    <div tuiForm>
      <button
        style="margin-left: auto"
        tuiButton
        type="button"
        iconStart="plus"
        appearance="outline"
        size="m"
        (click)="addPlayer()"
      >
        Add player
      </button>

      @for (player of settings().players; track $index; let i = $index) {
        <div>
          <tui-textfield [tuiTextfieldCleaner]="false">
            <label tuiLabel>Player {{ i + 1 }}</label>
            <input
              tuiInput
              [ngModel]="settings().players[i]"
              (ngModelChange)="updatePlayer(i, $event)"
              autocomplete="off"
            />
            <button
              tuiButton
              type="button"
              appearance="secondary-destructive"
              size="s"
              (click.prevent)="removePlayer(i)"
            >
              Delete
            </button>
          </tui-textfield>
        </div>
      }

      <hr style="width: 100%" />

      <tui-textfield [tuiTextfieldCleaner]="false">
        <label tuiLabel>Scales per crown</label>
        <input
          tuiInput
          type="number"
          min="1"
          max="100"
          [ngModel]="settings().scalesPerCrown"
          (ngModelChange)="updateScalesPerCrown($event)"
        />
      </tui-textfield>

      <footer>
        <button
          tuiButton
          type="button"
          appearance="secondary"
          (click)="cancel()"
        >
          Cancel
        </button>
        <button
          tuiButton
          type="button"
          appearance="primary"
          (click)="confirm()"
        >
          Confirm
        </button>
      </footer>
    </div>
  `,
})
export class TlsmSettingsDialog {
  protected readonly context =
    injectContext<TuiDialogContext<Settings | null, Settings>>();
  protected readonly settings = signal<Settings>(
    this.context.data ?? {
      players: [],
      scalesPerCrown: 3,
    },
  );

  protected addPlayer(): void {
    this.settings.update((current) => ({
      ...current,
      players: [...current.players, ''],
    }));
  }

  protected removePlayer(index: number): void {
    this.settings.update((current) => ({
      ...current,
      players: current.players.filter((_, i) => i !== index),
    }));
  }

  protected updatePlayer(index: number, name: string): void {
    this.settings.update((current) => {
      const players = [...current.players];
      players[index] = name;
      return { ...current, players };
    });
  }

  protected updateScalesPerCrown(value: number | string): void {
    const nextValue = Number(value);

    this.settings.update((current) => ({
      ...current,
      scalesPerCrown: Number.isFinite(nextValue) ? Math.max(1, nextValue) : 1,
    }));
  }

  protected cancel(): void {
    this.context.completeWith(null);
  }

  protected confirm(): void {
    const players = this.settings()
      .players.map((player) => player.trim())
      .filter(Boolean);

    this.context.completeWith({
      players: players.length > 0 ? players : ['Player 1'],
      scalesPerCrown: Math.max(1, this.settings().scalesPerCrown),
    });
  }
}
