import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { SimpleChanges } from "@leobg/commons/utils";

@Component({
  selector: "barony-knights-selector",
  template: `
    <div class="b-knights-selector-container">
      <div class="b-knights">
        <span class="b-knights-number">{{ this.number }}</span>
        <span class="b-knights-fraction-sign">/</span>
        <span class="b-knights-max">{{ this.max }}</span>
      </div>
      <div class="b-knights-buttons">
        <button
          (click)="onIncrease()"
          [ngClass]="{
            'is-active': enableIncrease,
            'is-disabled': !enableIncrease
          }">
          <i class="fa fa-caret-up"></i>
        </button>
        <button
          (click)="onDecrease()"
          [ngClass]="{
            'is-active': enableDecrease,
            'is-disabled': !enableDecrease
          }">
          <i class="fa fa-caret-down"></i>
        </button>
      </div>
      <button
        class="b-knights-confirm"
        (click)="onConfirm()">
        <i class="fa fa-check"></i>
      </button>
    </div>
  `,
  styles: `
    .b-knights-selector-container {
      display: flex;
      align-items: center;
      .b-knights {
        .b-knights-number {
          font-size: 4vmin;
        }
        .b-knights-fraction-sign {
          margin-right: 0.3vw;
          margin-left: 0.3vw;
          font-size: 3vmin;
        }
        .b-knights-max {
          font-size: 3vmin;
        }
      }
      .b-knights-buttons {
        margin-left: 0.5vw;
        display: flex;
        flex-direction: column;
        & > button {
          background: transparent;
          color: white;
          font-size: 4vmin;
          width: 4vw;
          &.is-active {
            cursor: pointer;
            &:hover {
              // box-shadow: 0 0 6px 0px #fff;
              // color: #666666;
              // color: white;
              // color: greenyellow;
            }
          }
          &.is-disabled {
            cursor: no-drop;
            color: #999999;
          }
        }
      }
      .b-knights-confirm {
        background: transparent;
        color: white;
        margin-left: auto;
        font-size: 3vmin;
        width: 4vw;
        height: 4vw;
        &:hover {
          // color: #666666;
        }
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass]
})
export class BaronyKnightsSelectorComponent implements OnChanges {
  constructor() {}

  @Input() number!: number;
  @Input() min!: number;
  @Input() max!: number;
  @Output() numberChange = new EventEmitter<number>();
  @Output() confirm = new EventEmitter<void>();

  enableIncrease = false;
  enableDecrease = false;

  ngOnChanges(changes: SimpleChanges<this>) {
    if (changes.number || changes.min || changes.max) {
      this.enableIncrease = this.number < this.max;
      this.enableDecrease = this.number > this.min;
    } // if
  } // ngOnChanges

  onIncrease() {
    if (this.enableIncrease) {
      this.numberChange.emit(this.number + 1);
    } // if
  } // onIncrease

  onDecrease() {
    if (this.enableDecrease) {
      this.numberChange.emit(this.number - 1);
    } // if
  } // onIncrease

  onConfirm() {
    this.confirm.next();
  } // onConfirm
} // BaronyKnightsSelectorComponent
