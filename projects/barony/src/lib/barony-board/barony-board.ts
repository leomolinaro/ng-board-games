import {
  Component,
  effect,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { BgDialogService, BgMapZoomButtons } from '@leobg/commons';
import { TuiIcon } from '@taiga-ui/core';
import type {
  BaronyAction,
  BaronyBuilding,
  BaronyColor,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyLog,
  BaronyPlayer,
  BaronyResourceType,
} from '../barony-models';
import { BaronyActionsArea } from './barony-actions';
import { BaronyBuildingsSelector } from './barony-buildings-selector';
import { BaronyEndGameDialog } from './barony-end-game-dialog';
import { BaronyKnightsSelector } from './barony-knights-selector';
import { BaronyLogs } from './barony-logs';
import { BaronyMap } from './barony-map';
import { BaronyPlayerArea } from './barony-player-area/barony-player-area';
import { BaronyResourcesSelector } from './barony-resources-selector';
import { BaronyScoreboard } from './barony-scoreboard';

@Component({
  selector: 'barony-board',
  imports: [
    BaronyMap,
    BaronyKnightsSelector,
    BaronyBuildingsSelector,
    BaronyResourcesSelector,
    BaronyActionsArea,
    BaronyPlayerArea,
    BgMapZoomButtons,
    BaronyScoreboard,
    BaronyLogs,
    TuiIcon,
  ],
  templateUrl: './barony-board.html',
  styleUrls: ['./barony-board.scss'],
})
export class BaronyBoard {
  constructor() {
    effect(() => {
      this.openEndGameDialog();
    });
  }

  private readonly dialogs = inject(BgDialogService);

  readonly lands = input.required<BaronyLand[]>();
  readonly logs = input.required<BaronyLog[]>();
  readonly turnPlayer = input<BaronyColor>();
  readonly currentPlayer = input<BaronyColor | null>(null);
  readonly players = input.required<BaronyPlayer[]>();
  readonly message = input<string | null>(null);
  readonly validLands = input<BaronyLandCoordinates[] | null>(null);
  readonly validActions = input<BaronyAction[] | null>(null);
  readonly validBuildings = input<('stronghold' | 'village')[] | null>(null);
  readonly validResources = input<{
    player: string;
    resources: BaronyResourceType[];
  } | null>(null);
  readonly canPass = input<boolean>(false);
  readonly canCancel = input<boolean>(false);
  readonly maxNumberOfKnights = input<number | null>(null);
  readonly endGame = input<boolean>(false);

  readonly playerSelect = output<BaronyPlayer>();
  readonly buildingSelect = output<BaronyBuilding>();
  readonly landTileClick = output<BaronyLand>();
  readonly actionClick = output<BaronyAction>();
  readonly passClick = output<void>();
  readonly cancelClick = output<void>();
  readonly knightsConfirm = output<number>();
  readonly resourceSelect = output<BaronyResourceType>();

  protected summaryFixed = false;
  protected logsFixed = false;
  protected zoomFixed = false;
  protected scoreboardFixed = false;

  protected numberOfKnights = linkedSignal(
    () => this.maxNumberOfKnights() ?? 0,
  );

  protected onPlayerSelect(player: BaronyPlayer): void {
    this.playerSelect.emit(player);
  }
  protected onBuildingSelect(building: BaronyBuilding): void {
    this.buildingSelect.emit(building);
  }
  protected onLandTileClick(landTile: BaronyLand): void {
    this.landTileClick.emit(landTile);
  }
  protected onActionClick(action: BaronyAction): void {
    this.actionClick.emit(action);
  }
  protected onPassClick(): void {
    this.passClick.emit();
  }
  protected onCancelClick(): void {
    this.cancelClick.emit();
  }
  protected onKnightsConfirm(): void {
    this.knightsConfirm.emit(this.numberOfKnights());
    this.numberOfKnights.set(1);
  }
  protected onResourceSelect(resource: BaronyResourceType): void {
    this.resourceSelect.emit(resource);
  }

  private openEndGameDialog(): void {
    if (!this.endGame()) return;
    void this.dialogs.open(BaronyEndGameDialog, {
      label: 'End Game',
      data: {
        players: this.players(),
      },
      size: 'l',
    });
  }
}
