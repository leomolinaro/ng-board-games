import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BgHomeConfig, BgProtoGame, BgProtoPlayer, BgUser } from "@leobg/commons";
import { concatJoin } from "@leobg/commons/utils";
import { Observable, forkJoin, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BritColor } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import {
  ABritPlayerDoc,
  BritAiPlayerDoc,
  BritPlayerDoc,
  BritReadPlayerDoc,
  BritRemoteService,
} from "../brit-remote.service";

@Component ({
  selector: "brit-home",
  template: "<bg-home [config]=\"config\"></bg-home>",
  styles: [
    `
      @import 'brit-variables';

      ::ng-deep {
        .brit-player-blue {
          .bg-player-type-button {
            background-color: $blue;
          }
        }
        .brit-player-red {
          .bg-player-type-button {
            background-color: $red;
          }
        }
        .brit-player-green {
          .bg-player-type-button {
            background-color: $green;
          }
        }
        .brit-player-yellow {
          .bg-player-type-button {
            background-color: $yellow;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BritHomeComponent implements OnInit {
  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gameService: BritRemoteService,
    private components: BritComponentsService
  ) {}

  config: BgHomeConfig<BritColor> = {
    boardGame: "britannia",
    boardGameName: "Britannia",
    startGame$: (gameId: string) =>
      from (
        this.router.navigate (["game", gameId], {
          relativeTo: this.activatedRoute,
        })
      ),
    deleteGame$: (gameId: string) =>
      concatJoin ([
        this.gameService.deleteStories$ (gameId),
        this.gameService.deletePlayers$ (gameId),
        this.gameService.deleteGame$ (gameId),
      ]),
    createGame$: (protoGame, protoPlayers) =>
      this.createGame$ (protoGame, protoPlayers),
    playerRoles: () => this.components.COLORS,
    playerRoleCssClass: (color: BritColor) => {
      switch (color) {
        case "blue":
          return "brit-player-blue";
        case "green":
          return "brit-player-green";
        case "red":
          return "brit-player-red";
        case "yellow":
          return "brit-player-yellow";
      } // switch
    }, // playerRoleCssClass
  };

  ngOnInit (): void {} // ngOnInit

  private createGame$ (
    protoGame: BgProtoGame,
    protoPlayers: BgProtoPlayer<BritColor>[]
  ) {
    return this.gameService
      .insertGame$ ({
        id: protoGame.id,
        owner: protoGame.owner,
        name: protoGame.name,
        online: protoGame.online,
        state: "open",
      })
      .pipe (
        switchMap ((game) =>
          forkJoin ([
            ...protoPlayers.map ((p, index) => {
              if (p.type === "ai") {
                return this.insertAiPlayer$ (p.name, p.role, index + 1, game.id);
              } else {
                return this.insertRealPlayer$ (
                  p.name,
                  p.role,
                  index + 1,
                  p.controller!,
                  game.id
                );
              } // if - else
            }),
          ])
        )
      );
  } // createGame$

  private insertAiPlayer$ (
    name: string,
    color: BritColor,
    sort: number,
    gameId: string
  ): Observable<BritPlayerDoc> {
    const player: Omit<BritAiPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, color, sort),
      isAi: true,
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertAiPlayer$

  private insertRealPlayer$ (
    name: string,
    color: BritColor,
    sort: number,
    controller: BgUser,
    gameId: string
  ): Observable<BritPlayerDoc> {
    const player: Omit<BritReadPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, color, sort),
      isAi: false,
      controller: controller,
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertRealPlayer$

  private aPlayerDoc (
    name: string,
    color: BritColor,
    sort: number
  ): Omit<ABritPlayerDoc, "id"> {
    return {
      name: name,
      color: color,
      sort: sort,
    };
  } // aPlayerDoc
} // BritHomeComponent
