import { NgClass } from "@angular/common";
import { Component, input } from "@angular/core";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from "@angular/material/table";
import { BgTransformPipe } from "../../../../../commons/utils/src/lib/bg-transform.pipe";
import { BARONY_RESOURCE_TYPES } from "../../barony-constants";
import { BaronyPlayer, BaronyResourceType } from "../../barony-models";

@Component({
  selector: "barony-end-game",
  templateUrl: "./barony-end-game.component.html",
  styleUrls: ["./barony-end-game.component.scss"],
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    NgClass,
    BgTransformPipe
  ]
})
export class BaronyEndGameComponent {
  readonly players = input.required<BaronyPlayer[]>();

  playerColumns = ["player", "score", "resources", "victoryPoints", "winner"];

  resourceTypes = BARONY_RESOURCE_TYPES;

  getResourceImageSource(resourceType: BaronyResourceType) {
    return `assets/barony/resources/${resourceType}.png`;
  }
}
