import { Component, EventEmitter, Output } from "@angular/core";
import { MatRipple } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "wotr-replay-buttons",
  imports: [MatIcon, MatRipple],
  template: `
    <div>
      <mat-icon
        matRipple
        fontIcon="keyboard_arrow_right"
        (click)="replayNext.next(1)"></mat-icon>
      <mat-icon
        matRipple
        fontIcon="keyboard_double_arrow_right"
        (click)="replayNext.next(10)"></mat-icon>
      <mat-icon
        matRipple
        fontIcon="last_page"
        (click)="replayLast.next()"></mat-icon>
    </div>
  `,
  styles: `
    mat-icon {
      cursor: pointer;
    }
  `
})
export class WotrReplayButton {
  @Output() replayNext = new EventEmitter<number>();
  @Output() replayLast = new EventEmitter<void>();
}
