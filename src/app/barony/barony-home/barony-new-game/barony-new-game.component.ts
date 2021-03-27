import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { BaronyNewGame, gameTypeOptions } from "../barony-home.models";

@Component ({
  selector: "barony-new-game",
  templateUrl: "./barony-new-game.component.html",
  styleUrls: ["./barony-new-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyNewGameComponent {

  constructor (
    private authService: BgAuthService
  ) { }

  newGameValid = false;
  newGame: BaronyNewGame = {
    id: null,
    name: "",
    userId: this.authService.getUser ().id,
    type: "local",
    players: []
  };

  gameTypeOptions = gameTypeOptions;
  @Output () createGame = new EventEmitter<BaronyNewGame> ();

  onNewGameChange (newGame: BaronyNewGame) {
    this.newGameValid = !!(newGame.name && newGame.type);
    this.newGame = newGame;
  } // onNewGameChange

  onCreateGame () {
    this.createGame.emit (this.newGame);
  } // onNewGameChange

} // BaronyNewGameComponent
