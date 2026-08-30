import { NgClass } from "@angular/common";
import { Component, OnChanges, SimpleChanges, input, output } from "@angular/core";

@Component({
  selector: "brit-actions",
  template: `
    <div class="brit-actions">
      <button
        class="brit-action brit-cancel"
        [ngClass]="{
          'is-active': canCancel(),
          'is-disabled': !canCancel()
        }"
        (click)="onCancelClick()">
        {{ labels.cancel }}
      </button>
      @if (!canConfirm()) {
        <button
          class="brit-action brit-pass"
          [ngClass]="{
            'is-active': canPass(),
            'is-disabled': !canPass()
          }"
          (click)="onPassClick()">
          {{ labels.pass }}
        </button>
      }
      @if (canConfirm()) {
        <button
          class="brit-action brit-confirm"
          [ngClass]="{
            'is-active': canConfirm(),
            'is-disabled': !canConfirm()
          }"
          (click)="onConfirmClick()">
          {{ labels.confirm }}
        </button>
      }
      <!-- <button
      *ngFor="let action of actions"
      class="brit-action"
        [ngClass]="{
          'is-active': isValid ? isValid[action] : false,
          'is-disabled': isValid ? !isValid[action] : true
        }"
      (click)="onActionClick (action)">
      {{ labels[action] }}
    </button> -->
    </div>
  `,
  styles: [
    `
      @use "barony-variables" as *;

      .brit-actions {
        display: grid;
        grid-template-columns: 1fr 1fr /*  1fr */;
        grid-template-rows: 1fr /*  1fr */;
        grid-gap: 2vmin;
        font-size: $font-size-actions;
        .brit-action {
          /* &.brit-cancel {
          grid-column-start: 2;
        } */
          padding: 2vmin;
          box-shadow: $widget-shadow;
          color: white;
          background-color: $surface;
          border: 0;
          outline: none;
          &.is-active {
            cursor: pointer;
            &:hover {
              box-shadow: $widget-shadow-hover;
            }
          }
          &.is-disabled {
            opacity: 0.5;
            cursor: no-drop;
          }
        }
      }
    `
  ],
  imports: [NgClass]
})
export class BritActionsComponent implements OnChanges {
  constructor() {}

  // @Input () validActions: BaronyAction[] | null = null;
  readonly canPass = input.required<boolean>();
  readonly canConfirm = input.required<boolean>();
  readonly canCancel = input.required<boolean>();
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  readonly passClick = output<void>();
  readonly confirmClick = output<void>();
  readonly cancelClick = output<void>();

  actions = [];

  labels = {
    pass: "Pass",
    confirm: "Confirm",
    cancel: "Cancel"
  };

  isValid: { [action: string]: boolean } | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.validActions || changes.canPass) {
    //   if (this.validActions) {
    //     this.isValid = arrayUtil.toMap (this.validActions, a => a, () => true) as any;
    //   } else {
    //     this.isValid = null;
    //   }
    // }
  }

  // onActionClick (action: BaronyAction) {
  //   if (this.isValid && this.isValid[action]) {
  //     this.actionClick.next (action);
  //   }
  // }

  onPassClick() {
    if (this.canPass()) {
      this.passClick.emit();
    }
  }

  onConfirmClick() {
    if (this.canConfirm()) {
      this.confirmClick.emit();
    }
  }

  onCancelClick() {
    if (this.canCancel()) {
      this.cancelClick.emit();
    }
  }
}
