import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { BaronyResourceType } from "../barony-models";
import { NgFor } from "@angular/common";

@Component ({
  selector: "barony-resources-selector",
  templateUrl: "./barony-resources-selector.component.html",
  styleUrls: ["./barony-resources-selector.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor]
})
export class BaronyResourcesSelectorComponent implements OnChanges {
  constructor () {}

  @Input () resources!: BaronyResourceType[];
  // @Input () player!: BaronyPlayer;
  @Output () resourceClick = new EventEmitter<BaronyResourceType> ();

  ngOnChanges (): void {} // ngOnChanges

  onResourceClick (resource: BaronyResourceType) {
    this.resourceClick.next (resource);
  } // onBuildingClick
} // BaronyResourcesSelectorComponent
