import { NgClass } from "@angular/common";
import { Component, input } from "@angular/core";
import { BgTransformPipe } from "@leobg/commons/utils";
import { WotrPlayer } from "./wotr-player.models";

@Component ({
  selector: "wotr-player-badge",
  standalone: true,
  imports: [BgTransformPipe, NgClass],
  template: `
    <div class="badge"
      [ngClass]="{
        'free-peoples': player ()?.id === 'free-peoples',
        'shadow': player ()?.id === 'shadow'
      }">
      @if (player (); as c) { {{ c.name }} } @else { - }
    </div>
  `,
  styles: [`
    @import "wotr-variables";
    .badge {
      border-radius: 50%;
      width: 20px;
      height: 20px;
      padding: 4px;
      text-align: center;
      background: #fff;
      color: white;
      // line-height: 1;

      &.free-peoples {
        background: $blue;
      }
      &.shadow {
        background: $red;
      }
    }
  `]
})
export class WotrPlayerBadgeComponent {

  player = input.required<WotrPlayer | null> ();

}
