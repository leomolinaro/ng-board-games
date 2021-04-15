import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges } from "@angular/core";
import { SimpleChanges } from "@bg-utils";
import { BaronyLog } from "../barony-models";

@Component ({
  selector: "barony-logs",
  templateUrl: "./barony-logs.component.html",
  styleUrls: ["./barony-logs.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyLogsComponent implements OnChanges {

  constructor (
    private elementRef: ElementRef
  ) { }

  @Input () logs!: BaronyLog[];

  ngOnChanges (changes: SimpleChanges<BaronyLogsComponent>) {
    if (changes.logs) {
      setTimeout (() => this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight);
    } // if
  } // ngOnChanges

} // BaronyLogsComponent
