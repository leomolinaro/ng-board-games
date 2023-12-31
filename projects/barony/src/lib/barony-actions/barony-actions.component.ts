import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { SimpleChanges, arrayUtil } from "@leobg/commons";
import { BARONY_ACTIONS } from "../barony-constants";
import { BaronyAction } from "../barony-models";

@Component ({
  selector: "barony-actions",
  templateUrl: "./barony-actions.component.html",
  styleUrls: ["./barony-actions.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
