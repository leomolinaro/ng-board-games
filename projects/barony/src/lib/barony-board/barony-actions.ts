import { Component, computed, input, output } from '@angular/core';
import { arrayUtil } from '@leobg/commons/utils';
import { BARONY_ACTIONS } from '../barony-constants';
import type { BaronyAction } from '../barony-models';

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
      @let isVal = isValid();
      @for (action of actions; track action) {
        <button
          class="b-action"
          [class.is-active]="isVal ? isVal[action] : false"
          [class.is-disabled]="isVal ? !isVal[action] : true"
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
export class BaronyActionsArea {
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

  protected isValid = computed(() => {
    const validActions = this.validActions();
    return validActions ? arrayUtil.toMap(
        validActions,
        (a) => a,
        () => true,
      ) : null;
  });

  onActionClick(action: BaronyAction) {
    if (this.isValid()?.[action]) this.actionClick.emit(action);
  }

  onPassClick() {
    if (this.canPass()) this.passClick.emit();
  }

  onCancelClick() {
    if (this.canCancel()) this.cancelClick.emit();
  }
}
