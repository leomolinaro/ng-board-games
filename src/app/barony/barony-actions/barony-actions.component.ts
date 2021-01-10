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

  @Input () candidateActions: BaronyAction[] | null = null;
  @Output () actionClick = new EventEmitter<void> ();

  actions = baronyActions;

  labels: { [action: string]: string } = {
    recruitment: "Recruitment",
    movement: "Movement",
    construction: "Construction",
    newCity: "New city",
    expedition: "Expedition",
    nobleTitle: "Noble title"
  };
  
  isCandidate: { [action: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges): void {
    if (changes.candidateActions) {
      if (this.candidateActions) {
        this.isCandidate = arrayUtil.toMap (this.candidateActions, a => a, () => true) as any;
      } else {
        this.isCandidate = null;
      } // if - else
    } // if
  } // ngOnChanges

  onActionClick (action: BaronyAction) {
    if (this.isCandidate && this.isCandidate[action]) {
      this.actionClick.next ();
    } // if
  } // onActionClick

} // BaronyActionsComponent
