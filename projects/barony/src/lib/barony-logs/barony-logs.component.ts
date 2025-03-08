import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
} from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";
import { BaronyLog } from "../barony-models";

@Component ({
  selector: "barony-logs",
  template: `
    <barony-log *ngFor="let log of logs" [log]="log"></barony-log>
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
  standalone: false
})
export class BaronyLogsComponent implements OnChanges {

  constructor (private elementRef: ElementRef) {}

  @Input () logs!: BaronyLog[];

  ngOnChanges (changes: SimpleChanges<BaronyLogsComponent>) {
    if (changes.logs) {
      setTimeout (() => this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight);
    } // if
  } // ngOnChanges

} // BaronyLogsComponent
