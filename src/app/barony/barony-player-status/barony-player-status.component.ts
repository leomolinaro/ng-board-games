import { Component, Input, OnChanges, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { BooleanInput, SimpleChanges } from "@bg-utils";
import { BaronyBuilding, BaronyPawnType, baronyPawnTypes, BaronyPlayer, BaronyResourceType, baronyResourceTypes } from "../models";

interface BaronyPawnNode {
  source: string;
  type: BaronyPawnType;
  quantity: number;
  active: boolean;
} // BaronyPawnNode

interface BaronyResourceNode {
  source: string;
  type: BaronyResourceType;
  quantity: number;
} // BaronyResourceNode

@Component ({
  selector: "barony-player-status",
  templateUrl: "./barony-player-status.component.html",
  styleUrls: ["./barony-player-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyPlayerStatusComponent implements OnChanges {

  constructor () { }

  @Input () player!: BaronyPlayer;
  @Input () @BooleanInput () currentPlayer: boolean = false;
  @Input () validBuildings: BaronyBuilding[] | null = null;
  @Output () selectPlayer = new EventEmitter<void> ();
  @Output () clickPawn = new EventEmitter<BaronyPawnType> ();

  pawnNodes!: BaronyPawnNode[];
  resourceNodes!: BaronyResourceNode[];
  
  ngOnChanges (changes: SimpleChanges<BaronyPlayerStatusComponent>): void {
    let refreshPawns = false;
    let refreshResources = false;

    if (changes.player) {
      if (!changes.player.previousValue || changes.player.previousValue.pawns !== changes.player.currentValue.pawns) {
        refreshPawns = true;
      } // if
      if (!changes.player.previousValue || changes.player.previousValue.resources !== changes.player.currentValue.resources) {
        refreshResources = true;
      } // if
    } // if
    if (changes.validBuildings) {
      refreshPawns = true;
    } // if

    if (refreshPawns) {
      this.pawnNodes = baronyPawnTypes.map (pt => ({
        source: `assets/barony/pawns/${this.player.color}-${pt}.png`,
        type: pt,
        quantity: this.player.pawns[pt],
        active: (this.validBuildings && (pt === "stronghold" || pt === "village")) ? this.validBuildings.includes (pt) : false
      }));
    } // if

    if (refreshResources) {
      this.resourceNodes = baronyResourceTypes.map (rt => ({
        source: `assets/barony/resources/${rt}.png`,
        type: rt,
        quantity: this.player.resources[rt]
      }));
    } // refreshResources
  } // ngOnChanges
  
  onCardClick () {
    if (!this.currentPlayer) {
      this.selectPlayer.emit ();
    } // if
  } // onCardClick

  onPawnClick (pawnNode: BaronyPawnNode) {
    if (pawnNode.active) {
      this.clickPawn.emit (pawnNode.type);
    } // if
  } // onPawnClick

} // BaronyPlayerStatusComponent
