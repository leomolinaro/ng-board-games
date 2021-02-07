import { Component, OnInit, ChangeDetectionStrategy, OnChanges, Input, ElementRef } from "@angular/core";
import { SimpleChanges } from "@bg-utils";
import { BaronyLog } from "../models";

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
