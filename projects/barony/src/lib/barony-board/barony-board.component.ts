import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ExhaustingEvent, SimpleChanges, UntilDestroy } from "@leobg/commons/utils";
import { of, switchMap } from "rxjs";
import { BaronyAction, BaronyBuilding, BaronyLand, BaronyLandCoordinates, BaronyLog, BaronyPlayer, BaronyResourceType } from "../barony-models";
import { BaronyMapComponent } from "../barony-map/barony-map.component";
import { NgIf, NgFor, NgClass } from "@angular/common";
import { BaronyKnightsSelectorComponent } from "../barony-knights-selector/barony-knights-selector.component";
import { BaronyBuildingsSelectorComponent } from "../barony-buildings-selector/barony-buildings-selector.component";
import { BaronyResourcesSelectorComponent } from "../barony-resources-selector/barony-resources-selector.component";
import { BaronyActionsComponent } from "../barony-actions/barony-actions.component";
import { BaronyPlayerStatusComponent } from "../barony-player-status/barony-player-status.component";
import { BgMapZoomButtonsComponent } from "../../../../commons/src/lib/game/svg/bg-map-zoom-buttons.component";
import { BaronyScoreboardComponent } from "../barony-scoreboard.component";
import { BaronyLogsComponent } from "../barony-logs/barony-logs.component";
import { BaronyEndGameComponent } from "../barony-end-game/barony-end-game.component";

@Component ({
  selector: "barony-board",
  templateUrl: "./barony-board.component.html",
  styleUrls: ["./barony-board.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BaronyMapComponent, NgIf, BaronyKnightsSelectorComponent, BaronyBuildingsSelectorComponent, BaronyResourcesSelectorComponent, BaronyActionsComponent, NgFor, BaronyPlayerStatusComponent, BgMapZoomButtonsComponent, BaronyScoreboardComponent, BaronyLogsComponent, NgClass, BaronyEndGameComponent]
})
@UntilDestroy
export class BaronyBoardComponent implements OnChanges, OnDestroy {
  constructor (private matDialog: MatDialog) {}

  @Input () lands!: BaronyLand[];
  @Input () logs!: BaronyLog[];
  @Input () turnPlayer: BaronyPlayer | null = null;
  @Input () currentPlayer: BaronyPlayer | null = null;
  @Input () players!: BaronyPlayer[];
  @Input () message: string | null = null;
  @Input () validLands: BaronyLandCoordinates[] | null = null;
  @Input () validActions: BaronyAction[] | null = null;
  @Input () validBuildings: ("stronghold" | "village")[] | null = null;
  @Input () validResources: {
    player: string;
    resources: BaronyResourceType[];
  } | null = null;
  @Input () canPass: boolean = false;
  @Input () canCancel: boolean = false;
  @Input () maxNumberOfKnights: number | null = null;
  @Input () endGame: boolean = false;

  @Output () playerSelect = new EventEmitter<BaronyPlayer> ();
  @Output () buildingSelect = new EventEmitter<BaronyBuilding> ();
  @Output () landTileClick = new EventEmitter<BaronyLand> ();
  @Output () actionClick = new EventEmitter<BaronyAction> ();
  @Output () passClick = new EventEmitter<void> ();
  @Output () cancelClick = new EventEmitter<void> ();
  @Output () knightsConfirm = new EventEmitter<number> ();
  @Output () resourceSelect = new EventEmitter<BaronyResourceType> ();

  @ViewChild ("endGameDialog") endGameDialog!: TemplateRef<void>;

  summaryFixed = false;
  logsFixed = false;
  zoomFixed = false;
  scoreboardFixed = false;

  numberOfKnights = 1;

  playerTrackBy = (player: BaronyPlayer) => player.id;

  ngOnChanges (changes: SimpleChanges<this>): void {
    if (changes.maxNumberOfKnights) {
      this.numberOfKnights = this.maxNumberOfKnights || 0;
    } // if
    if (changes.endGame && this.endGame) {
      this.openEndGameDialog ();
    } // if
  } // ngOnChanges

  ngOnDestroy () {}

  onPlayerSelect (player: BaronyPlayer) {
    this.playerSelect.emit (player);
  }
  onBuildingSelect (building: BaronyBuilding) {
    this.buildingSelect.emit (building);
  }
  onLandTileClick (landTile: BaronyLand) {
    this.landTileClick.emit (landTile);
  }
  onActionClick (action: BaronyAction) {
    this.actionClick.emit (action);
  }
  onPassClick () {
    this.passClick.emit ();
  }
  onCancelClick () {
    this.cancelClick.emit ();
  }
  onKnightsConfirm () {
    this.knightsConfirm.emit (this.numberOfKnights);
    this.numberOfKnights = 1;
  } // onKnightsConfirm
  onResourceSelect (resource: BaronyResourceType) {
    this.resourceSelect.emit (resource);
  }

  @ExhaustingEvent ()
  private openEndGameDialog () {
    return of (void 0).pipe (
      switchMap (() => {
        const dialogRef = this.matDialog.open (this.endGameDialog, {
          width: "80vw",
          maxWidth: "80vw",
          // data: {
          //   protoGame: game,
          //   createGame$: (protoGame, protoPlayers) => this.createGame$ (protoGame, protoPlayers),
          //   deleteGame$: gameId => this.deleteGame$ (gameId),
          //   roleToCssClass: role => this.config.playerRoleCssClass (role)
          // }
        });
        return dialogRef
          .afterClosed ()
          .pipe
          // switchMap (output => {
          //   if (output?.startGame) {
          //     return this.config.startGame$ (output.gameId);
          //   } // if
          //   return of (void 0);
          // })
          ();
      })
    );
  } // openEndGameDialog
} // BaronyBoardComponent
