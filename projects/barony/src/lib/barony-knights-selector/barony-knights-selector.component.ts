import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { SimpleChanges } from "@leobg/commons";

@Component ({
  selector: "barony-knights-selector",
  templateUrl: "./barony-knights-selector.component.html",
  styleUrls: ["./barony-knights-selector.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaronyKnightsSelectorComponent implements OnChanges {
  constructor () {}

  @Input () number!: number;
  @Input () min!: number;
  @Input () max!: number;
  @Output () numberChange = new EventEmitter<number> ();
  @Output () confirm = new EventEmitter<void> ();

  enableIncrease = false;
  enableDecrease = false;

  ngOnChanges (changes: SimpleChanges<this>) {
    if (changes.number || changes.min || changes.max) {
      this.enableIncrease = this.number < this.max;
      this.enableDecrease = this.number > this.min;
    } // if
  } // ngOnChanges

  onIncrease () {
    if (this.enableIncrease) {
      this.numberChange.emit (this.number + 1);
    } // if
  } // onIncrease

  onDecrease () {
    if (this.enableDecrease) {
      this.numberChange.emit (this.number - 1);
    } // if
  } // onIncrease

  onConfirm () {
    this.confirm.next ();
  } // onConfirm
} // BaronyKnightsSelectorComponent
