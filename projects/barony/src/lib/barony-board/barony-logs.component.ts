import { Component, ElementRef, OnChanges, inject, input } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BaronyLog } from "../barony-models";
import { BaronyLogComponent } from "./barony-log.component";

@Component({
  selector: "barony-logs",
  template: `
    @for (log of logs(); track log) {
      <barony-log [log]="log"></barony-log>
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
  ],
  imports: [BaronyLogComponent]
})
export class BaronyLogsComponent implements OnChanges {
  private elementRef = inject(ElementRef);

  readonly logs = input.required<BaronyLog[]>();

  ngOnChanges(changes: SimpleChanges<BaronyLogsComponent>) {
    if (changes.logs) {
      setTimeout(
        () => (this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight)
      );
    }
  }
}
