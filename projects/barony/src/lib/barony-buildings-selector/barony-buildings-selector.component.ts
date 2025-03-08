import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { BaronyBuilding, BaronyPlayer } from "../barony-models";
import { NgFor } from "@angular/common";

@Component ({
  selector: "barony-buildings-selector",
  templateUrl: "./barony-buildings-selector.component.html",
  styleUrls: ["./barony-buildings-selector.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor]
})
export class BaronyBuildingsSelectorComponent implements OnChanges {
  constructor () {}

  @Input () buildings!: BaronyBuilding[];
  @Input () player!: BaronyPlayer;
  @Output () buildingClick = new EventEmitter<BaronyBuilding> ();

  ngOnChanges (): void {} // ngOnChanges

  onBuildingClick (building: BaronyBuilding) {
    this.buildingClick.next (building);
  } // onBuildingClick
} // BaronyBuildingsSelectorComponent
