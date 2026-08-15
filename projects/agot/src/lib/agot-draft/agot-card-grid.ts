import { Component, input } from "@angular/core";
import { AgotCard } from "../agot.models";

@Component({
  selector: "agot-card-grid",
  template: `
    @for (card of cards(); track card) {
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
  `,
  styles: `
    img {
      border-radius: 5px;
    }
  `
})
export class AgotCardGrid {
  readonly cards = input.required<AgotCard[]>();
}
