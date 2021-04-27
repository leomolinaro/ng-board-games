import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BritArea, BritPlayer } from "../brit-models";

@Component ({
  selector: "brit-board",
  templateUrl: "./brit-board.component.html",
  styleUrls: ["./brit-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritBoardComponent {

  constructor () { }

  @Input () areas!: BritArea[];
  @Input () players!: BritPlayer[];

} // BritBoardComponent
