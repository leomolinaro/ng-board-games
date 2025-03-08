import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
} from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BritLog } from "../brit-game-state.models";

@Component ({
  selector: "brit-logs",
  template: "<brit-log *ngFor=\"let log of logs\" [log]=\"log\"></brit-log>",
  styles: [
    `
      :host {
        display: block;
        max-height: 100%;
        overflow: auto;
        background: black;
        color: white;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BritLogsComponent implements OnChanges {
  constructor (private elementRef: ElementRef) {}

  @Input () logs!: BritLog[];

  ngOnChanges (changes: SimpleChanges<this>) {
    if (changes.logs) {
      setTimeout (
        () =>
          (this.elementRef.nativeElement.scrollTop =
            this.elementRef.nativeElement.scrollHeight)
      );
    } // if
  } // ngOnChanges
} // BritLogsComponent
