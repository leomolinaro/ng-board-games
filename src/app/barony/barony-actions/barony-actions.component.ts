import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";
import { arrayUtil } from "@bg-utils";
import { BaronyAction, baronyActions } from "../models";

@Component ({
  selector: "barony-actions",
  templateUrl: "./barony-actions.component.html",
  styleUrls: ["./barony-actions.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyActionsComponent implements OnChanges {

  constructor () { }

  @Input () validActions: BaronyAction[] | null = null;
  @Input () canPass!: boolean;
  @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();

  actions = baronyActions;

  labels: { [action: string]: string } = {
    recruitment: "Recruitment",
    movement: "Movement",
    construction: "Construction",
    newCity: "New city",
    expedition: "Expedition",
    nobleTitle: "Noble title",
    pass: "Pass"
  };
  
  isValid: { [action: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges): void {
    if (changes.validActions || changes.canPass) {
      if (this.validActions) {
        this.isValid = arrayUtil.toMap (this.validActions, a => a, () => true) as any;
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

} // BaronyActionsComponent
