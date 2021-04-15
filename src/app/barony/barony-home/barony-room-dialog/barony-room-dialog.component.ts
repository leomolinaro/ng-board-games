import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BgAuthService, BgUser } from "@bg-services";
import { ChangeListener, ConcatingEvent, ExhaustingEvent, InitEvent, UntilDestroy } from "@bg-utils";
import { BehaviorSubject, forkJoin, Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { ABgRoomDialogInput, ABgRoomDialogOutput } from "src/app/bg-components/bg-home";
import { ABgProtoPlayerType, BgProtoGameService } from "src/app/bg-services/bg-proto-game.service";
import { BaronyColor, BaronyLandCoordinates, BaronyLandType } from "../../barony-models";
import { ABaronyPlayerDoc, BaronyAiPlayerDoc, BaronyMapDoc, BaronyPlayerDoc, BaronyReadPlayerDoc, BaronyRemoteService } from "../../barony-remote.service";
import { BaronyProtoGame, BaronyProtoPlayer } from "../barony-home.models";
import { getRandomLands } from "../barony-initializer";

@Component ({
  selector: "barony-room-dialog",
  templateUrl: "./barony-room-dialog.component.html",
  styleUrls: ["./barony-room-dialog.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class BaronyRoomDialogComponent implements OnInit, OnDestroy {

  constructor (
    private dialogRef: MatDialogRef<BaronyRoomDialogComponent, ABgRoomDialogOutput>,
    @Inject (MAT_DIALOG_DATA) private data: ABgRoomDialogInput,
    private protoGameService: BgProtoGameService,
    private authService: BgAuthService,
    private gameService: BaronyRemoteService
  ) { }

  onlineGame = this.data.protoGame.online;
  game = this.data.protoGame;
  playerTrackBy = (index: number, player: BaronyProtoPlayer) => index;
  private $players = new BehaviorSubject<BaronyProtoPlayer[]> ([]);
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
      tap (p => this.$players.next (p as BaronyProtoPlayer[]))
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

  private insertProtoPlayer$ (id: string, color: BaronyColor) {
    const player: BaronyProtoPlayer = {
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
  onPlayerChange (player: BaronyProtoPlayer, playerId: string) {
    return this.protoGameService.updateProtoPlayer$ (player, playerId, this.game.id);
  } // onPlayerChange

  @ConcatingEvent ()
  onNextPlayerType (currentType: ABgProtoPlayerType, playerId: string) {
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

  private getNextPlayerType (currentType: ABgProtoPlayerType): ABgProtoPlayerType {
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

  private createGame$ (protoGame: BaronyProtoGame, protoPlayers: BaronyProtoPlayer[]) {
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
          }),
          this.insertMap$ (getRandomLands (activeProtoPlayers.length), game.id)
          // ...getRandomLands (activeProtoPlayers.length).map (l => this.insertLand$ (l.coordinates, l.type, game.id))
        ]))
      )
    ]);
  } // createGame$

  private insertMap$ (lands: { coordinates: BaronyLandCoordinates; type: BaronyLandType; }[], gameId: string): Observable<BaronyMapDoc> {
    const baronyMap: BaronyMapDoc = {
      lands: lands.map (l => ({
        x: l.coordinates.x,
        y: l.coordinates.y,
        type: l.type
      }))
    };
    return this.gameService.insertMap$ (baronyMap, gameId);
  } // insertMap$

  // private insertLand$ (coordinates: { x: number; y: number; z: number; }, type: BaronyLandType, gameId: string): Observable<BaronyLandDoc> {
  //   return this.gameService.insertLand$ ({
  //     id: landCoordinatesToId (coordinates),
  //     coordinates: coordinates,
  //     type: type
  //   }, gameId);
  // } // insertLand$

  private insertAiPlayer$ (name: string, color: BaronyColor, sort: number, gameId: string): Observable<BaronyPlayerDoc> {
    const player: Omit<BaronyAiPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, color, sort),
      isAi: true
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertAiPlayer$

  private insertRealPlayer$ (name: string, color: BaronyColor, sort: number, controller: BgUser, gameId: string): Observable<BaronyPlayerDoc> {
    const player: Omit<BaronyReadPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, color, sort),
      isAi: false,
      controller: controller
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertRealPlayer$

  private aPlayerDoc (name: string, color: BaronyColor, sort: number): Omit<ABaronyPlayerDoc, "id"> {
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

} // BaronyRoomDialogComponent
