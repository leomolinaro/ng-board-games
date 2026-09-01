import type { OnDestroy, OnInit } from '@angular/core';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { BgUser } from '@leobg/commons';
import { BgAuthService } from '@leobg/commons';
import {
  ChangeListener,
  SingleEvent,
  UntilDestroy,
} from '@leobg/commons/utils';
import { forkJoin, tap } from 'rxjs';
import { BritBoardComponent } from '../brit-board/brit-board';
import type { BritAreaId } from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type {
  ABritPlayer,
  BritAreaUnit,
  BritPlayer,
} from '../brit-game-state.models';
import type { BritPlayerDoc, BritStoryDoc } from '../brit-remote.service';
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
      (passClick)="onPassClick()"
      (confirmClick)="onConfirmClick()"
      (cancelClick)="ui.cancel.emit()"
      (areaClick)="onAreaClick($event)"
      (unitClick)="onUnitClick($event)"
      (selectedUnitsChange)="onSelectedUnitsChange($event)"
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
@UntilDestroy
export class BritGamePage implements OnInit, OnDestroy {
  private components = inject(BritComponents);
  protected game = inject(BritGameStore);
  protected ui = inject(BritUiStore);
  private remote = inject(BritRemoteService);
  private route = inject(ActivatedRoute);
  private authService = inject(BgAuthService);
  private gameService = inject(BritGameService);

  private gameId: string = this.route.snapshot.paramMap.get('gameId')!;

  @SingleEvent()
  ngOnInit() {
    return forkJoin([
      this.remote.getGame$(this.gameId),
      this.remote.getPlayers$(this.gameId, (ref) => ref.orderBy('sort')),
      this.remote.getStories$(this.gameId, (ref) =>
        ref.orderBy('time').orderBy('playerId'),
      ),
    ]).pipe(
      tap(([game, players, stories]) => {
        if (game) {
          const user = this.authService.getUser();
          this.game.initGameState(
            players.map((p) => this.playerDocToPlayer(p, user)),
            this.gameId,
            game.owner,
          );
          this.listenToGame(stories);
        }
      }),
    );
  }

  @ChangeListener()
  private listenToGame(stories: BritStoryDoc[]) {
    return this.gameService.game$(stories);
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

  ngOnDestroy() {}

  // onPlayerSelect (player: BaronyPlayer) { this.ui.setCurrentPlayer (player.id); }
  // onBuildingSelect (building: BaronyBuilding) { this.ui.buildingChange (building); }
  onAreaClick(areaId: BritAreaId) {
    this.ui.areaChange(areaId);
  }
  onUnitClick(unit: BritAreaUnit) {
    this.ui.unitChange(unit);
  }
  onSelectedUnitsChange(units: BritAreaUnit[]) {
    this.ui.selectedUnitsChange(units);
  }
  // onActionClick (action: BaronyAction) { this.ui.actionChange (action); }
  onPassClick() {
    this.ui.passChange();
  }
  onConfirmClick() {
    this.ui.confirmChange();
  }
  // onKnightsConfirm (numberOfKnights: number) { this.ui.numberOfKnightsChange (numberOfKnights); }
  // onResourceSelect (resource: BaronyResourceType) { this.ui.resourceChange (resource); }
}
