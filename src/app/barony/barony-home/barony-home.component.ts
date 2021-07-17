import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BgHomeConfig } from "@bg-components/home";
import { BgProtoGame, BgProtoPlayer, BgUser } from "@bg-services";
import { concatJoin } from "@bg-utils";
import { forkJoin, from, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BARONY_COLORS } from "../barony-constants";
import { BaronyColor, BaronyLandCoordinates, BaronyLandType } from "../barony-models";
import { ABaronyPlayerDoc, BaronyAiPlayerDoc, BaronyMapDoc, BaronyPlayerDoc, BaronyReadPlayerDoc, BaronyRemoteService } from "../barony-remote.service";
import { getRandomLands } from "./barony-initializer";

@Component ({
  selector: "barony-home",
  templateUrl: "./barony-home.component.html",
  styleUrls: ["./barony-home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyHomeComponent implements OnInit {

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gameService: BaronyRemoteService
  ) { }

  config: BgHomeConfig<BaronyColor> = {
    boardGame: "barony",
    boardGameName: "Barony",
    startGame$: (gameId: string) => from (this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute })),
    deleteGame$: (gameId: string) => concatJoin ([
      this.gameService.deleteStories$ (gameId),
      this.gameService.deleteMap$ (gameId),
      this.gameService.deletePlayers$ (gameId),
      this.gameService.deleteGame$ (gameId)
    ]),
    createGame$: (protoGame, protoPlayers) => this.createGame$ (protoGame, protoPlayers),
    playerRoles: () => BARONY_COLORS,
    playerRoleCssClass: (color: BaronyColor) => {
      switch (color) {
        case "blue": return "barony-player-blue";
        case "green": return "barony-player-green";
        case "red": return "barony-player-red";
        case "yellow": return "barony-player-yellow";
      } // switch
    } // playerRoleCssClass
  };

  ngOnInit (): void {
  } // ngOnInit

  private createGame$ (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<BaronyColor>[]) {
    return this.gameService.insertGame$ ({
      id: protoGame.id,
      owner: protoGame.owner,
      name: protoGame.name,
      online: protoGame.online,
      state: "open"
    }).pipe (
      switchMap (game => forkJoin ([
        ...protoPlayers
        .map ((p, index) => {
          if (p.type === "ai") {
            return this.insertAiPlayer$ (p.name, p.role, index + 1, game.id);
          } else {
            return this.insertRealPlayer$ (p.name, p.role, index + 1, p.controller!, game.id);
          } // if - else
        }),
        this.insertMap$ (getRandomLands (protoPlayers.length), game.id)
        // ...getRandomLands (activeProtoPlayers.length).map (l => this.insertLand$ (l.coordinates, l.type, game.id))
      ]))
    );
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

} // BaronyHomeComponent
