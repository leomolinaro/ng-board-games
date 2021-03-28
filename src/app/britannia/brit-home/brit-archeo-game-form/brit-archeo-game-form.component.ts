import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter } from "@angular/core";
import { ABgArcheoGameForm } from "@bg-home";
import { BgFieldConfig } from "src/app/bg-components/bg-form.directive";
import { BritArcheoGame } from "../brit-home.models";

@Component ({
  selector: "brit-archeo-game-form",
  templateUrl: "./brit-archeo-game-form.component.html",
  styleUrls: ["./brit-archeo-game-form.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritArcheoGameFormComponent implements ABgArcheoGameForm {

  constructor (
    private cd: ChangeDetectorRef
  ) { }

  game!: BritArcheoGame;
  gameChange = new EventEmitter<BritArcheoGame> ();

  typeConfig: BgFieldConfig<"local" | "online", BritArcheoGame> = {
    valueGetter: g => g.online ? "online" : "local",
    valueSetter: (value, g) => ({ online: value === "online" })
  };

  onGameChange (newGame: BritArcheoGame) {
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

} // BritArcheoGameFormComponent
