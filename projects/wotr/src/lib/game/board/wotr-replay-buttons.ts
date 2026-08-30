import { Component, model, output } from "@angular/core";
import { TuiButton, tuiButtonOptionsProvider } from "@taiga-ui/core";

@Component({
  selector: "wotr-replay-buttons",
  imports: [TuiButton],
  providers: [tuiButtonOptionsProvider({ size: "xs", appearance: "floating" })],
  template: `
    <header>
      <button
        tuiIconButton
        style="margin-right: 3px"
        iconStart="pencil"
        inline
        (click)="edit.emit()"></button>
      @if (replayMode()) {
        <button
          tuiIconButton
          iconStart="chevron-right"
          (click)="replayNext.emit(1)"></button>
        <button
          tuiIconButton
          iconStart="chevrons-right"
          (click)="replayNext.emit(10)"></button>
        <button
          tuiIconButton
          iconStart="arrow-right-to-line"
          (click)="replayLast.emit()"></button>
      } @else {
        <button
          tuiButton
          (click)="replayMode.set(true)">
          Replay
        </button>
      }
    </header>
  `
})
export class WotrReplayButtons {
  replayMode = model();

  replayNext = output<number>();
  replayLast = output<void>();
  edit = output<void>();
}
