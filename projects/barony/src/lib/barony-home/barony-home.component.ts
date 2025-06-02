import { ChangeDetectionStrategy, Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BgHomeConfig, BgHomeModule, BgProtoGame, BgProtoPlayer, BgUser } from "@leobg/commons";
import { concatJoin } from "@leobg/commons/utils";
import { Observable, forkJoin, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BARONY_COLORS } from "../barony-constants";
import { BaronyColor, BaronyLandCoordinates, BaronyLandType } from "../barony-models";
import {
  ABaronyPlayerDoc,
  BaronyAiPlayerDoc,
  BaronyMapDoc,
  BaronyPlayerDoc,
  BaronyReadPlayerDoc,
  BaronyRemoteService
} from "../barony-remote.service";
import { getRandomLands } from "./barony-initializer";

@Component({
  selector: "barony-home",
  imports: [BgHomeModule],
  template: ` <bg-home [config]="config"></bg-home> `,
  styles: [
    `
      @import "barony-variables";

      ::ng-deep {
        .barony-player-blue {
          .bg-player-type-button {
            background-color: $blue;
          }
        }
        .barony-player-red {
          .bg-player-type-button {
            background-color: $red;
          }
        }
        .barony-player-green {
          .bg-player-type-button {
            background-color: $green;
          }
        }
        .barony-player-yellow {
          .bg-player-type-button {
            background-color: $yellow;
          }
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaronyHomeComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private gameService = inject(BaronyRemoteService);

  config: BgHomeConfig<BaronyColor> = {
    boardGame: "barony",
    boardGameName: "Barony",
    startGame$: (gameId: string) =>
      from(
        this.router.navigate(["game", gameId], {
          relativeTo: this.activatedRoute
        })
      ),
    deleteGame$: (gameId: string) =>
      concatJoin([
        this.gameService.deleteStories$(gameId),
        this.gameService.deleteMap$(gameId),
        this.gameService.deletePlayers$(gameId),
        this.gameService.deleteGame$(gameId)
      ]),
    createGame$: (protoGame, protoPlayers) => this.createGame$(protoGame, protoPlayers),
    playerIds: () => BARONY_COLORS,
    playerIdCssClass: (color: BaronyColor) => {
      switch (color) {
        case "blue":
          return "barony-player-blue";
        case "green":
          return "barony-player-green";
        case "red":
          return "barony-player-red";
        case "yellow":
          return "barony-player-yellow";
      }
    } // playerRoleCssClass
  };

  ngOnInit(): void {}

  private createGame$(protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<BaronyColor>[]) {
    return this.gameService
      .insertGame$({
        id: protoGame.id,
        owner: protoGame.owner,
        name: protoGame.name,
        online: protoGame.online,
        state: "open"
      })
      .pipe(
        switchMap(game =>
          forkJoin([
            ...protoPlayers.map((p, index) => {
              if (p.type === "ai") {
                return this.insertAiPlayer$(p.id, p.name, index + 1, game.id);
              } else {
                return this.insertRealPlayer$(p.id, p.name, index + 1, p.controller!, game.id);
              }
            }),
            this.insertMap$(getRandomLands(protoPlayers.length), game.id)
            // ...getRandomLands (activeProtoPlayers.length).map (l => this.insertLand$ (l.coordinates, l.type, game.id))
          ])
        )
      );
  }

  private insertMap$(
    lands: { coordinates: BaronyLandCoordinates; type: BaronyLandType }[],
    gameId: string
  ): Observable<BaronyMapDoc> {
    const baronyMap: BaronyMapDoc = {
      lands: lands.map(l => ({
        x: l.coordinates.x,
        y: l.coordinates.y,
        type: l.type
      }))
    };
    return this.gameService.insertMap$(baronyMap, gameId);
  }

  private insertAiPlayer$(
    playerId: BaronyColor,
    name: string,
    sort: number,
    gameId: string
  ): Observable<BaronyPlayerDoc> {
    const player: BaronyAiPlayerDoc = {
      ...this.aPlayerDoc(playerId, name, sort),
      isAi: true
    };
    return this.gameService.insertPlayer$(player, gameId);
  }

  private insertRealPlayer$(
    playerId: BaronyColor,
    name: string,
    sort: number,
    controller: BgUser,
    gameId: string
  ): Observable<BaronyPlayerDoc> {
    const player: BaronyReadPlayerDoc = {
      ...this.aPlayerDoc(playerId, name, sort),
      isAi: false,
      controller: controller
    };
    return this.gameService.insertPlayer$(player, gameId);
  }

  private aPlayerDoc(playerId: BaronyColor, name: string, sort: number): ABaronyPlayerDoc {
    return { id: playerId, name: name, sort: sort };
  }
}
