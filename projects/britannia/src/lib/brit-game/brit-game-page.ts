import type { OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { BgUser } from '@leobg/commons';
import { BgAuthService } from '@leobg/commons';
import { BritBoardComponent } from '../brit-board/brit-board';
import { BritComponents } from '../brit-components.service';
import type { ABritPlayer, BritPlayer } from '../brit-game-state.models';
import type { BritPlayerDoc } from '../brit-remote.service';
import { BritRemoteService } from '../brit-remote.service';
import { BritGameService } from './brit-game.service';
import { BritGameStore } from './brit-game.store';
import { BritPlayerAiService } from './brit-player-ai.service';
import { BritPlayerLocalService } from './brit-player-local.service';
import { BritUiStore } from './brit-ui.store';

@Component({
  selector: 'brit-game',
  imports: [BritBoardComponent],
  template: `
    <brit-board
      [areaStates]="game.areas()"
      [nationStates]="game.nations()"
      [players]="game.playerList()"
      [logs]="game.logs()"
      [message]="ui.message()"
      [turnPlayer]="ui.turnPlayer()"
      [currentPlayer]="ui.currentPlayer()"
      [validAreas]="ui.validAreas()"
      [validUnits]="ui.validUnits()"
      [selectedUnits]="ui.selectedUnits()"
      [canPass]="ui.canPass()"
      [canConfirm]="ui.canConfirm()"
      [canCancel]="ui.canCancel()"
      (passClick)="ui.passChange.emit()"
      (confirmClick)="ui.confirmChange.emit()"
      (cancelClick)="ui.cancel.emit()"
      (areaClick)="ui.areaChange.emit($event)"
      (unitClick)="ui.unitChange.emit($event)"
      (selectedUnitsChange)="ui.selectedUnitsChange.emit($event)"
    />
  `,
  providers: [
    BritGameStore,
    BritUiStore,
    BritPlayerAiService,
    BritPlayerLocalService,
    BritGameService,
  ],
})
export class BritGamePage implements OnInit {
  private components = inject(BritComponents);
  protected game = inject(BritGameStore);
  protected ui = inject(BritUiStore);
  private remote = inject(BritRemoteService);
  private route = inject(ActivatedRoute);
  private authService = inject(BgAuthService);
  private gameService = inject(BritGameService);

  private gameId: string = this.route.snapshot.paramMap.get('gameId')!;

  ngOnInit() {
    void this.init();
  }

  private async init() {
    const [game, players, stories] = await Promise.all([
      this.remote.getGame(this.gameId),
      this.remote.getPlayers(this.gameId, (ref) => ref.orderBy('sort')),
      this.remote.getStories(this.gameId, (ref) =>
        ref.orderBy('time').orderBy('playerId'),
      ),
    ]);
    if (game) {
      const user = this.authService.getUser();
      this.game.initGameState(
        players.map((p) => this.playerDocToPlayer(p, user)),
        this.gameId,
        game.owner,
      );
      void this.gameService.game(stories);
    }
  }

  private playerDocToPlayer(
    playerDoc: BritPlayerDoc,
    user: BgUser,
  ): BritPlayer {
    if (playerDoc.isAi) {
      return {
        ...this.playerDocToAPlayerInit(playerDoc),
        isAi: true,
        isLocal: false,
        isRemote: false,
      };
    } else {
      return {
        ...this.playerDocToAPlayerInit(playerDoc),
        isAi: false,
        controller: playerDoc.controller,
        isLocal: user.id === playerDoc.controller.id,
        isRemote: user.id !== playerDoc.controller.id,
      };
    }
  }

  private playerDocToAPlayerInit(playerDoc: BritPlayerDoc): ABritPlayer {
    return {
      id: playerDoc.id,
      name: playerDoc.name,
      nationIds: this.components.getNationIdsOfColor(playerDoc.id),
      score: 0,
    };
  }
}
