import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BgAccountButton, BgAuthService } from '@leobg/commons';
import { SingleEvent, UntilDestroy } from '@leobg/commons/utils';
import { TuiButton } from '@taiga-ui/core';
import { TuiNavigation } from '@taiga-ui/layout';
import { GAMES } from '../app-games';

@Component({
  selector: 'app-home-page',
  imports: [TuiNavigation, BgAccountButton, RouterLink, TuiButton],
  template: `
    <header
      class="app-header"
      tuiNavigationHeader
    >
      <bg-account-button></bg-account-button>
    </header>
    <main>
      @for (game of games; track game) {
        <a
          class="game"
          tuiButton
          appearance="secondary"
          size="l"
          [routerLink]="game.routerLink"
        >
          <img
            class="game-image"
            [src]="game.imageSource"
            [alt]="game.name"
          />
        </a>
      }
    </main>
  `,
  styles: [
    `
      header {
        bg-account-button {
          margin-left: auto;
        }
      }

      main {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1rem;
        flex: 1;
      }

      .game {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 220px;
        padding: 0.75rem;
        border-radius: 1rem;
        text-decoration: none;
        box-shadow: 0 0 0 1px
          color-mix(in srgb, var(--tui-border-normal) 70%, transparent);
        transition:
          transform 0.15s ease,
          box-shadow 0.15s ease,
          filter 0.15s ease;
      }

      .game:hover {
        transform: translateY(-1px);
        box-shadow:
          0 0 0 1px color-mix(in srgb, var(--tui-primary) 45%, transparent),
          0 12px 28px rgb(0 0 0 / 12%);
        filter: brightness(1.04);
      }

      .game-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 0.75rem;
      }
    `,
  ],
})
@UntilDestroy
export class AppHomePage implements OnInit, OnDestroy {
  private authService = inject(BgAuthService);

  games = GAMES;

  @SingleEvent()
  ngOnInit() {
    return this.authService.autoSignIn$();
  }

  ngOnDestroy() {}
}
