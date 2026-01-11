import { Component, model, output } from "@angular/core";
import { MatRipple } from "@angular/material/core";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: "wotr-replay-buttons",
  imports: [MatIcon, MatRipple],
  template: `
    <div class="toolbar">
      <!-- <mat-icon
        matRipple
        fontIcon="keyboard_arrow_left"
        (click)="replayNext.emit(-1)"></mat-icon> -->
      <!-- style="font-size: 120%;" -->
      <mat-icon
        style="margin-right: 3px"
        matRipple
        fontIcon="edit"
        inline
        (click)="edit.emit()"></mat-icon>
      @if (replayMode()) {
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
      } @else {
        <button (click)="replayMode.set(true)">Replay</button>
      }
    </div>
  `,
  styles: `
    .toolbar {
      display: flex;
      align-items: center;
    }
    button {
      background: none;
      border: none;
      color: white;
    }
    mat-icon,
    button {
      cursor: pointer;
      &:hover {
        color: #aaa;
      }
    }
  `
})
export class WotrReplayButton {
  replayMode = model();

  replayNext = output<number>();
  replayLast = output<void>();
  edit = output<void>();
}
