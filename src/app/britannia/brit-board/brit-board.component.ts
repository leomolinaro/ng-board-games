import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SimpleChanges } from "@bg-utils";
import { BritArea, BritLog, BritNation, BritPlayer, BritRound, BritUnit, BritUnitId } from "../brit-models";

@Component ({
  selector: "brit-board",
  templateUrl: "./brit-board.component.html",
  styleUrls: ["./brit-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritBoardComponent {

  constructor () { }

  @Input () areas!: BritArea[];
  @Input () nations!: BritNation[];
  @Input () rounds!: BritRound[];
  @Input () unitsMap!: Record<BritUnitId, BritUnit>;
  @Input () players!: BritPlayer[];
  @Input () logs!: BritLog[];
  @Input () turnPlayer: BritPlayer | null = null;
  @Input () currentPlayer: BritPlayer | null = null;
  // @Input () otherPlayers!: BaronyPlayer[];
  @Input () message: string | null = null;
  // @Input () validLands: BaronyLandCoordinates[] | null = null;
  // @Input () validActions: BaronyAction[] | null = null;
  // @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  // @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  @Input () canPass: boolean = false;
  @Input () canCancel: boolean = false;

  // @Output () playerSelect = new EventEmitter<BaronyPlayer> ();
  // @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  // @Output () landTileClick = new EventEmitter<BaronyLand> ();
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  // @Output () passClick = new EventEmitter<void> ();
  // @Output () cancelClick = new EventEmitter<void> ();
  // @Output () knightsConfirm = new EventEmitter<number> ();
  // @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;
  
  numberOfKnights = 1;

  ngOnChanges (changes: SimpleChanges<BritBoardComponent>): void {
  } // ngOnChanges

  // onPlayerSelect (player: BaronyPlayer) { this.playerSelect.emit (player); }
  // onBuildingSelect (building: BaronyBuilding) { this.buildingSelect.emit (building); }
  // onLandTileClick (landTile: BaronyLand) { this.landTileClick.emit (landTile); }
  // onActionClick (action: BaronyAction) { this.actionClick.emit (action); }
  // onPassClick () { this.passClick.emit (); }
  // onCancelClick () { this.cancelClick.emit (); }
  // onKnightsConfirm () {
  //   this.knightsConfirm.emit (this.numberOfKnights);
  //   this.numberOfKnights = 1;
  // } // onKnightsConfirm
  // onResourceSelect (resource: BaronyResourceType) { this.resourceSelect.emit (resource); }

} // BritBoardComponent
