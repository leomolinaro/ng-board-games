import { ChangeDetectionStrategy, Component, inject, isDevMode } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BgHomeConfig, BgHomeModule, BgProtoGame, BgProtoPlayer, BgUser } from "@leobg/commons";
import { concatJoin } from "@leobg/commons/utils";
import { Observable, forkJoin, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrRemoteService } from "../remote/wotr-remote";
import {
  AWotrPlayerDoc,
  WotrAiPlayerDoc,
  WotrPlayerDoc,
  WotrReadPlayerDoc
} from "../remote/wotr-remote-models";
import { WotrScenarioButton } from "../scenario/wotr-scenario-selector";

@Component({
  selector: "wotr-home-page",
  imports: [BgHomeModule, WotrScenarioButton],
  template: `
    <bg-home [config]="config"></bg-home>
    @if (devMode) {
      <wotr-scenario-button></wotr-scenario-button>
    }
  `,
  styles: [
    `
      @use "wotr-variables" as *;

      ::ng-deep {
        .wotr-player-free-peoples {
          .bg-player-type-button {
            background-color: $blue;
          }
        }
        .wotr-player-shadow {
          .bg-player-type-button {
            background-color: $red;
          }
        }
      }
      .load-example {
        position: absolute;
        bottom: 50px;
        left: 50px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrHomePage {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private remote = inject(WotrRemoteService);

  protected devMode = isDevMode();

  config: BgHomeConfig<WotrFrontId> = {
    boardGame: "wotr",
    boardGameName: "War of the Ring (2nd Edition)",
    startGame$: (gameId: string) =>
      from(this.router.navigate(["game", gameId], { relativeTo: this.activatedRoute })),
    deleteGame$: (gameId: string) =>
      concatJoin([
        this.remote.deleteStories$(gameId),
        this.remote.deletePlayers$(gameId),
        this.remote.deleteGame$(gameId)
      ]),
    createGame$: (protoGame, protoPlayers) => this.createGame$(protoGame, protoPlayers),
    playerIds: () => ["free-peoples", "shadow"],
    playerIdCssClass: (front: WotrFrontId) => {
      switch (front) {
        case "free-peoples":
          return "wotr-player-free-peoples";
        case "shadow":
          return "wotr-player-shadow";
      }
    }
  };

  private createGame$(protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<WotrFrontId>[]) {
    return this.remote
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
                return this.insertAiPlayer$(p.name, p.id, index + 1, game.id);
              } else {
                return this.insertRealPlayer$(p.name, p.id, index + 1, p.controller!, game.id);
              }
            })
          ])
        )
      );
  }

  private insertAiPlayer$(
    name: string,
    front: WotrFrontId,
    sort: number,
    gameId: string
  ): Observable<WotrPlayerDoc> {
    const player: WotrAiPlayerDoc = {
      ...this.aPlayerDoc(name, front, sort),
      isAi: true
    };
    return this.remote.insertPlayer$(player, gameId);
  }

  private insertRealPlayer$(
    name: string,
    front: WotrFrontId,
    sort: number,
    controller: BgUser,
    gameId: string
  ): Observable<WotrPlayerDoc> {
    const player: WotrReadPlayerDoc = {
      ...this.aPlayerDoc(name, front, sort),
      isAi: false,
      controller: controller
    };
    return this.remote.insertPlayer$(player, gameId);
  }

  private aPlayerDoc(name: string, front: WotrFrontId, sort: number): AWotrPlayerDoc {
    return { name: name, id: front, sort: sort };
  }
}
