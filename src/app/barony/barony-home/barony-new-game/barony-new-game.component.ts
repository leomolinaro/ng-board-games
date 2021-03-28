import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { BaronyNewGame, gameTypeOptions } from "../barony-home.models";

@Component ({
  selector: "barony-new-game",
  templateUrl: "./barony-new-game.component.html",
  styleUrls: ["./barony-new-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyNewGameComponent {

  constructor () { }

  newGameValid = false;
  newGame: BaronyNewGame = {
    name: "",
    type: "local",
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
