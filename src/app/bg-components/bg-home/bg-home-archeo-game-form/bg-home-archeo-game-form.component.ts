import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { BgFieldConfig } from "@bg-components/form";
import { BgArcheoGame } from "@bg-services";

@Component({
  selector: 'bg-home-archeo-game-form',
  templateUrl: './bg-home-archeo-game-form.component.html',
  styleUrls: ['./bg-home-archeo-game-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BgHomeArcheoGameFormComponent {

  constructor (
    private cd: ChangeDetectorRef
  ) { }

  @Input () game!: BgArcheoGame;
  @Output () gameChange = new EventEmitter<BgArcheoGame> ();

  typeConfig: BgFieldConfig<"local" | "online", BgArcheoGame> = {
    valueGetter: g => g.online ? "online" : "local",
    valueSetter: (value, g) => ({ online: value === "online" })
  };

  onGameChange (newGame: BgArcheoGame) {
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

} // BgHomeArcheoGameFormComponent
