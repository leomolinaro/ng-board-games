import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, input, output } from "@angular/core";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrFront, WotrFrontId } from "../front/wotr-front.models";
import { WotrActionDie, WotrActionDieOrToken, WotrActionToken } from "./wotr-action.models";

@Component({
  selector: "wotr-action-dice",
  imports: [BgTransformPipe, NgClass],
  template: `
    @for (front of fronts (); track front.id) {
    <div
      class="wotr-action-dice"
      [ngClass]="{
        selectable: validActionFront() === front.id,
        disabled: validActionFront() && validActionFront() !== front.id
      }">
      @for (actionDie of front.actionDice; track $index) {
      <img
        [src]="actionDie | bgTransform: actionDieImage:front.id"
        (click)="onActionDieClick(actionDie, front.id)" />
      } @for (actionToken of front.actionTokens; track $index) {
      <img
        [src]="actionToken | bgTransform: actionTokenImage:front.id"
        (click)="onActionTokenClick(actionToken, front.id)" />
      }
    </div>
    }
  `,
  styles: [
    `
      .wotr-action-dice {
        display: flex;
        &.selectable > * {
          cursor: pointer;
        }
        &.disabled > * {
          opacity: 0.5;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrActionDiceComponent {
  protected assets = inject(WotrAssetsService);

  fronts = input.required<WotrFront[]>();
  validActionFront = input.required<WotrFrontId | null>();
  actionSelect = output<WotrActionDieOrToken>();

  protected actionDieImage: BgTransformFn<WotrActionDie, string, WotrFrontId> = (actionDie, frontId) =>
    this.assets.getActionDieImage(actionDie, frontId);
  protected actionTokenImage: BgTransformFn<WotrActionToken, string, WotrFrontId> = (actionToken, frontId) =>
    this.assets.getActionTokenImage(actionToken, frontId);

  onActionDieClick(actionDie: WotrActionDie, frontId: WotrFrontId) {
    if (this.validActionFront() === frontId) {
      this.actionSelect.emit(actionDie);
    }
  }

  onActionTokenClick(actionToken: WotrActionToken, frontId: WotrFrontId) {
    if (this.validActionFront() === frontId) {
      this.actionSelect.emit(actionToken);
    }
  }
}
