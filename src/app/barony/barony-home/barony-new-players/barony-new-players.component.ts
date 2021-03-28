import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { BooleanInput, immutableUtil, SimpleChanges } from "@bg-utils";
import { BaronyNewPlayer, BaronyNewPlayerType } from "../barony-home.models";

@Component ({
  selector: "barony-new-players",
  templateUrl: "./barony-new-players.component.html",
  styleUrls: ["./barony-new-players.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyNewPlayersComponent implements OnChanges {

  constructor () { }

  @Input () players!: BaronyNewPlayer[];
  @Input () @BooleanInput () localGame!: boolean;
  @Output () playersChange = new EventEmitter<BaronyNewPlayer[]> ();
  
  playerTrackBy = (index: number, player: BaronyNewPlayer) => index;

  valid: boolean = false;

  ngOnChanges (changes: SimpleChanges<BaronyNewPlayersComponent>) {
  } // ngOnChanges

  onPlayerChange (player: BaronyNewPlayer, index: number) {
    const newPlayers = immutableUtil.listReplaceByIndex (index, player, this.players);
    this.valid = newPlayers.every (newPlayer => {
      if (newPlayer.type === "closed") { return true; }
      // TODO
      return true;
    });
    this.playersChange.emit (newPlayers);
  } // onPlayerChange

  onNextPlayerType (currentType: BaronyNewPlayerType, index: number) {
    const nextPlayerType = this.getNextPlayerType (currentType);
    const newPlayer: BaronyNewPlayer = { ...this.players[index], type: nextPlayerType };
    this.onPlayerChange (newPlayer, index);
  } // onNextPlayerType

  private getNextPlayerType (currentType: BaronyNewPlayerType): BaronyNewPlayerType {
    switch (currentType) {
      case "closed": return "me";
      case "me": return this.localGame ? "ai" : "open";
      case "open": return "ai";
      case "ai": return "closed";
      case "other": return "closed";
    } // switch
  } // getNextPlayerType

} // BaronyNewPlayersComponent
