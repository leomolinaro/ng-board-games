import { NgClass } from "@angular/common";
import { Component, input } from "@angular/core";
import { WotrPlayerInfo } from "./wotr-player-info.models";

@Component ({
  selector: "wotr-player-badge",
  standalone: true,
  imports: [
    NgClass
  ],
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
      background: #fff;
      color: white;

      line-height: 1.5;
      display: flex;
      align-items: center;
      justify-content: center;

      // text-align: center;

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

  player = input.required<WotrPlayerInfo | null> ();

}
