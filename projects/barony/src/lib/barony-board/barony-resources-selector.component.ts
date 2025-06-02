import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { BaronyResourceType } from "../barony-models";

@Component({
  selector: "barony-resources-selector",
  template: `
    <div class="b-resources-selector-container">
      @for (resource of resources; track resource) {
      <div
        class="b-resource-image"
        (click)="onResourceClick(resource)">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class BaronyResourcesSelectorComponent implements OnChanges {
  constructor() {}

  @Input() resources!: BaronyResourceType[];
  // @Input () player!: BaronyPlayer;
  @Output() resourceClick = new EventEmitter<BaronyResourceType>();

  ngOnChanges(): void {} // ngOnChanges

  onResourceClick(resource: BaronyResourceType) {
    this.resourceClick.next(resource);
  } // onBuildingClick
} // BaronyResourcesSelectorComponent
