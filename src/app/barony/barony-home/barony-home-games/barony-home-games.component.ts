import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { BaronyGameDoc } from "../../barony-remote.service";

@Component ({
  selector: "barony-home-games",
  templateUrl: "./barony-home-games.component.html",
  styleUrls: ["./barony-home-games.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyHomeGamesComponent {

  constructor () { }

  @Input () games!: BaronyGameDoc[];
  @Output () deleteGame = new EventEmitter<BaronyGameDoc> ();
  @Output () enterGame = new EventEmitter<BaronyGameDoc> ();

  columns = ["run", "name", "state", "owner", "delete"];

} // BaronyHomeGamesComponent
