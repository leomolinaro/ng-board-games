import { AsyncPipe } from '@angular/common';
import type { OnInit} from '@angular/core';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaronyBoard } from '../barony-board/barony-board';
import type {
  BaronyAction,
  BaronyBuilding,
  BaronyLand,
  BaronyPlayer,
  BaronyResourceType,
} from '../barony-models';
import { BaronyGameService } from './barony-game.service';
import { BaronyGameStore } from './barony-game.store';
import { BaronyPlayerAiService } from './barony-player-ai.service';
import { BaronyPlayerLocalService } from './barony-player-local.service';
import { BaronyUiStore } from './barony-ui.store';

@Component({
  selector: 'barony-game-page',
  imports: [BaronyBoard, AsyncPipe],
  template: `
    <barony-board
      [lands]="lands$ | async"
      [logs]="logs$ | async"
      [turnPlayer]="turnPlayer$ | async"
      [currentPlayer]="currentPlayer$ | async"
      [players]="players$ | async"
      [message]="ui.message()"
      [validLands]="ui.validLands()"
      [validActions]="ui.validActions()"
      [validBuildings]="ui.validBuildings()"
      [validResources]="ui.validResources()"
      [canPass]="ui.canPass()"
      [canCancel]="ui.canCancel()"
      [maxNumberOfKnights]="ui.maxNumberOfKnights()"
      [endGame]="endGame$ | async"
      (playerSelect)="onPlayerSelect($event)"
      (buildingSelect)="onBuildingSelect($event)"
      (landTileClick)="onLandTileClick($event)"
      (actionClick)="onActionClick($event)"
      (passClick)="onPassClick()"
      (cancelClick)="onCancelClick()"
      (knightsConfirm)="onKnightsConfirm($event)"
      (resourceSelect)="onResourceSelect($event)"
    >
    </barony-board>
  `,
  providers: [
    BaronyGameStore,
    BaronyUiStore,
    BaronyPlayerAiService,
    BaronyPlayerLocalService,
    BaronyGameService,
  ],
})
export class BaronyGamePage implements OnInit {
  private game = inject(BaronyGameStore);
  protected ui = inject(BaronyUiStore);
  private route = inject(ActivatedRoute);
  private gameService = inject(BaronyGameService);

  private gameId = this.route.snapshot.paramMap.get('gameId')!;

  lands$ = this.game.selectLands$();
  logs$ = this.game.selectLogs$();
  endGame$ = this.game.selectEndGame$();

  turnPlayer$ = this.ui.selectTurnPlayer$();
  currentPlayer$ = this.ui.selectCurrentPlayer$();
  players$ = this.ui.selectPlayers$();

  async ngOnInit() {
    const stories = await this.gameService.loadGame(this.gameId);
    await this.gameService.game(stories);
  }

  onPlayerSelect(player: BaronyPlayer) {
    this.ui.setCurrentPlayer(player.id);
  }
  onBuildingSelect(building: BaronyBuilding) {
    this.ui.buildingSelect.emit(building);
  }
  onLandTileClick(landTile: BaronyLand) {
    this.ui.landSelect.emit(landTile);
  }
  onActionClick(action: BaronyAction) {
    this.ui.actionSelect.emit(action);
  }
  onPassClick() {
    this.ui.passSelect.emit();
  }
  onCancelClick() {
    this.ui.cancelSelect.emit();
  }
  onKnightsConfirm(numberOfKnights: number) {
    this.ui.numberOfKnightsSelect.emit(numberOfKnights);
  }
  onResourceSelect(resource: BaronyResourceType) {
    this.ui.resourceSelect.emit(resource);
  }
}
