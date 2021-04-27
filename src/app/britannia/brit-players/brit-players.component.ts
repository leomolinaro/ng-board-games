import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { BritPlayer } from "../brit-models";

@Component ({
  selector: "brit-players",
  templateUrl: "./brit-players.component.html",
  styleUrls: ["./brit-players.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritPlayersComponent implements OnInit {

  constructor () { }

  @Input () players!: BritPlayer[];

  ngOnInit (): void {
  } // ngOnInit

} // BritPlayersComponent
