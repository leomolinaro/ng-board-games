import { ChangeDetectionStrategy, Component, OnDestroy, computed, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { MatFabButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { ActivatedRoute, Router } from "@angular/router";
import { BgAuthService, BgUser, getStoryId } from "@leobg/commons";
import { ExhaustingEvent, UntilDestroy } from "@leobg/commons/utils";
import { Observable, forkJoin, from, map, switchMap } from "rxjs";
import { WotrFrontId } from "../wotr-elements/front/wotr-front.models";
import { WotrPlayerDoc, WotrReadPlayerDoc, WotrRemoteService } from "../wotr-remote.service";
import { WotrStoryDoc } from "../wotr-story.models";

interface WotrExampleGame {
  id: string;
  name: string;
  loadStories: () => Promise<WotrStoryDoc[]>;
}

@Component ({
  selector: "wotr-example-button",
  standalone: true,
  imports: [MatFabButton, MatIcon, MatMenuModule],
  template: `
    @if (isAdmin ()) {
      <button mat-fab color="accent" class="load-example"
        [matMenuTriggerFor]="exampleMenu">
        <mat-icon>bookmark</mat-icon>
      </button>
      <mat-menu #exampleMenu="matMenu">
        @for (game of exampleGames; track game.name) {
          <button mat-menu-item (click)="onGameClick (game)">
            <span>{{ game.name }}</span>
          </button>
        }
      </mat-menu>
    }
  `,
  styles: [`
    .load-example {
      position: absolute;
      bottom: 50px;
      left: 50px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@UntilDestroy
export class WotrExampleButton implements OnDestroy {

  private remote = inject (WotrRemoteService);
  private auth = inject (BgAuthService);
  private router = inject (Router);
  private activatedRoute = inject (ActivatedRoute);

  protected user = toSignal (this.auth.getUser$ ());
  protected isAdmin = computed (() => this.user ()?.email === "rhapsody.leo@gmail.com");

  protected exampleGames: WotrExampleGame[] = [
    { id: "very-late-minion", name: "Very Late Minions", loadStories: () => import ("./very-late-minions").then (e => e.stories) }
  ];

  ngOnDestroy () { }

  @ExhaustingEvent ()
  protected onGameClick (game: WotrExampleGame) {
    return from (game.loadStories ()).pipe (
      switchMap (stories => this.createGame$ (game, stories)),
      switchMap (gameId => from (this.router.navigate (["game", gameId], { relativeTo: this.activatedRoute })),)
    );
  }

  private createGame$ (exampleGame: WotrExampleGame, stories: WotrStoryDoc[]) {
    const user = this.user ()!;
    return this.remote.insertGame$ ({
      id: exampleGame.id,
      owner: user,
      name: exampleGame.name,
      online: false,
      state: "closed",
    }).pipe (
      switchMap (game => forkJoin ([
        this.insertRealPlayer$ ("FP", "free-peoples", 1, user, game.id),
        this.insertRealPlayer$ ("S", "shadow", 2, user, game.id),
        ...stories.slice (0, 80).map (story => {
          const storyId = getStoryId (story.time, story.playerId);
          return this.remote.insertStory$ (storyId, story, game.id);
        })
        
      ]).pipe (
        map (() => game.id)
      ))
    );
  }

  private insertRealPlayer$ (name: string, front: WotrFrontId, sort: number, controller: BgUser, gameId: string): Observable<WotrPlayerDoc> {
    const player: WotrReadPlayerDoc = {
      name: name, id: front, sort: sort,
      isAi: false, controller: controller,
    };
    return this.remote.insertPlayer$ (player, gameId);
  }

}
