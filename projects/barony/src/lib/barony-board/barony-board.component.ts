import { NgClass } from "@angular/common";
import {
  Component,
  TemplateRef,
  effect,
  inject,
  input,
  linkedSignal,
  output,
  viewChild
} from "@angular/core";
import { BgMapZoomButtonsComponent } from "@leobg/commons";
import { TuiDialogService, TuiIcon } from "@taiga-ui/core";
import {
  BaronyAction,
  BaronyBuilding,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyLog,
  BaronyPlayer,
  BaronyResourceType
} from "../barony-models";
import { BaronyActionsComponent } from "./barony-actions.component";
import { BaronyBuildingsSelectorComponent } from "./barony-buildings-selector.component";
import { BaronyEndGameComponent } from "./barony-end-game/barony-end-game.component";
import { BaronyKnightsSelectorComponent } from "./barony-knights-selector.component";
import { BaronyLogsComponent } from "./barony-logs.component";
import { BaronyMapComponent } from "./barony-map/barony-map.component";
import { BaronyPlayerStatusComponent } from "./barony-player-status/barony-player-status.component";
import { BaronyResourcesSelectorComponent } from "./barony-resources-selector.component";
import { BaronyScoreboardComponent } from "./barony-scoreboard.component";

@Component({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"],
  imports: [
    BaronyMapComponent,
    BaronyKnightsSelectorComponent,
    BaronyBuildingsSelectorComponent,
    BaronyResourcesSelectorComponent,
    BaronyActionsComponent,
    BaronyPlayerStatusComponent,
    BgMapZoomButtonsComponent,
    BaronyScoreboardComponent,
    BaronyLogsComponent,
    NgClass,
    BaronyEndGameComponent,
    TuiIcon
  ]
})
export class BaronyBoardComponent {
  constructor() {
    effect(() => this.openEndGameDialog());
  }

  private readonly dialogs = inject(TuiDialogService);

  readonly lands = input.required<BaronyLand[]>();
  readonly logs = input.required<BaronyLog[]>();
  readonly turnPlayer = input<BaronyPlayer | null>(null);
  readonly currentPlayer = input<BaronyPlayer | null>(null);
  readonly players = input.required<BaronyPlayer[]>();
  readonly message = input<string | null>(null);
  readonly validLands = input<BaronyLandCoordinates[] | null>(null);
  readonly validActions = input<BaronyAction[] | null>(null);
  readonly validBuildings = input<("stronghold" | "village")[] | null>(null);
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

  protected endGameDialog = viewChild.required<TemplateRef<void>>("endGameDialog");

  protected summaryFixed = false;
  protected logsFixed = false;
  protected zoomFixed = false;
  protected scoreboardFixed = false;

  protected numberOfKnights = linkedSignal(() => this.maxNumberOfKnights() || 0);

  protected onPlayerSelect(player: BaronyPlayer) {
    this.playerSelect.emit(player);
  }
  protected onBuildingSelect(building: BaronyBuilding) {
    this.buildingSelect.emit(building);
  }
  protected onLandTileClick(landTile: BaronyLand) {
    this.landTileClick.emit(landTile);
  }
  protected onActionClick(action: BaronyAction) {
    this.actionClick.emit(action);
  }
  protected onPassClick() {
    this.passClick.emit();
  }
  protected onCancelClick() {
    this.cancelClick.emit();
  }
  protected onKnightsConfirm() {
    this.knightsConfirm.emit(this.numberOfKnights());
    this.numberOfKnights.set(1);
  }
  protected onResourceSelect(resource: BaronyResourceType) {
    this.resourceSelect.emit(resource);
  }

  private openEndGameDialog() {
    if (!this.endGame()) return;
    this.dialogs.open(this.endGameDialog(), { size: "l" }).subscribe();
  }
}
