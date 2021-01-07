import { Component, Input, OnChanges } from "@angular/core";
import { BooleanInput } from "@bg-utils";

@Component ({
  selector: "barony-player-status",
  templateUrl: "./barony-player-status.component.html",
  styleUrls: ["./barony-player-status.component.scss"]
})
export class BaronyPlayerStatusComponent implements OnChanges {

  constructor () { }

  @Input () name!: string;
  @Input () @BooleanInput () currentPlayer: boolean = false;

  ngOnChanges (): void {
  } // ngOnChanges

} // BaronyPlayerStatusComponent
