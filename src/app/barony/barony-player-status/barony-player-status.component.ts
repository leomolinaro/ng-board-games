import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { BooleanInput, SimpleChanges } from "@bg-utils";
import { BARONY_PAWN_TYPES, BARONY_RESOURCE_TYPES } from "../barony-constants";
import { BaronyBuilding, BaronyPawnType, BaronyPlayer, BaronyResourceType } from "../barony-models";

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
  active: boolean;
} // BaronyResourceNode

@Component ({
  selector: "barony-player-status",
  templateUrl: "./barony-player-status.component.html",
  styleUrls: ["./barony-player-status.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyPlayerStatusComponent implements OnChanges {

  constructor (
    private authService: BgAuthService
  ) { }

  @Input () player!: BaronyPlayer;
  @Input () @BooleanInput () currentPlayer: boolean = false;
  @Input () validBuildings: BaronyBuilding[] | null = null;
  @Input () validResources: BaronyResourceType[] | null = null;
  @Output () selectPlayer = new EventEmitter<void> ();
  @Output () clickPawn = new EventEmitter<BaronyPawnType> ();
  @Output () clickResource = new EventEmitter<BaronyResourceType> ();

  pawnNodes!: BaronyPawnNode[];
  resourceNodes!: BaronyResourceNode[];

  pawnTrackBy = (pawnNode: BaronyPawnNode) => pawnNode.type;
  resourceTrackBy = (resourceNode: BaronyResourceNode) => resourceNode.type;
  
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
    if (changes.validResources) {
      refreshResources = true;
    } // if

    if (refreshPawns) {
      this.pawnNodes = BARONY_PAWN_TYPES.map (pt => ({
        source: `assets/barony/pawns/${this.player.color}-${pt}.png`,
        type: pt,
        quantity: this.player.pawns[pt],
        active: (this.validBuildings && (pt === "stronghold" || pt === "village")) ? this.validBuildings.includes (pt) : false
      }));
    } // if

    if (refreshResources) {
      this.resourceNodes = BARONY_RESOURCE_TYPES.map (rt => ({
        source: `assets/barony/resources/${rt}.png`,
        type: rt,
        quantity: this.player.resources[rt],
        active: (this.validResources ? this.validResources.includes (rt) : false)
      }));
    } // refreshResources
  } // ngOnChanges
  
  onCardClick () {
    if (!this.player.isAi && this.authService.isUserId (this.player.controller.id) && !this.currentPlayer) {
      this.selectPlayer.emit ();
    } // if
  } // onCardClick

  onPawnClick (pawnNode: BaronyPawnNode) {
    if (pawnNode.active) {
      this.clickPawn.emit (pawnNode.type);
    } // if
  } // onPawnClick

  onResourceClick (resourceNode: BaronyResourceNode) {
    if (resourceNode.active) {
      this.clickResource.emit (resourceNode.type);
    } // if
  } // onResourceClick

} // BaronyPlayerStatusComponent
