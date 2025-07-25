import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { BgAuthService } from "@leobg/commons";
import { ExhaustingEvent, UntilDestroy } from "@leobg/commons/utils";
import { from } from "rxjs";
import { WotrStoryDoc } from "../game/wotr-story-models";
import { WotrExamplesService } from "./wotr-examples.service";

interface WotrExampleGame {
  id: string;
  name: string;
  loadStories: () => Promise<WotrStoryDoc[]>;
}

@Component({
  selector: "wotr-example-button",
  imports: [MatFabButton, MatIcon, MatMenuModule],
  template: `
    @if (isAdmin()) {
      <button
        mat-fab
        color="accent"
        class="load-example"
        [matMenuTriggerFor]="exampleMenu">
        <mat-icon>bookmark</mat-icon>
      </button>
      <mat-menu #exampleMenu="matMenu">
        @for (game of exampleGames; track game.name) {
          <button
            mat-menu-item
            (click)="onGameClick(game)">
            <span>{{ game.name }}</span>
          </button>
        }
      </mat-menu>
    }
  `,
  styles: [
    `
      .load-example {
        position: absolute;
        bottom: 50px;
        left: 50px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@UntilDestroy
export class WotrExampleButton implements OnDestroy {
  // private remote = inject (WotrRemoteService);
  private auth = inject(BgAuthService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private examples = inject(WotrExamplesService);

  protected user = toSignal(this.auth.getUser$());
  protected isAdmin = computed(() => this.user()?.email === "rhapsody.leo@gmail.com");

  protected exampleGames: WotrExampleGame[] = this.examples.getGames();

  ngOnDestroy() {}

  @ExhaustingEvent()
  protected onGameClick(game: WotrExampleGame) {
    return from(this.router.navigate(["game", game.id], { relativeTo: this.activatedRoute }));
    // return from (game.loadStories ()).pipe (
    //   switchMap (stories => this.createGame$ (game, stories)),
    //   switchMap (gameId => from (this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute })),)
    // );
  }

  // private createGame$ (exampleGame: WotrExampleGame, stories: WotrStoryDoc[]) {
  //   const user = this.user ()!;
  //   return this.remote.insertGame$ ({
  //     id: exampleGame.id,
  //     owner: user,
  //     name: exampleGame.name,
  //     online: false,
  //     state: "closed",
  //   }).pipe (
  //     switchMap (game => forkJoin ([
  //       this.insertRealPlayer$ ("FP", "free-peoples", 1, user, game.id),
  //       this.insertRealPlayer$ ("S", "shadow", 2, user, game.id),
  //       ...stories.map (story => {
  //         const storyId = getStoryId (story.time, story.playerId);
  //         return this.remote.insertStory$ (storyId, story, game.id);
  //       })

  //     ]).pipe (
  //       map (() => game.id)
  //     ))
  //   );
  // }

  // private insertRealPlayer$ (name: string, front: WotrFrontId, sort: number, controller: BgUser, gameId: string): Observable<WotrPlayerDoc> {
  //   const player: WotrReadPlayerDoc = {
  //     name: name, id: front, sort: sort,
  //     isAi: false, controller: controller,
  //   };
  //   return this.remote.insertPlayer$ (player, gameId);
  // }
}
