import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BgHomeConfig, BgHomeModule, BgProtoGame, BgProtoPlayer, BgUser } from "@leobg/commons";
import { concatJoin } from "@leobg/commons/utils";
import { Observable, forkJoin, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { WotrFrontId } from "./wotr-components/wotr-front.models";
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
  ) {}

  config: BgHomeConfig<WotrFrontId> = {
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
    playerIds: () => ["free-peoples", "shadow"],
    playerIdCssClass: (front: WotrFrontId) => {
      switch (front) {
        case "free-peoples": return "wotr-player-free-peoples";
        case "shadow": return "wotr-player-shadow";
      }
    }
  };

  private createGame$ (protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<WotrFrontId>[]) {
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
              return this.insertAiPlayer$ (p.name, p.id, index + 1, game.id);
            } else {
              return this.insertRealPlayer$ (p.name, p.id, index + 1, p.controller!, game.id);
            }
          }),
        ])
      )
    );
  }

  private insertAiPlayer$ (name: string, front: WotrFrontId, sort: number, gameId: string): Observable<WotrPlayerDoc> {
    const player: WotrAiPlayerDoc = {
      ...this.aPlayerDoc (name, front, sort),
      isAi: true,
    };
    return this.gameService.insertPlayer$ (player, gameId);
  }

  private insertRealPlayer$ (name: string, front: WotrFrontId, sort: number, controller: BgUser, gameId: string): Observable<WotrPlayerDoc> {
    const player: WotrReadPlayerDoc = {
      ...this.aPlayerDoc (name, front, sort),
      isAi: false,
      controller: controller,
    };
    return this.gameService.insertPlayer$ (player, gameId);
  }

  private aPlayerDoc (name: string, front: WotrFrontId, sort: number): AWotrPlayerDoc {
    return { name: name, id: front, sort: sort };
  }

}
