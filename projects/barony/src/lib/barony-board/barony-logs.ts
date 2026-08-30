import { Component, ElementRef, OnChanges, inject, input } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BaronyLog } from "../barony-models";
import { BaronyLogRow } from "./barony-log-row";

@Component({
  selector: "barony-logs",
  imports: [BaronyLogRow],
  template: `
    @for (log of logs(); track log) {
      <barony-log-row [log]="log"></barony-log-row>
    }
  `,
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
  ]
})
export class BaronyLogs implements OnChanges {
  private elementRef = inject(ElementRef);

  readonly logs = input.required<BaronyLog[]>();

  ngOnChanges(changes: SimpleChanges<BaronyLogs>) {
    if (changes.logs) {
      setTimeout(
        () => (this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight)
      );
    }
  }
}
