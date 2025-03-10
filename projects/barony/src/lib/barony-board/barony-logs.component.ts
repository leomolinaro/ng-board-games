
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, inject } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BaronyLog } from "../barony-models";
import { BaronyLogComponent } from "./barony-log.component";

@Component ({
  selector: "barony-logs",
  template: `
    @for (log of logs; track log) {
      <barony-log [log]="log"></barony-log>
    }
  `,
  styles: [`
    :host {
      display: block;
      max-height: 100%;
      overflow: auto;
      background: black;
      color: white;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaronyLogComponent]
})
export class BaronyLogsComponent implements OnChanges {
  
  private elementRef = inject (ElementRef);

  @Input () logs!: BaronyLog[];

  ngOnChanges (changes: SimpleChanges<BaronyLogsComponent>) {
    if (changes.logs) {
      setTimeout (() => this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight);
    } // if
  } // ngOnChanges

} // BaronyLogsComponent
