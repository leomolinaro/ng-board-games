import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { BgAuthService } from "@leobg/commons";
import { SingleEvent, UntilDestroy } from "@leobg/commons/utils";
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
  standalone: false
})
@UntilDestroy
export class AppHomePageComponent implements OnInit, OnDestroy {
  
  constructor (
    private authService: BgAuthService,
    private gamesService: AppGamesService
  ) {}

  games = this.gamesService.getGames ();

  @SingleEvent ()
  ngOnInit () {
    return this.authService.autoSignIn$ ();
  } // ngOnInit

  ngOnDestroy () {}

} // BgMainPageComponent
