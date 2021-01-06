import { Component, Input, OnChanges } from "@angular/core";

@Component ({
  selector: "barony-player-status",
  templateUrl: "./barony-player-status.component.html",
  styleUrls: ["./barony-player-status.component.scss"]
})
export class BaronyPlayerStatusComponent implements OnChanges {

  constructor () { }

  @Input () name!: string;

  ngOnChanges (): void {
  } // ngOnChanges

} // BaronyPlayerStatusComponent
