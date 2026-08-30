import { Component, ElementRef, OnChanges, inject, input } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BritLog } from "../brit-game-state.models";
import { BritLogComponent } from "./brit-log.component";

@Component({
  selector: "brit-logs",
  template: '@for (log of logs(); track log) {<brit-log [log]="log"></brit-log>}',
  styles: [
    `
      :host {
        display: block;
        max-height: 100%;
        overflow: auto;
        background: black;
        color: white;
      }
    `
  ],
  imports: [BritLogComponent]
})
export class BritLogsComponent implements OnChanges {
  private elementRef = inject(ElementRef);

  readonly logs = input.required<BritLog[]>();

  ngOnChanges(changes: SimpleChanges<this>) {
    if (changes.logs) {
      setTimeout(
        () => (this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight)
      );
    }
  }
}
