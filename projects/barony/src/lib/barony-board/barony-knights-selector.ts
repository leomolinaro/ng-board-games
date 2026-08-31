import { Component, OnChanges, input, output } from '@angular/core';
import { SimpleChanges } from '@leobg/commons/utils';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'barony-knights-selector',
  imports: [TuiIcon],
  template: `
    <div class="b-knights-selector-container">
      <div class="b-knights">
        <span class="b-knights-number">{{ this.number() }}</span>
        <span class="b-knights-fraction-sign">/</span>
        <span class="b-knights-max">{{ this.max() }}</span>
      </div>
      <div class="b-knights-buttons">
        <button
          (click)="onIncrease()"
          [class.is-active]="enableIncrease"
          [class.is-disabled]="!enableIncrease"
        >
          <tui-icon icon="chevron-up" />
        </button>
        <button
          (click)="onDecrease()"
          [class.is-active]="enableDecrease"
          [class.is-disabled]="!enableDecrease"
        >
          <tui-icon icon="chevron-down" />
        </button>
      </div>
      <button
        class="b-knights-confirm"
        (click)="onConfirm()"
      >
        <tui-icon icon="check" />
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
      }
    }
  `,
})
export class BaronyKnightsSelector implements OnChanges {
  constructor() {}

  readonly number = input.required<number>();
  readonly min = input.required<number>();
  readonly max = input.required<number>();
  readonly numberChange = output<number>();
  readonly confirm = output<void>();

  enableIncrease = false;
  enableDecrease = false;

  ngOnChanges(changes: SimpleChanges<this>) {
    if (changes.number || changes.min || changes.max) {
      this.enableIncrease = this.number() < this.max();
      this.enableDecrease = this.number() > this.min();
    }
  }

  onIncrease() {
    if (this.enableIncrease) {
      this.numberChange.emit(this.number() + 1);
    }
  }

  onDecrease() {
    if (this.enableDecrease) {
      this.numberChange.emit(this.number() - 1);
    }
  }

  onConfirm() {
    this.confirm.emit();
  }
}
