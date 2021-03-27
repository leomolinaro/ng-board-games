import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { BaronyNewPlayer, BaronyNewPlayerTypeOption } from "../barony-home.models";

@Component ({
  selector: "barony-new-players",
  templateUrl: "./barony-new-players.component.html",
  styleUrls: ["./barony-new-players.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyNewPlayersComponent implements OnInit {

  constructor () { }

  playerTypeOptions: BaronyNewPlayerTypeOption[] = [];
  playerTrackBy = (index: number, player: BaronyNewPlayer) => index;

  ngOnInit (): void {
  }

}
