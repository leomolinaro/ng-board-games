import { Component, Input, OnChanges, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { BooleanInput } from "@bg-utils";
import { BaronyPlayer } from "../models";

@Component ({
  selector: "barony-player-status",
  templateUrl: "./barony-player-status.component.html",
  styleUrls: ["./barony-player-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyPlayerStatusComponent implements OnChanges {

  constructor () { }

  @Input () player!: BaronyPlayer;
  @Input () @BooleanInput () currentPlayer: boolean = false;
  @Output () selectPlayer = new EventEmitter<void> ();

  ngOnChanges (): void {
  } // ngOnChanges

  onCardClick () {
    this.selectPlayer.emit ();
  } // onCardClick

} // BaronyPlayerStatusComponent
