import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BgHomeConfig, BgHomeModule, BgProtoGame, BgProtoPlayer, BgUser } from "@leobg/commons";
import { concatJoin } from "@leobg/commons/utils";
import { Observable, forkJoin, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { WotrFront } from "./wotr-components.models";
import { WotrComponentsService } from "./wotr-components.service";
import {
  AWotrPlayerDoc,
  WotrAiPlayerDoc,
  WotrPlayerDoc,
  WotrReadPlayerDoc,
  WotrRemoteService,
} from "./wotr-remote.service";

@Component ({
  selector: "wotr-home",
  standalone: true,
  imports: [BgHomeModule],
  template: `
    <bg-home [config]="config"></bg-home>
  `,
  styles: [`
    @import 'wotr-variables';

    ::ng-deep {
      .wotr-player-free-peoples {
        .bg-player-type-button { background-color: $blue; }
      }
      .wotr-player-shadow {
        .bg-player-type-button { background-color: $red; }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrHomeComponent {

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gameService: WotrRemoteService,
    private components: WotrComponentsService
  ) {}

  config: BgHomeConfig<WotrFront> = {
    boardGame: "wotr",
    boardGameName: "War of the Ring (2nd Edition)",
    startGame$: (gameId: string) =>
      from (this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute })),
    deleteGame$: (gameId: string) =>
      concatJoin ([
        this.gameService.deleteStories$ (gameId),
        this.gameService.deletePlayers$ (gameId),
        this.gameService.deleteGame$ (gameId),
      ]),
    createGame$: (protoGame, protoPlayers) => this.createGame$ (protoGame, protoPlayers),
    playerRoles: () => this.components.FRONTS,
    playerRoleCssClass: (front: WotrFront) => {
      switch (front) {
        case "free-peoples": return "wotr-player-free-peoples";
        case "shadow": return "wotr-player-shadow";
      } // switch
    }, // playerRoleCssClass
  };

  private createGame$ (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<WotrFront>[]) {
    return this.gameService.insertGame$ ({
      id: protoGame.id,
      owner: protoGame.owner,
      name: protoGame.name,
      online: protoGame.online,
      state: "open",
    }).pipe (
      switchMap ((game) =>
        forkJoin ([
          ...protoPlayers.map ((p, index) => {
            if (p.type === "ai") {
              return this.insertAiPlayer$ (p.name, p.role, index + 1, game.id);
            } else {
              return this.insertRealPlayer$ (p.name, p.role, index + 1, p.controller!, game.id);
            } // if - else
          }),
        ])
      )
    );
  } // createGame$

  private insertAiPlayer$ (name: string, front: WotrFront, sort: number, gameId: string): Observable<WotrPlayerDoc> {
    const player: Omit<WotrAiPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, front, sort),
      isAi: true,
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertAiPlayer$

  private insertRealPlayer$ (name: string, front: WotrFront, sort: number, controller: BgUser, gameId: string): Observable<WotrPlayerDoc> {
    const player: Omit<WotrReadPlayerDoc, "id"> = {
      ...this.aPlayerDoc (name, front, sort),
      isAi: false,
      controller: controller,
    };
    return this.gameService.insertPlayer$ (player, gameId);
  } // insertRealPlayer$

  private aPlayerDoc (name: string, front: WotrFront, sort: number): Omit<AWotrPlayerDoc, "id"> {
    return { name: name, front: front, sort: sort };
  } // aPlayerDoc

} // BritHomeComponent
