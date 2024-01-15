import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from "@angular/core";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { WotrNationId, WotrRegionId } from "../wotr-components.models";
import { WotrLog, WotrNationState, WotrPlayer, WotrRegionState } from "../wotr-game-state.models";
import { WotrMapComponent } from "./wotr-map/wotr-map.component";

@Component ({
  selector: "wotr-board",
  standalone: true,
  imports: [NgIf, WotrMapComponent],
  templateUrl: "./wotr-board.component.html",
  styleUrls: ["./wotr-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrBoardComponent {

  constructor (private bottomSheet: MatBottomSheet) {}

  @Input () regionStates!: Record<WotrRegionId, WotrRegionState>;
  @Input () nationStates!: Record<WotrNationId, WotrNationState>;
  @Input () players!: WotrPlayer[];
  @Input () logs!: WotrLog[];
  @Input () turnPlayer: WotrPlayer | null = null;
  @Input () currentPlayer: WotrPlayer | null = null;
  // @Input () otherPlayers!: BaronyPlayer[];
  @Input () message: string | null = null;
  @Input () validRegions: WotrRegionId[] | null = null;
  // @Input () validUnits: WotrRegionUnit[] | null = null;
  // @Input () selectedUnits: WotrRegionUnit[] | null = null;
  // @Input () validActions: BaronyAction[] | null = null;
  // @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  // @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  @Input () canPass: boolean = false;
  @Input () canConfirm: boolean = false;
  @Input () canCancel: boolean = false;

  @Output () playerSelect = new EventEmitter<WotrPlayer> ();
  // @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  @Output () regionClick = new EventEmitter<WotrRegionId> ();
  // @Output () unitClick = new EventEmitter<WotrRegionUnit> ();
  // @Output () selectedUnitsChange = new EventEmitter<WotrRegionUnit[]> ();
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () confirmClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();
  // @Output () knightsConfirm = new EventEmitter<number> ();
  // @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();

  playerTrackBy: TrackByFunction<WotrPlayer> = (index, player) => player.id;

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;

  onPlayerSelect (player: WotrPlayer) { this.playerSelect.emit (player); }
  // onBuildingSelect (building: WotrBuilding) { this.buildingSelect.emit (building); }
  // onLandTileClick (landTile: WotrLand) { this.landTileClick.emit (landTile); }
  // onActionClick (action: WotrAction) { this.actionClick.emit (action); }
  onPassClick () { this.passClick.emit (); }
  onConfirmClick () { this.confirmClick.emit (); }
  onCancelClick () { this.cancelClick.emit (); }
  // onKnightsConfirm () {
  //   this.knightsConfirm.emit (this.numberOfKnights);
  //   this.numberOfKnights = 1;
  // } // onKnightsConfirm
  // onResourceSelect (resource: WotrResourceType) { this.resourceSelect.emit (resource); }

} // WotrBoardComponent
