import { Component, output } from "@angular/core";
import { MatRipple } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "wotr-replay-buttons",
  imports: [MatIcon, MatRipple],
  template: `
    <div>
      <!-- <mat-icon
        matRipple
        fontIcon="keyboard_arrow_left"
        (click)="replayNext.emit(-1)"></mat-icon> -->
      <mat-icon
        matRipple
        fontIcon="edit"
        style="font-size: 120%; text-align: center; vertical-align: text-bottom"
        (click)="edit.emit()"></mat-icon>
      <mat-icon
        matRipple
        fontIcon="keyboard_arrow_right"
        (click)="replayNext.emit(1)"></mat-icon>
      <mat-icon
        matRipple
        fontIcon="keyboard_double_arrow_right"
        (click)="replayNext.emit(10)"></mat-icon>
      <mat-icon
        matRipple
        fontIcon="last_page"
        (click)="replayLast.emit()"></mat-icon>
    </div>
  `,
  styles: `
    mat-icon {
      cursor: pointer;
    }
  `
})
export class WotrReplayButton {
  replayNext = output<number>();
  replayLast = output<void>();
  edit = output<void>();
}
