import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatExpansionPanel } from "@angular/material/expansion";
import { BgAuthService } from "@bg-services";
import { concatJoin, ExhaustingEvent, Loading, UntilDestroy } from "@bg-utils";
import { forkJoin, Observable, of } from "rxjs";
import { map, mapTo, switchMap } from "rxjs/operators";
import { BgArcheoGame, BgBoardGame, BgProtoGame, BgProtoGameService, BgProtoPlayer } from "../../bg-services/bg-proto-game.service";
import { BgHomeRoomDialogComponent, BgRoomDialogInput, BgRoomDialogOutput } from "./bg-home-room-dialog/bg-home-room-dialog.component";

export interface BgHomeConfig {
  boardGame: BgBoardGame;
  boardGameName: string;
  startGame$: (gameId: string) => Observable<any>;
  deleteGame$: (gameId: string) => Observable<any>;
  createGame$: (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer[]) => Observable<any>;
} // BgHomeConfig

@Component ({
  selector: "bg-home",
  templateUrl: "./bg-home.component.html",
  styleUrls: ["./bg-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BgHomeComponent implements OnInit, OnDestroy {

  constructor (
    private breakpointObserver: BreakpointObserver,
    private protoGameService: BgProtoGameService,
    private authService: BgAuthService,
    private matDialog: MatDialog
  ) { }

  @Input () config!: BgHomeConfig;
  @ViewChild ("archeoFormPanel") archeoFormPanel!: MatExpansionPanel;

  @Loading () loading$!: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe (Breakpoints.Handset)
  .pipe (map (result => result.matches));

  archeoGame: BgArcheoGame = this.getDefaultArcheoGame ();
  archeoGameValid = false;

  protoGames$!: Observable<BgProtoGame[]>;
  gameColumns = ["run", "name", "state", "owner", "delete"];

  ngOnInit (): void {
    this.protoGames$ = this.protoGameService.selectProtoGames$ (
      ref => ref.where ("boardGame", "==", this.config.boardGame)
    );
  } // ngOnInit

  ngOnDestroy () { }

  onArcheoGameChange (archeoGame: BgArcheoGame) {
    this.archeoGame = archeoGame;
    this.archeoGameValid = !!archeoGame.name;
  } // onArcheoGameChange

  @ExhaustingEvent ()
  onCreateGame () {
    const archeoGame = this.archeoGame;
    if (archeoGame) {
      const user = this.authService.getUser ();
      const protoGame: Omit<BgProtoGame, "id"> = {
        ...archeoGame,
        boardGame: this.config.boardGame,
        owner: user,
        state: "open"
      };
      this.archeoFormPanel.close ();
      this.archeoGame = this.getDefaultArcheoGame ();
      return this.protoGameService.insertProtoGame$ (protoGame).pipe (
        switchMap (protoGame => forkJoin ([
          this.insertProtoPlayer$ ("1", "yellow", protoGame.id),
          this.insertProtoPlayer$ ("2", "blue", protoGame.id),
          this.insertProtoPlayer$ ("3", "red", protoGame.id),
          this.insertProtoPlayer$ ("4", "green", protoGame.id)
        ]).pipe (mapTo (protoGame))),
        switchMap (pg => this.playersRoom$ (pg))
      );
    } // if
    return of (void 0);
  } // onCreateGame

  private getDefaultArcheoGame () {
    return {
      name: "",
      online: false
    };
  } // getDefaultArcheoGame

  private insertProtoPlayer$ (id: string, color: any/*TODO*/, gameId: string) {
    const player: BgProtoPlayer = {
      id: id,
      color: color,
      name: "",
      controller: null,
      type: "closed",
      ready: false
    };
    return this.protoGameService.insertProtoPlayer$ (player, gameId);
  } // insertProtoPlayer$

  @ExhaustingEvent ()
  onDeleteGame (game: BgProtoGame) {
    return this.deleteGame$ (game.id);
  } // onDeleteGame

  @ExhaustingEvent ()
  onEnterGame (game: BgProtoGame) {
    if (game.state === "closed") {
      return this.config.startGame$ (game.id);
    } else {
      return this.playersRoom$ (game);
    } // if - else
  } // onEnterGame

  private playersRoom$ (game: BgProtoGame) {
    const dialogRef = this.matDialog.open<BgHomeRoomDialogComponent, BgRoomDialogInput, BgRoomDialogOutput> (
      BgHomeRoomDialogComponent,
      {
        width: "1000px",
        data: {
          protoGame: game,
          createGame$: (protoGame, protoPlayers) => this.createGame$ (protoGame, protoPlayers),
          deleteGame$: gameId => this.deleteGame$ (gameId)
        }
      }
    );
    return dialogRef.afterClosed ().pipe (
      switchMap (output => {
        if (output?.startGame) {
          return this.config.startGame$ (output.gameId);
        } // if
        return of (void 0);
      })
    );
  } // playersRoom$

  private createGame$ (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer[]) {
    const activeProtoPlayers = protoPlayers
      .filter (p => p.type === "me" || p.type === "other" || p.type === "ai");
      return this.protoGameService.updateProtoGame$ ({ state: "closed" }, protoGame.id).pipe (
        switchMap (() => this.config.createGame$ (protoGame, activeProtoPlayers))
      );
  } // createGame$

  private deleteGame$ (gameId: string) {
    return concatJoin ([
      this.config.deleteGame$ (gameId),
      this.protoGameService.deleteProtoPlayers$ (gameId),
      this.protoGameService.deleteProtoGame$ (gameId),
    ]).pipe (mapTo (void 0));
  } // deleteGame$

} // BgHomeComponent
