import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, inject } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ExhaustingEvent, Loading, UntilDestroy, concatJoin } from "@leobg/commons/utils";
import { Observable, map, mapTo, of, switchMap, tap } from "rxjs";
import { BgAuthService } from "../../authentication";
import { BgArcheoGame, BgBoardGame, BgProtoGame, BgProtoGameService, BgProtoPlayer } from "../bg-proto-game.service";
import { BgHomeRoomDialogComponent, BgRoomDialogInput, BgRoomDialogOutput } from "./bg-home-room-dialog.component";
import { MatToolbar } from "@angular/material/toolbar";
import { BgAccountButtonComponent } from "../../authentication/bg-account-button.component";
import { NgIf, AsyncPipe } from "@angular/common";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatTable, MatColumnDef, MatCellDef, MatCell, MatRowDef, MatRow } from "@angular/material/table";
import { MatIconButton, MatFabButton, MatButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { BgIfUserDirective } from "../../authentication/bg-if-user-of.directive";
import { BgHomeArcheoGameFormComponent } from "./bg-home-archeo-game-form.component";

export interface BgHomeConfig<Pid extends string> {
  boardGame: BgBoardGame;
  boardGameName: string;
  startGame$: (gameId: string) => Observable<any>;
  deleteGame$: (gameId: string) => Observable<any>;
  createGame$: (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<Pid>[]) => Observable<any>;
  playerIds: () => Pid[];
  playerIdCssClass: (playerId: Pid) => string;
}

@Component ({
  selector: "bg-home",
  templateUrl: "./bg-home.component.html",
  styleUrls: ["./bg-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, BgAccountButtonComponent, NgIf, MatProgressBar, MatTable, MatColumnDef, MatCellDef, MatCell, MatIconButton, MatIcon, BgIfUserDirective, MatRowDef, MatRow, MatFabButton, BgHomeArcheoGameFormComponent, MatButton, AsyncPipe]
})
@UntilDestroy
export class BgHomeComponent<Pid extends string> implements OnInit, OnDestroy {
  
  private breakpointObserver = inject (BreakpointObserver);
  private protoGameService = inject (BgProtoGameService);
  private authService = inject (BgAuthService);
  private matDialog = inject (MatDialog);

  @Input () config!: BgHomeConfig<Pid>;
  @ViewChild ("newGameDialog") newGameDialog!: TemplateRef<void>;

  @Loading () loading$!: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe (Breakpoints.Handset)
    .pipe (map ((result) => result.matches));

  archeoGame: BgArcheoGame = this.getDefaultArcheoGame ();
  archeoGameValid = false;

  protoGames$!: Observable<BgProtoGame[]>;
  gameColumns = ["run", "name", "state", "owner", "delete"];

  private newGameDialogRef: MatDialogRef<void, any> | null = null;

  ngOnInit (): void {
    this.protoGames$ = this.protoGameService.selectProtoGames$ ((ref) =>
      ref.where ("boardGame", "==", this.config.boardGame)
    );
  }

  ngOnDestroy () {}

  @ExhaustingEvent ({ suppressLoading: true })
  openNewGameDialog () {
    return of (void 0).pipe (
      switchMap (() => {
        this.newGameDialogRef = this.matDialog.open (this.newGameDialog, {
          width: "250px",
          maxWidth: "80vw",
          // data: {
          //   protoGame: game,
          //   createGame$: (protoGame, protoPlayers) => this.createGame$ (protoGame, protoPlayers),
          //   deleteGame$: gameId => this.deleteGame$ (gameId),
          //   roleToCssClass: role => this.config.playerRoleCssClass (role)
          // }
        });
        return this.newGameDialogRef.afterClosed ().pipe (
          tap (() => (this.archeoGameValid = false))
          // switchMap (output => {
          //   if (output?.startGame) {
          //     return this.config.startGame$ (output.gameId);
          //   }
          //   return of (void 0);
          // })
        );
      })
    );
  }

  onArcheoGameChange (archeoGame: BgArcheoGame) {
    this.archeoGame = archeoGame;
    this.archeoGameValid = !!archeoGame.name;
  }

  @ExhaustingEvent ({ suppressLoading: true })
  onCreateGame () {
    const archeoGame = this.archeoGame;
    if (archeoGame) {
      const user = this.authService.getUser ();
      const protoGame: Omit<BgProtoGame, "id"> = {
        ...archeoGame,
        boardGame: this.config.boardGame,
        owner: user,
        state: "open",
      };
      this.newGameDialogRef?.close ();
      this.archeoGame = this.getDefaultArcheoGame ();
      return this.protoGameService.insertProtoGame$ (protoGame).pipe (
        switchMap (savedProtoGame => {
          const inserts: Observable<BgProtoPlayer<Pid>>[] = this.config.playerIds ()
            .map (id => this.insertProtoPlayer$ (id, savedProtoGame.id));
          return concatJoin (inserts).pipe (mapTo (savedProtoGame));
        }),
        switchMap ((pg) => this.playersRoom$ (pg))
      );
    }
    return of (void 0);
  }

  private getDefaultArcheoGame () {
    return {
      name: "",
      online: false,
    };
  }

  private insertProtoPlayer$ (id: Pid, gameId: string) {
    const player: BgProtoPlayer<Pid> = {
      id: id,
      name: "",
      controller: null,
      type: "closed",
      ready: false,
    };
    return this.protoGameService.insertProtoPlayer$ (player, gameId);
  }

  @ExhaustingEvent ()
  onDeleteGame (game: BgProtoGame) {
    return this.deleteGame$ (game.id);
  }

  @ExhaustingEvent ()
  onEnterGame (game: BgProtoGame) {
    if (game.state === "running") {
      return this.config.startGame$ (game.id);
    } else {
      return this.playersRoom$ (game);
    }
  }

  private playersRoom$ (game: BgProtoGame) {
    const dialogRef = this.matDialog.open<BgHomeRoomDialogComponent<Pid>, BgRoomDialogInput<Pid>, BgRoomDialogOutput> (BgHomeRoomDialogComponent, {
      width: "1000px",
      data: {
        protoGame: game,
        createGame$: (protoGame, protoPlayers) => this.createGame$ (protoGame, protoPlayers),
        deleteGame$: (gameId) => this.deleteGame$ (gameId),
        playerIdToCssClass: (role) => this.config.playerIdCssClass (role),
      },
    });
    return dialogRef.afterClosed ().pipe (
      switchMap ((output) => {
        if (output?.startGame) {
          return this.config.startGame$ (output.gameId);
        }
        return of (void 0);
      })
    );
  }

  private createGame$ (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<Pid>[]) {
    const activeProtoPlayers = protoPlayers.filter (
      (p) => p.type === "user" || p.type === "ai"
    );
    return this.config.createGame$ (protoGame, activeProtoPlayers).pipe (
      switchMap (() =>
        this.protoGameService.updateProtoGame$ (
          { state: "running" },
          protoGame.id
        )
      )
    );
  }

  private deleteGame$ (gameId: string) {
    return concatJoin ([
      this.config.deleteGame$ (gameId),
      this.protoGameService.deleteProtoPlayers$ (gameId),
      this.protoGameService.deleteProtoGame$ (gameId),
    ]).pipe (mapTo (void 0));
  }
  
}
