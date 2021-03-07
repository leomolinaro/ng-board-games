import { Component, ChangeDetectionStrategy, Input } from "@angular/core";
import { Card } from "../models/card";

@Component ({
  selector: "agot-card-grid",
  templateUrl: "./agot-card-grid.component.html",
  styleUrls: ["./agot-card-grid.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgotCardGridComponent {

  constructor () { }

  @Input () cards!: Card[];

} // AgotCardGridComponent
