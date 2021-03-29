import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";
import { SimpleChanges } from "@bg-utils";
import { BaronyAction, BaronyBuilding, BaronyLand, BaronyLandCoordinates, BaronyLog, BaronyPlayer, BaronyResourceType } from "../models";

@Component ({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyBoardComponent implements OnChanges {

  constructor () { }

  @Input () lands!: BaronyLand[];
  @Input () logs!: BaronyLog[];
  @Input () turnPlayer: BaronyPlayer | null = null;
  @Input () currentPlayer: BaronyPlayer | null = null;
  @Input () otherPlayers!: BaronyPlayer[];
  @Input () message: string | null = null;
  @Input () validLands: BaronyLandCoordinates[] | null = null;
  @Input () validActions: BaronyAction[] | null = null;
  @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  @Input () canPass: boolean = false;
  @Input () canCancel: boolean = false;
  @Input () maxNumberOfKnights: number | null = null;

  @Output () playerSelect = new EventEmitter<BaronyPlayer> ();
  @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  @Output () landTileClick = new EventEmitter<BaronyLand> ();
  @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();
  @Output () knightsConfirm = new EventEmitter<number> ();
  @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();

  summaryFixed = false;
  numberOfKnights = 1;

  playerTrackBy = (player: BaronyPlayer) => player.id;

  ngOnChanges (changes: SimpleChanges<BaronyBoardComponent>): void {
    if (changes.maxNumberOfKnights) {
      this.numberOfKnights = this.maxNumberOfKnights || 0;
    } // if
  } // ngOnInit

  onPlayerSelect (player: BaronyPlayer) { this.playerSelect.emit (player); }
  onBuildingSelect (building: BaronyBuilding) { this.buildingSelect.emit (building); }
  onLandTileClick (landTile: BaronyLand) { this.landTileClick.emit (landTile); }
  onActionClick (action: BaronyAction) { this.actionClick.emit (action); }
  onPassClick () { this.passClick.emit (); }
  onCancelClick () { this.cancelClick.emit (); }
  onKnightsConfirm () {
    this.knightsConfirm.emit (this.numberOfKnights);
    this.numberOfKnights = 1;
  } // onKnightsConfirm
  onResourceSelect (resource: BaronyResourceType) { this.resourceSelect.emit (resource); }

} // BaronyBoardComponent
