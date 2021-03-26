import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExhaustingEvent, immutableUtil, Loading, UntilDestroy } from "@bg-utils";
import { forkJoin, Observable, of } from "rxjs";
import { map, mapTo, switchMap, tap } from "rxjs/operators";
import { BgAuthService } from "src/app/bg-services/bg-auth.service";
import { BaronyRemoteService } from "../barony-remote.service";
import { getRandomLands } from "../logic/barony-initializer";
import { BaronyColor } from "../models";

interface BaronyNewGame {
  id: string | null;
  name: string;
  userId: string;
  players: BaronyNewPlayer[];
  type: BaronyNewGameType;
} // BaronyNewGame

interface BaronyNewPlayer {
  userId: string | null;
  name: string;
  color: BaronyColor;
  type: BaronyNewPlayerType;
} // BaronyNewPlayer

type BaronyNewGameType = "local" | "online";
type BaronyNewPlayerType = "local" | "open" | "closed" | "ai";

interface BaronyNewGameTypeOption {
  id: BaronyNewGameType;
  label: string;
} // BaronyNewGameTypeOption

interface BaronyNewPlayerTypeOption {
  id: BaronyNewPlayerType;
  label: string;
  notOffline: boolean;
} // BaronyNewPlayerTypeOption

const gameTypeOptions: BaronyNewGameTypeOption[] = [
  { id: "local", label: "Local" },
  { id: "online", label: "Online" }
];

const playerTypeOptions: BaronyNewPlayerTypeOption[] = [
  { id: "local", label: "Local", notOffline: false },
  { id: "open", label: "Open", notOffline: true },
  { id: "closed", label: "Closed", notOffline: false },
  { id: "ai", label: "AI", notOffline: false },
]; // playerTypeOptions

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

  remoteGames$ = this.remote.gamesChanges$ ();
  playerTypeOptions: BaronyNewPlayerTypeOption[] = [];
  gameTypeOptions = gameTypeOptions;
  newGameCompleted = false;
  playersCompleted = false;
  selectedStepIndex = 0;

  @Loading ()
  loading$!: Observable<boolean>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe (Breakpoints.Handset)
  .pipe (map (result => result.matches));

  newGame: BaronyNewGame = {
    id: null,
    name: "",
    userId: this.authService.getUser ().id,
    type: "local",
    players: []
  };

  playerTrackBy = (index: number, player: BaronyNewPlayer) => index;

  ngOnInit (): void {
  } // ngOnInit

  ngOnDestroy () { }

  @ExhaustingEvent ()
  onNewGameClick (numPlayers: number) {
    return of (null);
    // return forkJoin ([
    //   this.authService.loadUserByUsername$ ("leo"),
    //   // this.authService.loadUserByUsername$ ("nico"),
    //   // this.authService.loadUserByUsername$ ("rob"),
    //   // this.authService.loadUserByUsername$ ("salvatore")
    // ]).pipe (
    //   switchMap (([leo/* , nico, rob, salvatore */]) => {
    //     const players: { name: string, isAi: boolean, color: BaronyColor, userId: string }[] = [];
    //     if (leo/*  && nico && rob && salvatore */) {
    //       players.push ({ name: "Leo", color: "blue", isAi: false, userId: leo.id });
    //       players.push ({ name: "Nico", color: "red", isAi: false, userId: leo.id });
    //       if (numPlayers > 2) { players.push ({ name: "Rob", color: "green", isAi: false, userId: leo.id }); }
    //       if (numPlayers > 3) { players.push ({ name: "Salvatore", color: "yellow", isAi: false, userId: leo.id }); }
    //       const config: BaronyNewGameConfig = {
    //         name: "Partita",
    //         userId: leo.id,
    //         players: players
    //       };
    //       return this.createNewGame$ (config);
    //     } else {
    //       return of (void 0);
    //     } // if - else
    //   })
    // );
  } // onNewGameClick

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
  onDeleteClick (gameId: string) {
    return this.remote.deleteGame$ (gameId);
  } // onDeleteClick

  onEnterClick (gameId: string) {
    this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute });
  } // onEnterClick

  onNewGameChange (newGame: BaronyNewGame) {
    this.newGame = newGame;
    this.newGameCompleted = !!(newGame.name && newGame.type);
  } // onNewGameChange

  onPlayerChange (player: BaronyNewPlayer, index: number) {
    this.newGame = {
      ...this.newGame,
      players: immutableUtil.listReplaceByIndex (index, player, this.newGame.players)
    };
  } // onPlayerChange

  @ExhaustingEvent ()
  onCreateNewGameClick () {
    const user = this.authService.getUser ();
    return this.remote.insertGame$ (this.newGame.name, user.id).pipe (
      tap ((gameDoc) => {
        this.selectedStepIndex = 1;
        this.playerTypeOptions = this.newGame.type === "local" ?
          playerTypeOptions :
          playerTypeOptions.filter (o => !o.notOffline);
        this.newGame = {
          ...this.newGame,
          id: gameDoc.id,
          players: [
            { userId: user.id, name: this.authService.getUser ().displayName, color: "blue", type: "local" },
            { userId: null, name: "", color: "red", type: "closed" },
            { userId: null, name: "", color: "green", type: "closed" },
            { userId: null, name: "", color: "yellow", type: "closed" },
          ]
        };
        this.cd.markForCheck ();
      })
    );
  } // onCreateNewGameClick

  @ExhaustingEvent ()
  onDeleteNewGameClick () {
    return this.remote.deleteGame$ (this.newGame.id as string).pipe (
      tap (() => {
        this.selectedStepIndex = 0;
        this.newGame = {
          ...this.newGame,
          players: []
        };
        this.cd.markForCheck ();
      })
    );
  } // onDeleteNewGameClick

  onStartNewGameClick () {
    this.selectedStepIndex = 1;
  } // onStartNewGameClick

} // BaronyHomeComponent
