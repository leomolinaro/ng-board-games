import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BgTransformFn, BgTransformPipe } from '@leobg/commons/utils';
import { TuiCheckbox, TuiLabel } from '@taiga-ui/core';
import { WotrAssetsStore } from '../assets/wotr-assets-store';
import {
  ACTION_TOKEN_OPTIONS,
  getActionTokenName,
  WotrActionTokenOption,
} from './wotr-action-die-models';

@Component({
  selector: 'wotr-action-token-options-form',
  imports: [BgTransformPipe, FormsModule, TuiCheckbox, TuiLabel],
  template: `
    @for (option of options; track option.front + '_' + option.token) {
      <label tuiLabel>
        <input
          tuiCheckbox
          type="checkbox"
          [disabled]="readOnly() || false"
          [ngModel]="isSelected(option)"
          (ngModelChange)="toggleToken(option, $event)"
        />
        <img
          [src]="option | bgTransform: tokenImage"
          alt=""
        />
        <span>{{ option | bgTransform: tokenName }}</span>
      </label>
    }
  `,
  styles: `
    [tuiLabel] {
      align-items: center;
      img {
        padding: 0.5rem;
      }
    }
  `,
})
export class WotrActionTokenOptionsForm {
  private assets = inject(WotrAssetsStore);
  protected options = ACTION_TOKEN_OPTIONS;

  tokens = model.required<WotrActionTokenOption[]>();
  readOnly = model.required<boolean>();

  protected compareTokens = (
    a: WotrActionTokenOption,
    b: WotrActionTokenOption,
  ) => a.token === b.token && a.front === b.front;

  protected isSelected(option: WotrActionTokenOption): boolean {
    return this.tokens().some((token) => this.compareTokens(token, option));
  }

  protected toggleToken(option: WotrActionTokenOption, checked: boolean): void {
    const next = checked
      ? this.tokens().some((token) => this.compareTokens(token, option))
        ? this.tokens()
        : [...this.tokens(), option]
      : this.tokens().filter((token) => !this.compareTokens(token, option));

    this.tokens.set(next);
  }

  protected tokenImage: BgTransformFn<WotrActionTokenOption, string> = (
    token,
  ) => this.assets.actionTokenImage(token.token, token.front);

  protected tokenName: BgTransformFn<WotrActionTokenOption, string> = (token) =>
    getActionTokenName(token.token, token.front);
}
