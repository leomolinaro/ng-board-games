import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from "@angular/core";

@Component ({
  selector: "brit-actions",
  templateUrl: "./brit-actions.component.html",
  styleUrls: ["./brit-actions.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritActionsComponent implements OnChanges {

  constructor () { }

  // @Input () validActions: BaronyAction[] | null = null;
  @Input () canPass!: boolean;
  @Input () canCancel!: boolean;
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();

  actions = [];

  labels: { [action: string]: string } = {
    recruitment: "Recruitment",
    movement: "Movement",
    construction: "Construction",
    newCity: "New city",
    expedition: "Expedition",
    nobleTitle: "Noble title",
    pass: "Pass",
    cancel: "Cancel"
  };
  
  isValid: { [action: string]: boolean } | null = null;

  ngOnChanges (changes: SimpleChanges): void {
    // if (changes.validActions || changes.canPass) {
    //   if (this.validActions) {
    //     this.isValid = arrayUtil.toMap (this.validActions, a => a, () => true) as any;
    //   } else {
    //     this.isValid = null;
    //   } // if - else
    // } // if
  } // ngOnChanges

  // onActionClick (action: BaronyAction) {
  //   if (this.isValid && this.isValid[action]) {
  //     this.actionClick.next (action);
  //   } // if
  // } // onActionClick

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

} // BritActionsComponent
