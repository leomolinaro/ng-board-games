import { Component, OnChanges, input, output } from '@angular/core';
import { SimpleChanges, arrayUtil } from '@leobg/commons/utils';
import { BARONY_ACTIONS } from '../barony-constants';
import { BaronyAction } from '../barony-models';

@Component({
  selector: 'barony-actions-area',
  template: `
    <div class="b-actions">
      <button
        class="b-action b-cancel"
        [class.is-active]="canCancel()"
        [class.is-disabled]="!canCancel()"
        (click)="onCancelClick()"
      >
        {{ labels.cancel }}
      </button>
      <button
        class="b-action b-pass"
        [class.is-active]="canPass()"
        [class.is-disabled]="!canPass()"
        (click)="onPassClick()"
      >
        {{ labels.pass }}
      </button>
      @for (action of actions; track action) {
        <button
          class="b-action"
          [class.is-active]="isValid ? isValid[action] : false"
          [class.is-disabled]="isValid ? !isValid[action] : true"
          (click)="onActionClick(action)"
        >
          {{ $any(labels)[action] }}
        </button>
      }
    </div>
  `,
  styles: `
    @use 'barony-variables' as barony;

    .b-actions {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      grid-gap: 2vmin;
      font-size: barony.$font-size-actions;
      .b-action {
        &.b-cancel {
          grid-column-start: 2;
        }
        padding: 2vmin;
        box-shadow: barony.$widget-shadow;
        color: white;
        background-color: barony.$surface;
        border: 0;
        outline: none;
        &.is-active {
          cursor: pointer;
          &:hover {
            box-shadow: barony.$widget-shadow-hover;
          }
        }
        &.is-disabled {
          opacity: 0.5;
          cursor: no-drop;
        }
      }
    }
  `,
})
export class BaronyActionsArea implements OnChanges {
  constructor() {}

  readonly validActions = input<BaronyAction[] | null>(null);
  readonly canPass = input.required<boolean>();
  readonly canCancel = input.required<boolean>();
  readonly actionClick = output<BaronyAction>();
  readonly passClick = output<void>();
  readonly cancelClick = output<void>();

  actions = BARONY_ACTIONS;

  labels = {
    recruitment: 'Recruitment',
    movement: 'Movement',
    construction: 'Construction',
    newCity: 'New city',
    expedition: 'Expedition',
    nobleTitle: 'Noble title',
    pass: 'Pass',
    cancel: 'Cancel',
  };

  isValid: { [action: string]: boolean } | null = null;

  ngOnChanges(changes: SimpleChanges<this>): void {
    if (changes.validActions || changes.canPass) {
      const validActions = this.validActions();
      if (validActions) {
        this.isValid = arrayUtil.toMap(
          validActions,
          (a) => a,
          () => true,
        ) as any;
      } else {
        this.isValid = null;
      }
    }
  }

  onActionClick(action: BaronyAction) {
    if (this.isValid && this.isValid[action]) {
      this.actionClick.emit(action);
    }
  }

  onPassClick() {
    if (this.canPass()) {
      this.passClick.emit();
    }
  }

  onCancelClick() {
    if (this.canCancel()) {
      this.cancelClick.emit();
    }
  }
}
