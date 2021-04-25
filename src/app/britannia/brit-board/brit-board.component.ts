import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BritArea } from "../brit-models";

@Component ({
  selector: "brit-board",
  templateUrl: "./brit-board.component.html",
  styleUrls: ["./brit-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritBoardComponent {

  constructor () { }

  @Input () areas!: BritArea[];

} // BritBoardComponent
