import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ExhaustingEvent, Loading, UntilDestroy } from "@bg-utils";
import { from, Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { BgAuthService } from "src/app/bg-services/bg-auth.service";
import { BaronyGameDoc, BaronyRemoteService } from "../barony-remote.service";
import { BaronyNewGame } from "./barony-home.models";
import { BaronyRoomDialogComponent, BaronyRoomDialogInput, BaronyRoomDialogOutput } from "./barony-room-dialog/barony-room-dialog.component";

@Component ({
  selector: "app-barony-home",
  templateUrl: "./barony-home.component.html",
  styleUrls: ["./barony-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BaronyHomeComponent implements OnInit, OnDestroy {

  constructor (
    private authService: BgAuthService,
    private remote: BaronyRemoteService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private matDialog: MatDialog
  ) { }

  games$ = this.remote.gamesChanges$ ();
  
  newGameValid = false;
  playersCompleted = false;
  @Loading () loading$!: Observable<boolean>;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe (Breakpoints.Handset).pipe (map (result => result.matches));

  ngOnInit () { }
  ngOnDestroy () { }

  @ExhaustingEvent ()
  onCreateGame (newGame: BaronyNewGame) {
    const user = this.authService.getUser ();
    return this.remote.insertGame$ (newGame.name, user, newGame.type === "local").pipe (
      switchMap (gameDoc => this.openNewPlayersDialog$ (gameDoc)),
      switchMap (output => output?.startGame ? this.runGame$ (output.gameId) : of (void 0))
    );
  } // onCreateGameClick

  private openNewPlayersDialog$ (game: BaronyGameDoc): Observable<BaronyRoomDialogOutput | undefined> {
    const dialogRef = this.matDialog.open<BaronyRoomDialogComponent, BaronyRoomDialogInput, BaronyRoomDialogOutput> (
      BaronyRoomDialogComponent,
      {
        width: "1000px",
        data: { game }
      }
    );
    return dialogRef.afterClosed ();
  } // openNewPlayersDialog$

  // private createNewGame$ (config: BaronyNewGame) {
  //   return this.remote.insertGame$ ("Partita", config.userId).pipe (
  //     switchMap (game => forkJoin ([
  //       ...config.players.map ((p, index) => this.remote.insertPlayer$ (p.name, p.color, p.type === "ai", index + 1, p.userId, game.id)),
  //       ...getRandomLands (config.players.length).map (l => this.remote.insertLand$ (l.coordinates, l.type, game.id))
  //     ])),
  //     mapTo (void 0)
  //   );
  // } // createNewGame$

  @ExhaustingEvent ()
  onDeleteGame (game: BaronyGameDoc) {
    return this.remote.deleteGame$ (game.id);
  } // onDeleteGame

  @ExhaustingEvent ()
  onEnterGame (gameDoc: BaronyGameDoc) {
    if (gameDoc.state === "open") {
      return this.openNewPlayersDialog$ (gameDoc).pipe (
        switchMap (output => output?.startGame ? this.runGame$ (output.gameId) : of (void 0))
      );
    } else {
      return this.runGame$ (gameDoc.id);
    } // if - else
  } // onEnterGame

  private runGame$ (gameId: string) {
    return from (this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute }));
  } // runGame$

  // onPlayerChange (player: BaronyNewPlayer, index: number) {
  //   this.newGame = {
  //     ...this.newGame,
  //     players: immutableUtil.listReplaceByIndex (index, player, this.newGame.players)
  //   };
  // } // onPlayerChange

  // @ExhaustingEvent ()
  // onDeleteNewGameClick () {
  //   return this.remote.deleteGame$ (this.newGame.id as string).pipe (
  //     tap (() => {
  //       this.selectedStepIndex = 0;
  //       this.newGame = {
  //         ...this.newGame,
  //         players: []
  //       };
  //       this.cd.markForCheck ();
  //     })
  //   );
  // } // onDeleteNewGameClick

  // onStartNewGameClick () {
  //   this.selectedStepIndex = 1;
  // } // onStartNewGameClick

} // BaronyHomeComponent
