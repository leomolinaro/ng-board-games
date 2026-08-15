import { Component, Input } from "@angular/core";
import { AgotCard } from "../agot.models";

@Component({
  selector: "agot-card-grid",
  template: `
    @for (card of cards; track card) {
      @if (card.type_code != "plot") {
        <img
          [src]="card.image_url"
          width="100" />
      }
      @if (card.type_code == "plot") {
        <img
          [src]="card.image_url"
          height="100" />
      }
    }
  `
})
export class AgotCardGrid {
  @Input() cards!: AgotCard[];
}
