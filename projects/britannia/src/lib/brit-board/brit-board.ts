import { Component, inject, input, output } from '@angular/core';
import { BgMapZoomButtons } from '@leobg/commons';
import { immutableUtil } from '@leobg/commons/utils';
import { TuiSheetDialogService } from '@taiga-ui/addon-mobile';
import { TuiIcon } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@taiga-ui/polymorpheus';
import type { Observable } from 'rxjs';
import type {
  BritAreaId,
  BritColor,
  BritNationId,
} from '../brit-components.models';
import type {
  BritAreaLeader,
  BritAreaState,
  BritAreaUnit,
  BritLog,
  BritNationState,
  BritPlayer,
} from '../brit-game-state.models';
import { BritMap } from '../brit-map/brit-map';
import { BritPlayerComponent } from '../brit-player/brit-player-area';
import { BritActionsComponent } from './brit-actions-area';
import { BritLogs } from './brit-logs';
import { BritNationCardSheet } from './brit-nation-card-sheet';
import { BritUnitsSelectorSheet } from './brit-units-selector-sheet';

@Component({
  selector: 'brit-board',
  templateUrl: './brit-board.html',
  styleUrls: ['./brit-board.scss'],
  imports: [
    BritMap,
    BritActionsComponent,
    BritPlayerComponent,
    BgMapZoomButtons,
    BritLogs,
    TuiIcon,
  ],
})
export class BritBoardComponent {
  private readonly sheets = inject(TuiSheetDialogService);

  readonly areaStates = input.required<Record<BritAreaId, BritAreaState>>();
  readonly nationStates =
    input.required<Record<BritNationId, BritNationState>>();
  readonly players = input.required<BritPlayer[]>();
  readonly logs = input.required<BritLog[]>();
  readonly turnPlayer = input<BritColor>();
  readonly currentPlayer = input<BritColor | null>(null);
  // @Input () otherPlayers!: BaronyPlayer[];
  readonly message = input<string | null>(null);
  readonly validAreas = input<BritAreaId[] | null>(null);
  readonly validUnits = input<BritAreaUnit[] | null>(null);
  readonly selectedUnits = input<BritAreaUnit[] | null>(null);
  // @Input () validActions: BaronyAction[] | null = null;
  // @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  // @Input () validResources: { player: string; resources: BaronyResourceType[]; } | null = null;
  readonly canPass = input<boolean>(false);
  readonly canConfirm = input<boolean>(false);
  readonly canCancel = input<boolean>(false);

  readonly playerSelect = output<BritPlayer>();
  // @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  readonly areaClick = output<BritAreaId>();
  readonly unitClick = output<BritAreaUnit>();
  readonly selectedUnitsChange = output<BritAreaUnit[]>();
  // @Output () actionClick = new EventEmitter<BaronyAction> ();
  readonly passClick = output<void>();
  readonly confirmClick = output<void>();
  readonly cancelClick = output<void>();
  // @Output () knightsConfirm = new EventEmitter<number> ();
  // @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;

  onPlayerSelect(player: BritPlayer): void {
    this.playerSelect.emit(player);
  }
  // onBuildingSelect (building: BritBuilding) { this.buildingSelect.emit (building); }
  // onLandTileClick (landTile: BritLand) { this.landTileClick.emit (landTile); }
  // onActionClick (action: BritAction) { this.actionClick.emit (action); }
  onPassClick(): void {
    this.passClick.emit();
  }
  onConfirmClick(): void {
    this.confirmClick.emit();
  }
  onCancelClick(): void {
    this.cancelClick.emit();
  }
  // onKnightsConfirm () {
  //   this.knightsConfirm.emit (this.numberOfKnights);
  //   this.numberOfKnights = 1;
  // }
  // onResourceSelect (resource: BritResourceType) { this.resourceSelect.emit (resource); }

  private lastBottomSheet: 'nation-card' | 'unit-number-selection' | null =
    null;

  onPlayerNationClick(nationId: BritNationId): void {
    const nationState = this.nationStates()?.[nationId];
    this.lastBottomSheet = 'nation-card';
    this.sheets
      .open<void>(new PolymorpheusComponent(BritNationCardSheet), {
        data: [nationId, nationState] satisfies [BritNationId, BritNationState],
      })
      .subscribe();
  }

  onUnitClick(unit: BritAreaUnit): void {
    const selectedUnits = this.selectedUnits();
    if (selectedUnits) {
      const unitId = this.getUnitNodeId(unit);
      const selectedIndex = selectedUnits.findIndex(
        (u) => this.getUnitNodeId(u) === unitId,
      );
      const selectedUnit =
        selectedIndex === -1 ? null : selectedUnits[selectedIndex];
      const newSelectedUnits =
        selectedIndex === -1
          ? [...selectedUnits]
          : immutableUtil.listRemoveByIndex(selectedIndex, selectedUnits);
      if (unit.type === 'leader' || unit.quantity === 1) {
        if (!selectedUnit) {
          newSelectedUnits.push(unit);
        }
        this.selectedUnitsChange.emit(newSelectedUnits);
      } else {
        this.lastBottomSheet = 'unit-number-selection';
        this.nSelectedUnits$(
          unit,
          selectedUnit
            ? (selectedUnit as Exclude<BritAreaUnit, BritAreaLeader>).quantity
            : 1,
          unit.quantity,
        ).subscribe((quantity) => {
          if (quantity == null) return;
          if (quantity > 0) newSelectedUnits.push({ ...unit, quantity });
          this.selectedUnitsChange.emit(newSelectedUnits);
        });
      }
    } else {
      this.unitClick.emit(unit);
    }
  }

  private getUnitNodeId(unit: BritAreaUnit): string {
    return unit.type === 'leader'
      ? unit.leaderId
      : `${unit.nationId}-${unit.type}-${unit.areaId}`;
  }

  private nSelectedUnits$(
    unit: BritAreaUnit,
    quantity: number,
    maxQuantity: number,
  ): Observable<number | undefined> {
    this.lastBottomSheet = 'unit-number-selection';
    return this.sheets.open<number | undefined>(
      new PolymorpheusComponent(BritUnitsSelectorSheet),
      {
        data: { unit, quantity, maxQuantity },
      },
    );
  }
}
