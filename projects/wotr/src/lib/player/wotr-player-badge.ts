import { Component, input } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front-models";

@Component({
  selector: "wotr-player-badge",
  template: `
    <div
      class="badge"
      [class]="{
        'free-peoples': playerId() === 'free-peoples',
        'shadow': playerId() === 'shadow'
      }">
      <!-- @if (player (); as c) { {{ c.name }} } @else { - } -->
      @if (playerId(); as p) {
        {{ p === "free-peoples" ? "F" : "S" }}
      } @else {
        -
      }
    </div>
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;
      .badge {
        border-radius: 50%;
        width: 20px;
        height: 20px;
        padding: 4px;
        background: #fff;
        color: white;

        line-height: 1.5;
        display: flex;
        align-items: center;
        justify-content: center;

        // text-align: center;

        &.free-peoples {
          background: wotr.$blue;
        }
        &.shadow {
          background: wotr.$red;
        }
      }
    `
  ]
})
export class WotrPlayerBadge {
  playerId = input.required<WotrFrontId | null>();
}
