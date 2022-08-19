import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { SimpleChanges } from "@bg-utils";
import { BritArea, BritAreaId, BritLog, BritNation, BritNationId, BritPlayer, BritRound, BritUnit, BritUnitId } from "../brit-models";
import { BritNationCardSheetComponent } from "./brit-nation-card-sheet.component";

@Component ({
  selector: "brit-board",
  templateUrl: "./brit-board.component.html",
  styleUrls: ["./brit-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BritBoardComponent {

  constructor (
    private bottomSheet: MatBottomSheet
  ) { }

  @Input () areas!: BritArea[];
  @Input () nations!: BritNation[];
  @Input () rounds!: BritRound[];
  @Input () unitsMap!: Record<BritUnitId, BritUnit>;
  @Input () nationsMap!: Record<BritNationId, BritNation>;
  @Input () players!: BritPlayer[];
  @Input () logs!: BritLog[];
  @Input () turnPlayer: BritPlayer | null = null;
  @Input () currentPlayer: BritPlayer | null = null;
  // @Input () otherPlayers!: BaronyPlayer[];
  @Input () message: string | null = null;
  @Input () validAreas: BritAreaId[] | null = null;
  @Input () validUnits: BritUnitId[] | null = null;
  // @Input () validActions: BaronyAction[] | null = null;
  // @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  // @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  @Input () canPass: boolean = false;
  @Input () canCancel: boolean = false;

  @Output () playerSelect = new EventEmitter<BritPlayer> ();
  // @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  @Output () areaClick = new EventEmitter<BritAreaId> ();
  @Output () unitClick = new EventEmitter<BritUnitId> ();
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();
  // @Output () knightsConfirm = new EventEmitter<number> ();
  // @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();

  playerTrackBy: TrackByFunction<BritPlayer> = (index, player) => player.id;

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;

  ngOnChanges (changes: SimpleChanges<BritBoardComponent>): void {
  } // ngOnChanges

  onPlayerSelect (player: BritPlayer) { this.playerSelect.emit (player); }
  // onBuildingSelect (building: BritBuilding) { this.buildingSelect.emit (building); }
  // onLandTileClick (landTile: BritLand) { this.landTileClick.emit (landTile); }
  // onActionClick (action: BritAction) { this.actionClick.emit (action); }
  onPassClick () { this.passClick.emit (); }
  onCancelClick () { this.cancelClick.emit (); }
  // onKnightsConfirm () {
  //   this.knightsConfirm.emit (this.numberOfKnights);
  //   this.numberOfKnights = 1;
  // } // onKnightsConfirm
  // onResourceSelect (resource: BritResourceType) { this.resourceSelect.emit (resource); }

  onPlayerNationClick (nation: BritNation) {
    const openedRef: MatBottomSheetRef<BritNationCardSheetComponent, BritNation> | null = this.bottomSheet._openedBottomSheetRef;
    if (openedRef) {
      openedRef.instance.setNation (nation);
    } else {
      this.bottomSheet.open (BritNationCardSheetComponent, {
        data: nation,
        panelClass: "brit-nation-card-sheet",
        hasBackdrop: false
      });
    } // if - else
  } // onPlayerNationClick

} // BritBoardComponent
