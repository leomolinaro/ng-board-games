import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BARONY_RESOURCE_TYPES } from "../barony-constants";
import { BaronyPlayer, BaronyResourceType } from "../barony-models";

@Component ({
  selector: "barony-end-game",
  templateUrl: "./barony-end-game.component.html",
  styleUrls: ["./barony-end-game.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BaronyEndGameComponent {
  constructor () {}

  @Input () players!: BaronyPlayer[];

  playerColumns = ["player", "score", "resources", "victoryPoints", "winner"];

  resourceTypes = BARONY_RESOURCE_TYPES;

  getResourceImageSource (resourceType: BaronyResourceType) {
    return `assets/barony/resources/${resourceType}.png`;
  } // getResourceImageSource
} // BaronyEndGameComponent
