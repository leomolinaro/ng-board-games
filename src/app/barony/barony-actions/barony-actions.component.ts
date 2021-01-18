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

  @Input () availableActions: BaronyAction[] | null = null;
  @Output () actionClick = new EventEmitter<BaronyAction> ();

  actions = baronyActions;

  labels: { [action: string]: string } = {
    recruitment: "Recruitment",
    movement: "Movement",
    construction: "Construction",
    newCity: "New city",
    expedition: "Expedition",
    nobleTitle: "Noble title"
  };
  
  isAvailable: { [action: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges): void {
    if (changes.availableActions) {
      if (this.availableActions) {
        this.isAvailable = arrayUtil.toMap (this.availableActions, a => a, () => true) as any;
      } else {
        this.isAvailable = null;
      } // if - else
    } // if
  } // ngOnChanges

  onActionClick (action: BaronyAction) {
    if (this.isAvailable && this.isAvailable[action]) {
      this.actionClick.next (action);
    } // if
  } // onActionClick

} // BaronyActionsComponent
