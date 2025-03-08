import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TrackByFunction } from "@angular/core";
import { MatBottomSheet, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { immutableUtil } from "@leobg/commons/utils";
import { Observable } from "rxjs";
import { BritAreaId, BritNationId } from "../brit-components.models";
import { BritAreaLeader, BritAreaState, BritAreaUnit, BritLog, BritNationState, BritPlayer } from "../brit-game-state.models";
import { BritNationCardSheetComponent } from "./brit-nation-card-sheet.component";
import { BritUnitsSelectorSheetComponent, BritUnitsSelectorSheetInput } from "./brit-units-selector-sheet.component";

@Component ({
  selector: "brit-board",
  templateUrl: "./brit-board.component.html",
  styleUrls: ["./brit-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BritBoardComponent {
  constructor (private bottomSheet: MatBottomSheet) {}

  @Input () areaStates!: Record<BritAreaId, BritAreaState>;
  @Input () nationStates!: Record<BritNationId, BritNationState>;
  @Input () players!: BritPlayer[];
  @Input () logs!: BritLog[];
  @Input () turnPlayer: BritPlayer | null = null;
  @Input () currentPlayer: BritPlayer | null = null;
  // @Input () otherPlayers!: BaronyPlayer[];
  @Input () message: string | null = null;
  @Input () validAreas: BritAreaId[] | null = null;
  @Input () validUnits: BritAreaUnit[] | null = null;
  @Input () selectedUnits: BritAreaUnit[] | null = null;
  // @Input () validActions: BaronyAction[] | null = null;
  // @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  // @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  @Input () canPass: boolean = false;
  @Input () canConfirm: boolean = false;
  @Input () canCancel: boolean = false;

  @Output () playerSelect = new EventEmitter<BritPlayer> ();
  // @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  @Output () areaClick = new EventEmitter<BritAreaId> ();
  @Output () unitClick = new EventEmitter<BritAreaUnit> ();
  @Output () selectedUnitsChange = new EventEmitter<BritAreaUnit[]> ();
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () confirmClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();
  // @Output () knightsConfirm = new EventEmitter<number> ();
  // @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();

  playerTrackBy: TrackByFunction<BritPlayer> = (index, player) => player.id;

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;

  onPlayerSelect (player: BritPlayer) {
    this.playerSelect.emit (player);
  }
  // onBuildingSelect (building: BritBuilding) { this.buildingSelect.emit (building); }
  // onLandTileClick (landTile: BritLand) { this.landTileClick.emit (landTile); }
  // onActionClick (action: BritAction) { this.actionClick.emit (action); }
  onPassClick () {
    this.passClick.emit ();
  }
  onConfirmClick () {
    this.confirmClick.emit ();
  }
  onCancelClick () {
    this.cancelClick.emit ();
  }
  // onKnightsConfirm () {
  //   this.knightsConfirm.emit (this.numberOfKnights);
  //   this.numberOfKnights = 1;
  // } // onKnightsConfirm
  // onResourceSelect (resource: BritResourceType) { this.resourceSelect.emit (resource); }

  private lastBottomSheet: "nation-card" | "unit-number-selection" | null =
    null;

  onPlayerNationClick (nationId: BritNationId) {
    const openedRef: MatBottomSheetRef<
    BritNationCardSheetComponent,
    [BritNationId, BritNationState]
    > | null =
      this.lastBottomSheet === "nation-card"
        ? this.bottomSheet._openedBottomSheetRef
        : null;
    const nationState = this.nationStates[nationId];
    if (openedRef) {
      openedRef.instance.setNation (nationId, nationState);
    } else {
      this.lastBottomSheet = "nation-card";
      this.bottomSheet.open<
      BritNationCardSheetComponent,
      [BritNationId, BritNationState],
      void
      > (BritNationCardSheetComponent, {
        data: [nationId, nationState],
        panelClass: "brit-nation-card-sheet",
        hasBackdrop: false,
      });
    } // if - else
  } // onPlayerNationClick

  onUnitClick (unit: BritAreaUnit) {
    if (this.selectedUnits) {
      const unitId = this.getUnitNodeId (unit);
      const selectedIndex = this.selectedUnits.findIndex (
        (u) => this.getUnitNodeId (u) === unitId
      );
      const selectedUnit =
        selectedIndex >= 0 ? this.selectedUnits[selectedIndex] : null;
      const newSelectedUnits =
        selectedIndex >= 0
          ? immutableUtil.listRemoveByIndex (selectedIndex, this.selectedUnits)
          : [...this.selectedUnits];
      if (unit.type === "leader" || unit.quantity === 1) {
        if (!selectedUnit) {
          newSelectedUnits.push (unit);
        }
        this.selectedUnitsChange.emit (newSelectedUnits);
      } else {
        this.lastBottomSheet = "unit-number-selection";
        this.nSelectedUnits$ (
          unit,
          selectedUnit
            ? (selectedUnit as Exclude<BritAreaUnit, BritAreaLeader>).quantity
            : 1,
          unit.quantity
        ).subscribe ((quantity) => {
          if (quantity != null) {
            if (quantity > 0) {
              newSelectedUnits.push ({ ...unit, quantity });
            }
            this.selectedUnitsChange.emit (newSelectedUnits);
          } // if
        });
      } // if - else
    } else {
      this.unitClick.emit (unit);
    } // if - else
  } // onUnitClick

  private getUnitNodeId (unit: BritAreaUnit) {
    return unit.type === "leader"
      ? unit.leaderId
      : `${unit.nationId}-${unit.type}-${unit.areaId}`;
  } // getUnitNodeId

  private nSelectedUnits$ (
    unit: BritAreaUnit,
    quantity: number,
    maxQuantity: number
  ): Observable<number | undefined> {
    this.lastBottomSheet = "unit-number-selection";
    const ref = this.bottomSheet.open<
    BritUnitsSelectorSheetComponent,
    BritUnitsSelectorSheetInput,
    number
    > (BritUnitsSelectorSheetComponent, {
      data: { unit, quantity, maxQuantity },
      panelClass: "brit-unit-number-selection-sheet",
      hasBackdrop: true,
    });
    return ref.afterDismissed ();
  } // nUnitsSelector$
} // BritBoardComponent
