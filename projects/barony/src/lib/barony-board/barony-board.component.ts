import { NgClass } from "@angular/common";
import {
  Component,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewChild,
  inject,
  input,
  output
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ExhaustingEvent, SimpleChanges, UntilDestroy } from "@leobg/commons/utils";
import { of, switchMap } from "rxjs";
import { BgMapZoomButtonsComponent } from "../../../../commons/src/lib/game/svg/bg-map-zoom-buttons.component";
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
    BaronyEndGameComponent
  ]
})
@UntilDestroy
export class BaronyBoardComponent implements OnChanges, OnDestroy {
  private matDialog = inject(MatDialog);

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

  @ViewChild("endGameDialog") endGameDialog!: TemplateRef<void>;

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;
  scoreboardFixed = false;

  numberOfKnights = 1;

  ngOnChanges(changes: SimpleChanges<this>): void {
    if (changes.maxNumberOfKnights) {
      this.numberOfKnights = this.maxNumberOfKnights() || 0;
    }
    if (changes.endGame && this.endGame()) {
      this.openEndGameDialog();
    }
  }

  ngOnDestroy() {}

  onPlayerSelect(player: BaronyPlayer) {
    this.playerSelect.emit(player);
  }
  onBuildingSelect(building: BaronyBuilding) {
    this.buildingSelect.emit(building);
  }
  onLandTileClick(landTile: BaronyLand) {
    this.landTileClick.emit(landTile);
  }
  onActionClick(action: BaronyAction) {
    this.actionClick.emit(action);
  }
  onPassClick() {
    this.passClick.emit();
  }
  onCancelClick() {
    this.cancelClick.emit();
  }
  onKnightsConfirm() {
    this.knightsConfirm.emit(this.numberOfKnights);
    this.numberOfKnights = 1;
  }
  onResourceSelect(resource: BaronyResourceType) {
    this.resourceSelect.emit(resource);
  }

  @ExhaustingEvent()
  private openEndGameDialog() {
    return of(void 0).pipe(
      switchMap(() => {
        const dialogRef = this.matDialog.open(this.endGameDialog, {
          width: "80vw",
          maxWidth: "80vw"
          // data: {
          //   protoGame: game,
          //   createGame$: (protoGame, protoPlayers) => this.createGame$ (protoGame, protoPlayers),
          //   deleteGame$: gameId => this.deleteGame$ (gameId),
          //   roleToCssClass: role => this.config.playerRoleCssClass (role)
          // }
        });
        return dialogRef
          .afterClosed()
          .pipe
          // switchMap (output => {
          //   if (output?.startGame) {
          //     return this.config.startGame$ (output.gameId);
          //   }
          //   return of (void 0);
          // })
          ();
      })
    );
  }
}
