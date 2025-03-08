import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BARONY_RESOURCE_TYPES } from "../barony-constants";
import { BaronyPlayer, BaronyResourceType } from "../barony-models";
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from "@angular/material/table";
import { NgIf, NgFor, NgClass } from "@angular/common";
import { BgTransformPipe } from "../../../../commons/utils/src/lib/bg-transform.pipe";

@Component ({
  selector: "barony-end-game",
  templateUrl: "./barony-end-game.component.html",
  styleUrls: ["./barony-end-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, NgIf, NgFor, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, NgClass, BgTransformPipe]
})
export class BaronyEndGameComponent {
  constructor () {}

  @Input () players!: BaronyPlayer[];

  playerColumns = ["player", "score", "resources", "victoryPoints", "winner"];

  resourceTypes = BARONY_RESOURCE_TYPES;

  getResourceImageSource (resourceType: BaronyResourceType) {
    return `assets/barony/resources/${resourceType}.png`;
  } // getResourceImageSource
} // BaronyEndGameComponent
