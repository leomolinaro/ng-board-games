import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { BgAuthService } from "@bg-services";
import { BooleanInput, SimpleChanges } from "@bg-utils";
import { BritPlayer } from "../brit-models";

// interface BritPawnNode {
//   source: string;
//   type: BritPawnType;
//   quantity: number;
//   active: boolean;
// } // BritPawnNode

// interface BritResourceNode {
//   source: string;
//   type: BritResourceType;
//   quantity: number;
//   active: boolean;
// } // BritResourceNode

@Component ({
  selector: "brit-player",
  templateUrl: "./brit-player.component.html",
  styleUrls: ["./brit-player.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritPlayerComponent implements OnChanges {

  constructor (
    private authService: BgAuthService
  ) { }

  @Input () player!: BritPlayer;
  @Input () @BooleanInput () currentPlayer: boolean = false;
  // @Input () validBuildings: BritBuilding[] | null = null;
  // @Input () validResources: BritResourceType[] | null = null;
  @Output () selectPlayer = new EventEmitter<void> ();
  // @Output () clickPawn = new EventEmitter<BritPawnType> ();
  // @Output () clickResource = new EventEmitter<BritResourceType> ();

  // pawnNodes!: BritPawnNode[];
  // resourceNodes!: BritResourceNode[];

  // pawnTrackBy = (pawnNode: BritPawnNode) => pawnNode.type;
  // resourceTrackBy = (resourceNode: BritResourceNode) => resourceNode.type;

  ngOnChanges (changes: SimpleChanges<this>): void {
    let refreshPawns = false;
    let refreshResources = false;

    // if (changes.player) {
    //   if (!changes.player.previousValue || changes.player.previousValue.pawns !== changes.player.currentValue.pawns) {
    //     refreshPawns = true;
    //   } // if
    //   if (!changes.player.previousValue || changes.player.previousValue.resources !== changes.player.currentValue.resources) {
    //     refreshResources = true;
    //   } // if
    // } // if
    // if (changes.validBuildings) {
    //   refreshPawns = true;
    // } // if
    // if (changes.validResources) {
    //   refreshResources = true;
    // } // if

    // if (refreshPawns) {
    //   this.pawnNodes = Brit_PAWN_TYPES.map (pt => ({
    //     source: `assets/Brit/pawns/${this.player.color}-${pt}.png`,
    //     type: pt,
    //     quantity: this.player.pawns[pt],
    //     active: (this.validBuildings && (pt === "stronghold" || pt === "village")) ? this.validBuildings.includes (pt) : false
    //   }));
    // } // if

    // if (refreshResources) {
    //   this.resourceNodes = Brit_RESOURCE_TYPES.map (rt => ({
    //     source: `assets/Brit/resources/${rt}.png`,
    //     type: rt,
    //     quantity: this.player.resources[rt],
    //     active: (this.validResources ? this.validResources.includes (rt) : false)
    //   }));
    // } // refreshResources
  } // ngOnChanges

  onCardClick () {
    if (!this.player.isAi && this.authService.isUserId (this.player.controller.id) && !this.currentPlayer) {
      this.selectPlayer.emit ();
    } // if
  } // onCardClick

  onNationClick (nation: string) {

  } // onNationClick

  // onPawnClick (pawnNode: BritPawnNode) {
  //   if (pawnNode.active) {
  //     this.clickPawn.emit (pawnNode.type);
  //   } // if
  // } // onPawnClick

  // onResourceClick (resourceNode: BritResourceNode) {
  //   if (resourceNode.active) {
  //     this.clickResource.emit (resourceNode.type);
  //   } // if
  // } // onResourceClick

} // BritPlayerComponent
