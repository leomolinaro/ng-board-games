import { ChangeDetectionStrategy, Component, inject, input } from "@angular/core";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrFront, WotrFrontId } from "../front/wotr-front.models";
import { WotrActionDie } from "./wotr-action-die.models";

@Component ({
  selector: "wotr-action-dice",
  standalone: true,
  imports: [BgTransformPipe],
  template: `
    @for (front of fronts (); track front.id) {
      <div class="wotr-action-dice">
        @for (actionDie of front.actionDice; track $index) {
          <img [src]="actionDie | bgTransform:actionDieImage:front.id"/>
        }
        @for (actionToken of front.actionTokens; track $index) {
          <img [src]="actionToken | bgTransform:actionTokenImage:front.id"/>
        }
      </div>
    }
  `,
  styles: [`
    .wotr-action-dice {
      display: flex;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrActionDiceComponent {

  protected assets = inject (WotrAssetsService);

  fronts = input.required<WotrFront[]> ();

  protected actionDieImage: BgTransformFn<WotrActionDie, string, WotrFrontId> = (actionDie, frontId) => this.assets.getActionDieImage (actionDie, frontId);
  protected actionTokenImage: BgTransformFn<WotrActionToken, string, WotrFrontId> = (actionToken, frontId) => this.assets.getActionTokenImage (actionToken, frontId);

}
