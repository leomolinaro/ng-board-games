import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";

@Component ({
  selector: "brit-units-selector",
  template: `
    <div class="brit-unit-selector-container">
      <img class="brit-nation-unit-image" [src]="imageSource" />
      <div class="brit-units">
        <span class="brit-unit-number">{{ this.number }}</span>
        <span class="brit-unit-fraction-sign">/</span>
        <span class="brit-unit-max">{{ this.max }}</span>
      </div>
      <div class="brit-unit-buttons">
        <button
          (click)="onIncrease()"
          [ngClass]="{
            'is-active': enableIncrease,
            'is-disabled': !enableIncrease
          }"
        >
          <i class="fa fa-caret-up"></i>
        </button>
        <button
          (click)="onDecrease()"
          [ngClass]="{
            'is-active': enableDecrease,
            'is-disabled': !enableDecrease
          }"
        >
          <i class="fa fa-caret-down"></i>
        </button>
      </div>
      <button class="brit-unit-confirm" (click)="onConfirm()">
        <i class="fa fa-check"></i>
      </button>
    </div>
  `,
  styleUrls: ["./brit-units-selector.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BritUnitsSelectorComponent implements OnChanges {
  constructor () {}

  @Input () number!: number;
  @Input () imageSource!: string;
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
} // BritUnitsSelectorComponent
