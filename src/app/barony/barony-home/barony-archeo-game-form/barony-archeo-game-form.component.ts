import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter } from "@angular/core";
import { ABgArcheoGameForm } from "@bg-home";
import { BgFieldConfig } from "src/app/bg-components/bg-form.directive";
import { BaronyArcheoGame } from "../barony-home.models";

@Component ({
  selector: "barony-archeo-game-form",
  templateUrl: "./barony-archeo-game-form.component.html",
  styleUrls: ["./barony-archeo-game-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyArcheoGameFormComponent implements ABgArcheoGameForm {

  constructor (
    private cd: ChangeDetectorRef
  ) { }

  game!: BaronyArcheoGame;
  gameChange = new EventEmitter<BaronyArcheoGame> ();

  typeConfig: BgFieldConfig<"local" | "online", BaronyArcheoGame> = {
    valueGetter: g => g.online ? "online" : "local",
    valueSetter: (value, g) => ({ online: value === "online" })
  };

  onGameChange (newGame: BaronyArcheoGame) {
    this.game = newGame;
    this.gameChange.emit (newGame);
  } // onGameChange

  clearForm () {
    this.game = {
      name: "",
      online: false
    };
    setTimeout (() => this.cd.markForCheck ());
  } // clearForm

} // BaronyArcheoGameFormComponent
