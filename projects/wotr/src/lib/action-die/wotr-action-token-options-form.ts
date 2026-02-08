import { Component, inject, model } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatListModule } from "@angular/material/list";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import {
  ACTION_TOKEN_OPTIONS,
  getActionTokenName,
  WotrActionTokenOption
} from "./wotr-action-die-models";

@Component({
  selector: "wotr-action-token-options-form",
  imports: [MatListModule, BgTransformPipe, FormsModule],
  template: `
    <mat-selection-list
      multiple
      [disabled]="readOnly()"
      [(ngModel)]="tokens"
      [compareWith]="compareTokens">
      @for (option of options; track option.front + "_" + option.token) {
        <mat-list-option
          [value]="option"
          togglePosition="after">
          <img
            matListItemAvatar
            [src]="option | bgTransform: tokenImage" />
          <span matListItemTitle>{{ option | bgTransform: tokenName }}</span>
        </mat-list-option>
      }
    </mat-selection-list>
  `
})
export class WotrActionTokenOptionsForm {
  private assets = inject(WotrAssetsStore);
  protected options = ACTION_TOKEN_OPTIONS;

  tokens = model.required<WotrActionTokenOption[]>();
  readOnly = model.required<boolean>();

  protected compareTokens = (a: WotrActionTokenOption, b: WotrActionTokenOption) =>
    a.token === b.token && a.front === b.front;

  protected tokenImage: BgTransformFn<WotrActionTokenOption, string> = token =>
    this.assets.actionTokenImage(token.token, token.front);

  protected tokenName: BgTransformFn<WotrActionTokenOption, string> = token =>
    getActionTokenName(token.token, token.front);
}
