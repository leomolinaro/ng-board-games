import type { OnChanges} from '@angular/core';
import { Component, input, output } from '@angular/core';
import type { SimpleChanges } from '@leobg/commons/utils';
import { TuiIcon } from '@taiga-ui/core';

@Component({
  selector: 'brit-units-selector',
  imports: [TuiIcon],
  template: `
    <div class="brit-unit-selector-container">
      <img
        class="brit-nation-unit-image"
        [src]="imageSource()"
      />
      <div class="brit-units">
        <span class="brit-unit-number">{{ this.number() }}</span>
        <span class="brit-unit-fraction-sign">/</span>
        <span class="brit-unit-max">{{ this.max() }}</span>
      </div>
      <div class="brit-unit-buttons">
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
        class="brit-unit-confirm"
        (click)="onConfirm()"
      >
        <tui-icon icon="check" />
      </button>
    </div>
  `,
  styleUrls: ['./brit-units-selector.scss'],
})
export class BritUnitsSelector implements OnChanges {
  readonly number = input.required<number>();
  readonly imageSource = input.required<string>();
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
