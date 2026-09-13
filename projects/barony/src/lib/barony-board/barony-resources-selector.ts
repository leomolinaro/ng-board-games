import { Component, input, output } from '@angular/core';
import type { BaronyResourceType } from '../barony-models';

@Component({
  selector: 'barony-resources-selector',
  template: `
    <div class="b-resources-selector-container">
      @for (resource of resources(); track resource) {
        <div
          class="b-resource-image"
          (click)="onResourceClick(resource)"
        >
          <img [src]="'assets/barony/resources/' + resource + '.png'" />
        </div>
      }
    </div>
  `,
  styles: `
    .b-resources-selector-container {
      height: 12vh;
      display: flex;
      justify-content: space-evenly;
      .b-resource-image {
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
export class BaronyResourcesSelector {
  readonly resources = input.required<BaronyResourceType[]>();
  readonly resourceClick = output<BaronyResourceType>();

  onResourceClick(resource: BaronyResourceType): void {
    this.resourceClick.emit(resource);
  }
}
