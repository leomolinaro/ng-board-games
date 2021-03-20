import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ExhaustingEvent, UntilDestroy } from "@bg-utils";
import { forkJoin, of } from "rxjs";
import { mapTo, switchMap } from "rxjs/operators";
import { BgAuthService } from "src/app/bg-services/bg-auth.service";
import { BaronyRemoteService } from "../barony-remote.service";
import { getRandomLands } from "../logic/barony-initializer";
import { BaronyColor } from "../models";

interface BaronyNewGameConfig {
  name: string;
  userId: string;
  players: {
    userId: string;
    name: string;
    color: BaronyColor;
    isAi: boolean;
  }[];
} // BaronyNewGameConfig

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
    private activatedRoute: ActivatedRoute
  ) { }

  remoteGames$ = this.remote.gamesChanges$ ();

  ngOnInit (): void {
  } // ngOnInit

  ngOnDestroy () { }

  @ExhaustingEvent ()
  onNewGameClick (numPlayers: number) {
    return forkJoin ([
      this.authService.loadUserByUsername$ ("leo"),
      // this.authService.loadUserByUsername$ ("nico"),
      // this.authService.loadUserByUsername$ ("rob"),
      // this.authService.loadUserByUsername$ ("salvatore")
    ]).pipe (
      switchMap (([leo/* , nico, rob, salvatore */]) => {
        const players: { name: string, isAi: boolean, color: BaronyColor, userId: string }[] = [];
        if (leo/*  && nico && rob && salvatore */) {
          players.push ({ name: "Leo", color: "blue", isAi: false, userId: leo.id });
          players.push ({ name: "Nico", color: "red", isAi: false, userId: leo.id });
          if (numPlayers > 2) { players.push ({ name: "Rob", color: "green", isAi: false, userId: leo.id }); }
          if (numPlayers > 3) { players.push ({ name: "Salvatore", color: "yellow", isAi: false, userId: leo.id }); }
          const config: BaronyNewGameConfig = {
            name: "Partita",
            userId: leo.id,
            players: players
          };
          return this.createNewGame$ (config);
        } else {
          return of (void 0);
        } // if - else
      })
    );
  } // onNewGameClick

  private createNewGame$ (config: BaronyNewGameConfig) {
    return this.remote.insertGame$ ("Partita", config.userId).pipe (
      switchMap (game => forkJoin ([
        ...config.players.map ((p, index) => this.remote.insertPlayer$ (p.name, p.color, p.isAi, index + 1, p.userId, game.id)),
        ...getRandomLands (config.players.length).map (l => this.remote.insertLand$ (l.coordinates, l.type, game.id))
      ])),
      mapTo (void 0)
    );
  } // createNewGame$

  @ExhaustingEvent ()
  onDeleteClick (gameId: string) {
    return this.remote.deleteGame$ (gameId);
  } // onDeleteClick

  onWatchClick (gameId: string) {

  } // onWatchClick

  onEnterClick (gameId: string) {
    this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute });
  } // onEnterClick

} // BaronyHomeComponent
