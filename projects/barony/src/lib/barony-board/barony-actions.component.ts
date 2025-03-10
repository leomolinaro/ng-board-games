import { NgClass, NgFor } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { SimpleChanges, arrayUtil } from "@leobg/commons/utils";
import { BARONY_ACTIONS } from "../barony-constants";
import { BaronyAction } from "../barony-models";

@Component ({
  selector: "barony-actions",
  template: `
    <div class="b-actions">
      <button
        class="b-action b-cancel"
        [ngClass]="{
          'is-active': canCancel,
          'is-disabled': !canCancel
        }"
        (click)="onCancelClick()">
        {{ labels.cancel }}
      </button>
      <button
        class="b-action b-pass"
        [ngClass]="{
          'is-active': canPass,
          'is-disabled': !canPass
        }"
        (click)="onPassClick()">
        {{ labels.pass }}
      </button>
      <button
        *ngFor="let action of actions"
        class="b-action"
          [ngClass]="{
            'is-active': isValid ? isValid[action] : false,
            'is-disabled': isValid ? !isValid[action] : true
          }"
          (click)="onActionClick(action)">
        {{ $any(labels)[action] }}
      </button>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgFor]
})
export class BaronyActionsComponent implements OnChanges {
  constructor () {}

  @Input () validActions: BaronyAction[] | null = null;
  @Input () canPass!: boolean;
  @Input () canCancel!: boolean;
  @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();

  actions = BARONY_ACTIONS;

  labels = {
    recruitment: "Recruitment",
    movement: "Movement",
    construction: "Construction",
    newCity: "New city",
    expedition: "Expedition",
    nobleTitle: "Noble title",
    pass: "Pass",
    cancel: "Cancel",
  };

  isValid: { [action: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges<this>): void {
    if (changes.validActions || changes.canPass) {
      if (this.validActions) {
        this.isValid = arrayUtil.toMap (
          this.validActions,
          (a) => a,
          () => true
        ) as any;
      } else {
        this.isValid = null;
      } // if - else
    } // if
  } // ngOnChanges

  onActionClick (action: BaronyAction) {
    if (this.isValid && this.isValid[action]) {
      this.actionClick.next (action);
    } // if
  } // onActionClick

  onPassClick () {
    if (this.canPass) {
      this.passClick.next ();
    } // if
  } // onPassClick

  onCancelClick () {
    if (this.canCancel) {
      this.cancelClick.next ();
    } // if
  } // onCancelClick
} // BaronyActionsComponent
