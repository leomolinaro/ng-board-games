import { Component, Input, OnChanges, Output, EventEmitter, ChangeDetectionStrategy } from "@angular/core";
import { BooleanInput, SimpleChanges } from "@bg-utils";
import { BaronyPawnType, baronyPawnTypes, BaronyPlayer, BaronyResourceType, baronyResourceTypes } from "../models";

interface BaronyPawnNode {
  source: string;
  type: BaronyPawnType;
  quantity: number;
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
  @Output () selectPlayer = new EventEmitter<void> ();

  pawnNodes!: BaronyPawnNode[];
  resourceNodes!: BaronyResourceNode[];
  
  ngOnChanges (changes: SimpleChanges<BaronyPlayerStatusComponent>): void {
    if (changes.player) {
      if (!changes.player.previousValue || changes.player.previousValue.pawns !== changes.player.currentValue.pawns) {
        this.pawnNodes = baronyPawnTypes.map (pt => ({
          source: `assets/barony/pawns/${this.player.color}-${pt}.png`,
          type: pt,
          quantity: this.player.pawns[pt]
        }));
      } // if
      if (!changes.player.previousValue || changes.player.previousValue.resources !== changes.player.currentValue.resources) {
        this.resourceNodes = baronyResourceTypes.map (rt => ({
          source: `assets/barony/resources/${rt}.png`,
          type: rt,
          quantity: this.player.resources[rt]
        }));
      } // if
    } // if
  } // ngOnChanges
  
  onCardClick () {
    this.selectPlayer.emit ();
  } // onCardClick

} // BaronyPlayerStatusComponent
