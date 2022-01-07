import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BritArea, BritNation, BritPlayer, BritRound, BritUnit, BritUnitId } from "../brit-models";

@Component ({
  selector: "brit-board",
  templateUrl: "./brit-board.component.html",
  styleUrls: ["./brit-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritBoardComponent {

  constructor () { }

  @Input () areas!: BritArea[];
  @Input () nations!: BritNation[];
  @Input () rounds!: BritRound[];
  @Input () unitsMap!: Record<BritUnitId, BritUnit>;
  @Input () players!: BritPlayer[];

} // BritBoardComponent
