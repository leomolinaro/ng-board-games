import { NgFor } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from "@angular/core";
import { MatToolbar } from "@angular/material/toolbar";
import { RouterLink } from "@angular/router";
import { BgAuthService } from "@leobg/commons";
import { SingleEvent, UntilDestroy } from "@leobg/commons/utils";
import { BgAccountButtonComponent } from "../../../../commons/src/lib/authentication/bg-account-button.component";
import { AppGamesService } from "../app-games.service";

@Component ({
  selector: "app-home-page",
  template: `
    <mat-toolbar>
      <bg-account-button></bg-account-button>
    </mat-toolbar>
    <div class="games">
      <div *ngFor="let game of games" class="game-wrapper">
        <a class="game" [routerLink]="game.routerLink">
          <img class="game-image" [src]="game.imageSource" [alt]="game.name"/>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .games {
      display: flex;
      justify-content: center;
      margin-top: 40px;
      flex-wrap: wrap;
      .game-wrapper {
        padding: 10px;
        .game {
          display: block;
          height: 200px;
          &:hover {
            box-shadow: 0 4px 17px rgb(255 255 255 / 35%);
          }
          .game-image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .bg-users {
      .bg-user {
        &.logged-user {
          font-weight: 600;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, BgAccountButtonComponent, NgFor, RouterLink]
})
@UntilDestroy
export class AppHomePageComponent implements OnInit, OnDestroy {

  private authService = inject (BgAuthService);
  private gamesService = inject (AppGamesService);

  games = this.gamesService.getGames ();

  @SingleEvent ()
  ngOnInit () {
    return this.authService.autoSignIn$ ();
  } // ngOnInit

  ngOnDestroy () {}

} // BgMainPageComponent
