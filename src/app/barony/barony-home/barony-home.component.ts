import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExhaustingEvent, Loading, UntilDestroy } from "@bg-utils";
import { forkJoin, Observable } from "rxjs";
import { map, mapTo, switchMap, tap } from "rxjs/operators";
import { BgAuthService } from "src/app/bg-services/bg-auth.service";
import { BaronyGameDoc, BaronyRemoteService } from "../barony-remote.service";
import { getRandomLands } from "../logic/barony-initializer";
import { BaronyNewGame } from "./barony-home.models";

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
    private cd: ChangeDetectorRef
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
    return this.remote.insertGame$ (newGame.name, user.id).pipe (
      tap ((gameDoc) => {
        newGame = {
          ...newGame,
          id: gameDoc.id,
        };
        this.cd.markForCheck ();
      })
    );
  } // onCreateGameClick

  private openNewPlayersDialog$ () {
    // this.playerTypeOptions = this.newGame.type === "local" ?
    //   playerTypeOptions :
    //   playerTypeOptions.filter (o => !o.notOffline);

    // players: [
    //   { userId: user.id, name: this.authService.getUser ().displayName, color: "blue", type: "local" },
    //   { userId: null, name: "", color: "red", type: "closed" },
    //   { userId: null, name: "", color: "green", type: "closed" },
    //   { userId: null, name: "", color: "yellow", type: "closed" },
    // ]
  } // openNewPlayersDialog$

  private createNewGame$ (config: BaronyNewGame) {
    return this.remote.insertGame$ ("Partita", config.userId).pipe (
      switchMap (game => forkJoin ([
        ...config.players.map ((p, index) => this.remote.insertPlayer$ (p.name, p.color, p.type === "ai", index + 1, p.userId, game.id)),
        ...getRandomLands (config.players.length).map (l => this.remote.insertLand$ (l.coordinates, l.type, game.id))
      ])),
      mapTo (void 0)
    );
  } // createNewGame$

  @ExhaustingEvent ()
  onDeleteGame (game: BaronyGameDoc) {
    return this.remote.deleteGame$ (game.id);
  } // onDeleteGame

  onEnterGame (game: BaronyGameDoc) {
    this.router.navigate (["game", game.id], { relativeTo: this.activatedRoute });
  } // onEnterGame

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
