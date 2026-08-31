import { Component, OnChanges, input, output } from '@angular/core';
import { BaronyBuilding, BaronyPlayer } from '../barony-models';

@Component({
  selector: 'barony-buildings-selector',
  template: `
    <div class="b-buildings-selector-container">
      @for (building of buildings(); track building) {
        <div
          class="b-building-image"
          (click)="onBuildingClick(building)"
        >
          <img
            [src]="
              'assets/barony/pawns/' + player().id + '-' + building + '.png'
            "
          />
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
  imports: [],
})
export class BaronyBuildingsSelector implements OnChanges {
  constructor() {}

  readonly buildings = input.required<BaronyBuilding[]>();
  readonly player = input.required<BaronyPlayer>();
  readonly buildingClick = output<BaronyBuilding>();

  ngOnChanges(): void {}

  onBuildingClick(building: BaronyBuilding) {
    this.buildingClick.emit(building);
  }
}
