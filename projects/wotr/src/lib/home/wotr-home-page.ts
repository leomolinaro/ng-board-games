import { ChangeDetectionStrategy, Component, computed, inject, isDevMode } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BgAuthService,
  BgHomeAction,
  BgHomeConfig,
  BgHomeModule,
  BgProtoGame,
  BgProtoPlayer,
  BgUser
} from "@leobg/commons";
import { concatJoin } from "@leobg/commons/utils";
import { TuiDialogService } from "@taiga-ui/core";
import { PolymorpheusComponent } from "@taiga-ui/polymorpheus";
import { Observable, forkJoin, from } from "rxjs";
import { switchMap } from "rxjs/operators";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameOptions } from "../game/options/wotr-game-options";
import { WotrGameOptionsFormComponent } from "../game/options/wotr-game-options-form";
import { WotrRemoteService } from "../remote/wotr-remote";
import {
  AWotrPlayerDoc,
  WotrAiPlayerDoc,
  WotrGameDoc,
  WotrPlayerDoc,
  WotrReadPlayerDoc
} from "../remote/wotr-remote-models";
import { WotrScenarioSelectorDialog } from "../scenario/wotr-scenario-selector";

@Component({
  selector: "wotr-home-page",
  imports: [BgHomeModule],
  template: `
    <bg-home
      [config]="config"
      [actions]="devMode && isAdmin() ? [scenarioAction] : []">
    </bg-home>
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

  protected config: BgHomeConfig<WotrFrontId, WotrGameOptions> = {
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
    },
    optionsComponent: () => WotrGameOptionsFormComponent
  };

  private createGame$(protoGame: BgProtoGame, protoPlayers: BgProtoPlayer<WotrFrontId>[]) {
    const game: WotrGameDoc = {
      id: protoGame.id,
      owner: protoGame.owner,
      name: protoGame.name,
      online: protoGame.online,
      state: "open"
    };
    if (protoGame.options) game.options = protoGame.options as WotrGameOptions;
    return this.remote.insertGame$(game).pipe(
      switchMap(({ id }) =>
        forkJoin([
          ...protoPlayers.map((p, index) => {
            if (p.type === "ai") {
              return this.insertAiPlayer$(p.name, p.id, index + 1, id);
            } else {
              return this.insertRealPlayer$(p.name, p.id, index + 1, p.controller!, id);
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

  private auth = inject(BgAuthService);
  protected user = toSignal(this.auth.getUser$());
  protected isAdmin = computed(() => this.user()?.email === "rhapsody.leo@gmail.com");
  private readonly dialogs = inject(TuiDialogService);

  protected scenarioAction: BgHomeAction = {
    id: "scenario",
    label: "Scenario",
    action: () => {
      this.dialogs
        .open<string>(new PolymorpheusComponent(WotrScenarioSelectorDialog), {
          label: "Select Scenario",
          data: {
            activatedRoute: this.activatedRoute
          }
        })
        .subscribe();
    },
    icon: "@tui.bookmark"
  };
}
