import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { immutableUtil, SimpleChanges } from "@bg-utils";
import { BritAreaId, BritNationId, BritUnitId } from "../brit-components.models";
import { BritAreaState, BritLog, BritNationState, BritPlayer } from "../brit-game-state.models";
import { BritNationCardSheetComponent } from "./brit-nation-card-sheet.component";
import { BritUnitsSelectorSheetComponent, BritUnitsSelectorSheetInput } from "./brit-units-selector-sheet.component";

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

  @Input () areaStates!: Record<BritAreaId, BritAreaState>;
  @Input () nationStates!: Record<BritNationId, BritNationState>;
  @Input () players!: BritPlayer[];
  @Input () logs!: BritLog[];
  @Input () turnPlayer: BritPlayer | null = null;
  @Input () currentPlayer: BritPlayer | null = null;
  // @Input () otherPlayers!: BaronyPlayer[];
  @Input () message: string | null = null;
  @Input () validAreas: BritAreaId[] | null = null;
  @Input () validUnits: BritUnitId[] | null = null;
  @Input () selectedUnits: BritUnitId[] | null = null;
  // @Input () validActions: BaronyAction[] | null = null;
  // @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  // @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  @Input () canPass: boolean = false;
  @Input () canCancel: boolean = false;

  @Output () playerSelect = new EventEmitter<BritPlayer> ();
  // @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  @Output () areaClick = new EventEmitter<BritAreaId> ();
  @Output () selectedUnitsChange = new EventEmitter<BritUnitId[]> ();
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

  private lastBottomSheet: "nation-card" | "unit-number-selection" | null = null;

  onPlayerNationClick (nationId: BritNationId) {
    const openedRef: MatBottomSheetRef<BritNationCardSheetComponent, [BritNationId, BritNationState]> | null =
      this.lastBottomSheet === "nation-card"
      ? this.bottomSheet._openedBottomSheetRef
      : null;
    const nationState = this.nationStates[nationId];
    if (openedRef) {
      openedRef.instance.setNation (nationId, nationState);
    } else {
      this.lastBottomSheet = "nation-card";
      this.bottomSheet.open<BritNationCardSheetComponent, [BritNationId, BritNationState], void> (BritNationCardSheetComponent, {
        data: [nationId, nationState],
        panelClass: "brit-nation-card-sheet",
        hasBackdrop: false
      });
    } // if - else
  } // onPlayerNationClick

  onUnitGroupClick (unitIds: BritUnitId[]) {
    let quantity = 0;
    let newSelectedUnits = this.selectedUnits?.length ? immutableUtil.listRemoveAll (u => {
      if (unitIds.includes (u)) {
        quantity++;
        return true;
      } else {
        return false;
      } // if - else
    }, this.selectedUnits) : [];
    if (unitIds.length > 1) {
      this.lastBottomSheet = "unit-number-selection";
      const ref = this.bottomSheet.open<BritUnitsSelectorSheetComponent, BritUnitsSelectorSheetInput, number> (BritUnitsSelectorSheetComponent, {
        data: {
          unitId: unitIds[0],
          quantity: quantity,
          maxQuantity: unitIds.length
        },
        panelClass: "brit-unit-number-selection-sheet",
        hasBackdrop: true
      });
      ref.afterDismissed ().subscribe (quantity => {
        if (quantity != null) {
          if (quantity > 0) {
            newSelectedUnits = immutableUtil.listPush (unitIds.slice (0, quantity), newSelectedUnits);
          } // if
          this.selectedUnitsChange.emit (newSelectedUnits);
        } // if
      });
    } else {
      if (!quantity) {
        newSelectedUnits = immutableUtil.listPush (unitIds, newSelectedUnits);
      } // if
      this.selectedUnitsChange.emit (newSelectedUnits);
    } // if - else
  } // onUnitGroupClick

} // BritBoardComponent
