import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, inject } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BritLog } from "../brit-game-state.models";
import { BritLogComponent } from "./brit-log.component";

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
  imports: [NgFor, BritLogComponent]
})
export class BritLogsComponent implements OnChanges {
  
  private elementRef = inject (ElementRef);

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
