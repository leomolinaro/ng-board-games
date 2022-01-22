import { ChangeDetectionStrategy, Component, Input, OnInit, TrackByFunction } from "@angular/core";
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

  playerTrackBy: TrackByFunction<BritPlayer> = (index, player) => player.id;

  ngOnInit (): void {
  } // ngOnInit

} // BritPlayersComponent
