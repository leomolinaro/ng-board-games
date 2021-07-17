import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BgAuthService, BgUser } from "@bg-services";
import { ChangeListener, ConcatingEvent, ExhaustingEvent, InitEvent, UntilDestroy } from "@bg-utils";
import { BehaviorSubject, forkJoin, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { ABgRoomDialogInput, ABgRoomDialogOutput } from "src/app/bg-components/bg-home";
import { BgProtoGameService, BgProtoPlayerType } from "src/app/bg-services/bg-proto-game.service";
import { BritColor } from "../../brit-models";
import { ABritPlayerDoc, BritAiPlayerDoc, BritPlayerDoc, BritReadPlayerDoc, BritRemoteService } from "../../brit-remote.service";
import { BritProtoGame, BritProtoPlayer } from "../brit-home.models";

@Component ({
  selector: "brit-room-dialog",
  templateUrl: "./brit-room-dialog.component.html",
  styleUrls: ["./brit-room-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BritRoomDialogComponent implements OnInit, OnDestroy {

  constructor (
    private dialogRef: MatDialogRef<BritRoomDialogComponent, ABgRoomDialogOutput>,
    @Inject (MAT_DIALOG_DATA) private data: ABgRoomDialogInput,
    private protoGameService: BgProtoGameService,
    private authService: BgAuthService,
    private gameService: BritRemoteService
  ) { }

  onlineGame = this.data.protoGame.online;
  game = this.data.protoGame;
  playerTrackBy = (index: number, player: BritProtoPlayer) => index;
  private $players = new BehaviorSubject<BritProtoPlayer[]> ([]);
  players$ = this.$players.asObservable ();

  validPlayers$ = this.players$.pipe (map (players => {
    let nPlayers = 0;
    for (const player of players) {
      switch (player.type) {
        case "me":
        case "other": if (!player.name || !player.ready) { return false; } nPlayers++; break;
        case "ai": if (!player.name) { return false; } nPlayers++; break;
        case "open": return false;
      } // switch
    } // while
    if (nPlayers < 2) { return false; }
    return true;
  }));

  @ChangeListener ()
  private listenToPlayersChange () {
    return this.protoGameService.selectProtoPlayers$ (this.game.id).pipe (
      tap (p => this.$players.next (p as BritProtoPlayer[]))
    );
  } // listenToPlayersChange
  
  @InitEvent ()
  ngOnInit () {
    return this.protoGameService.getProtoPlayers$ (this.game.id).pipe (
      switchMap (players => {
        if (players && players.length) {
          return of (void 0);
        } else {
          return forkJoin ([
            this.insertProtoPlayer$ ("1", "yellow"),
            this.insertProtoPlayer$ ("2", "blue"),
            this.insertProtoPlayer$ ("3", "red"),
            this.insertProtoPlayer$ ("4", "green")
          ]);
        } // if - else
      }),
      tap (() => {
        this.listenToPlayersChange ();
      })
    );
  } // ngOnInit

  private insertProtoPlayer$ (id: string, color: BritColor) {
    const player: BritProtoPlayer = {
      id: id,
      color: color,
      name: "",
      controller: null,
      type: "closed",
      ready: false
    };
    return this.protoGameService.insertProtoPlayer$ (player, this.game.id);
  } // insertProtoPlayer$

  ngOnDestroy () { }

  @ConcatingEvent ()
  onPlayerChange (player: BritProtoPlayer, playerId: string) {
    return this.protoGameService.updateProtoPlayer$ (player, playerId, this.game.id);
  } // onPlayerChange

  @ConcatingEvent ()
  onNextPlayerType (currentType: BgProtoPlayerType, playerId: string) {
    const controllerPatch: { controller?: BgUser | null } = { };
    const namePatch: { name?: string | "" } = { };
    const readyPatch: { ready?: boolean } = { };
    const nextPlayerType = this.getNextPlayerType (currentType);
    switch (nextPlayerType) {
      case "me": {
        controllerPatch.controller = this.authService.getUser ();
        namePatch.name = this.authService.getUser ().displayName;
        if (!this.onlineGame) { readyPatch.ready = true; }
        break;
      } // case
      case "closed": {
        controllerPatch.controller = null;
        namePatch.name = "";
        readyPatch.ready = false;
        break;
      } // case
      case "open": {
        controllerPatch.controller = null;
        namePatch.name = "";
        readyPatch.ready = false;
        break;
      } // case
      case "ai": {
        controllerPatch.controller = null;
        namePatch.name = "AI";
        readyPatch.ready = true;
        break;
      } // case
    } // switch
    return this.protoGameService.updateProtoPlayer$ ({
      type: nextPlayerType,
      ...controllerPatch,
      ...namePatch,
      ...readyPatch
    }, playerId, this.game.id);
  } // onNextPlayerType

  private getNextPlayerType (currentType: BgProtoPlayerType): BgProtoPlayerType {
    switch (currentType) {
      case "closed": return "me";
      case "me": return this.onlineGame ? "open" : "ai";
      case "open": return "ai";
      case "ai": return "closed";
      case "other": return "closed";
    } // switch
  } // getNextPlayerType

  @ExhaustingEvent ()
  onStartGameClick () {
    return this.gameService.getGame$ (this.game.id).pipe (
      switchMap (game => {
        if (game) {
          return of (game);
        } else {
          return this.createGame$ (this.game, this.$players.getValue ());
        } // if - else
      }),
      tap (() => {
        this.dialogRef.close ({
          startGame: true,
          gameId: this.game.id,
          deleteGame: false
        });
      })
    );
  } // onStartGameClick

  private createGame$ (protoGame: BritProtoGame, protoPlayers: BritProtoPlayer[]) {
    const activeProtoPlayers = protoPlayers
    .filter (p => p.type === "me" || p.type === "other" || p.type === "ai");
    return forkJoin ([
      this.protoGameService.updateProtoGame$ ({ state: "closed" }, protoGame.id),
      this.gameService.insertGame$ ({
        id: protoGame.id,
        owner: protoGame.owner,
        name: protoGame.name,
        online: protoGame.online,
        state: "open"
      }).pipe (
        switchMap (game => forkJoin ([
          ...activeProtoPlayers
          .map ((p, index) => {
            if (p.type === "ai") {
              return this.insertAiPlayer$ (p.name, p.color, index + 1, game.id);
            } else {
              return this.insertRealPlayer$ (p.name, p.color, index + 1, p.controller!, game.id);
            } // if - else
          })
        ]))
      )
    ]);
  } // createGame$

  private insertAiPlayer$ (name: string, color: BritColor, sort: number, gameId: string): Observable<BritPlayerDoc> {
    const player: Omit<BritAiPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, color, sort),
      isAi: true
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertAiPlayer$

  private insertRealPlayer$ (name: string, color: BritColor, sort: number, controller: BgUser, gameId: string): Observable<BritPlayerDoc> {
    const player: Omit<BritReadPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, color, sort),
      isAi: false,
      controller: controller
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertRealPlayer$

  private aPlayerDoc (name: string, color: BritColor, sort: number): Omit<ABritPlayerDoc, "id"> {
    return {
      name: name,
      color: color,
      sort: sort
    };
  } // aPlayerDoc

  @ExhaustingEvent ()
  onDeleteGameClick () {
    return this.protoGameService.deleteProtoPlayers$ (this.game.id).pipe (
      tap (() => {
        this.dialogRef.close ({
          startGame: false,
          gameId: this.game.id,
          deleteGame: true
        });
      })
    );
  } // onDeleteGameClick

} // BritRoomDialogComponent
