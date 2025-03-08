import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AgotCard } from "../../agot.models";
import { NgFor, NgIf } from "@angular/common";

@Component ({
  selector: "agot-card-grid",
  templateUrl: "./agot-card-grid.component.html",
  styleUrls: ["./agot-card-grid.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgFor, NgIf]
})
export class AgotCardGridComponent {
  constructor () {}

  @Input () cards!: AgotCard[];
} // AgotCardGridComponent
