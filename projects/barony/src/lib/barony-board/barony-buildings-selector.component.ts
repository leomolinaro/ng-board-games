
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from "@angular/core";
import { BaronyBuilding, BaronyPlayer } from "../barony-models";

@Component ({
  selector: "barony-buildings-selector",
  template: `
    <div class="b-buildings-selector-container">
      @for (building of buildings; track building) {
        <div
          class="b-building-image"
          (click)="onBuildingClick(building)">
          <img [src]="'assets/barony/pawns/' + player.id + '-' + building + '.png'"/>
        </div>
      }
    </div>
    `,
  styles: `
    .b-buildings-selector-container {
      height: 10vh;
      display: flex;
      justify-content: space-evenly;
      .b-building-image {
        height: 100%;
        padding-left: 10px;
        padding-right: 10px;
        & > img {
          height: 100%;
          &:hover {
            opacity: 0.7;
          }
        }
        cursor: pointer;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
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
