import { inject, Injectable } from '@angular/core';
import { ABgGameService, BgAuthService, type BgUser } from '@leobg/commons';
import { from, type Observable } from 'rxjs';
import type {
  BritColor,
  BritLandAreaId,
  BritNationId,
  BritRoundId,
} from '../brit-components.models';
import { BritComponents } from '../brit-components.service';
import type { BritPlayer } from '../brit-game-state.models';
import type { BritStoryDoc } from '../brit-remote.service';
import { BritRemoteService } from '../brit-remote.service';
import { BritRulesService } from '../brit-rules/brit-rules.service';
import type { BritStory } from '../brit-story.models';
import { BritGameStore } from './brit-game.store';
import { BritPlayerAiService } from './brit-player-ai.service';
import { BritPlayerLocalService } from './brit-player-local.service';
import type { BritPlayerService } from './brit-player.service';
import { BritUiStore } from './brit-ui.store';

@Injectable()
export class BritGameService extends ABgGameService<
  BritColor,
  BritPlayer,
  BritStory,
  BritPlayerService
> {
  private rules = inject(BritRulesService);
  private gameStore = inject(BritGameStore);
  private ui = inject(BritUiStore);
  protected auth = inject(BgAuthService);
  private remoteService = inject(BritRemoteService);
  protected aiPlayer = inject(BritPlayerAiService);
  protected localPlayer = inject(BritPlayerLocalService);
  private components = inject(BritComponents);

  protected storyDocs: BritStoryDoc[] | undefined = undefined;

  protected getGameId(): string {
    return this.gameStore.gameId();
  }
  protected getPlayer(playerColor: BritColor): BritPlayer {
    return this.gameStore.getPlayer(playerColor);
  }
  protected getGameOwner(): BgUser {
    const owner = this.gameStore.gameOwner();
    if (!owner) throw new Error('Game owner not set');
    return owner;
  }
  protected startTemporaryState(): void {
    this.gameStore.startTemporaryState();
  }
  protected endTemporaryState(): void {
    this.gameStore.endTemporaryState();
  }

  protected insertStoryDoc$(
    storyId: string,
    story: BritStoryDoc,
    gameId: string,
  ): Observable<BritStoryDoc> {
    return from(this.remoteService.insertStory(storyId, story, gameId));
  }
  protected selectStoryDoc$(
    storyId: string,
    gameId: string,
  ): Observable<BritStoryDoc | undefined> {
    return this.remoteService.selectStory$(storyId, gameId);
  }

  protected override getCurrentPlayerId(): BritColor | undefined {
    return this.ui.currentPlayer();
  }
  protected override setCurrentPlayer(playerId: BritColor): void {
    this.ui.setCurrentPlayer(playerId);
  }
  protected override currentPlayerChange$(): Observable<BritColor | undefined> {
    return from(this.ui.player.get());
  }
  protected override cancelChange$(): Observable<void> {
    return from(this.ui.cancel.get());
  }

  protected resetUi(turnPlayer: BritColor): void {
    this.ui.updateUi('Reset UI', (s) => ({
      ...s,
      turnPlayer: turnPlayer,
      ...this.ui.resetUi(),
      canCancel: false,
      message: `${this.gameStore.getPlayer(turnPlayer).name} is thinking...`,
    }));
  }

  async game(stories: BritStoryDoc[]): Promise<void> {
    this.storyDocs = stories;
    this.setup();
    for (let index = 0; index < 16; index++) {
      await this.round((index + 1) as BritRoundId);
    }
    this.ui.updateUi('End game', (s) => ({
      ...s,
      ...this.ui.resetUi(),
    }));
  }

  setup(): void {
    this.gameStore.logSetup();
    const gameSetup = this.rules.setup.getGameSetup();
    this.gameStore.applySetup(gameSetup);
  }

  async round(roundId: BritRoundId): Promise<void> {
    this.gameStore.logRound(roundId);
    for (const nationId of this.components.NATION_IDS) {
      await this.nationTurn(nationId, roundId);
    }
  }

  async nationTurn(
    nationId: BritNationId,
    roundId: BritRoundId,
  ): Promise<void> {
    if (
      !this.rules.populationIncrease.isNationActive(nationId, this.gameStore)
    ) {
      return;
    }

    this.gameStore.logNationTurn(nationId);
    const player = this.gameStore.getPlayerByNation(nationId)!;
    await this.populationIncreasePhase(nationId, player.id, roundId);
    await this.movementPhase(nationId, player.id);
    await this.battlesRetreatsPhase(nationId, player.id);
    this.raiderWithdrawalPhase();
    this.overpopulationPhase();
  }

  private async populationIncreasePhase(
    nationId: BritNationId,
    playerId: BritColor,
    roundId: BritRoundId,
  ): Promise<void> {
    this.gameStore.logPhase('populationIncrease');
    const data = this.rules.populationIncrease.calculatePopulationIncreaseData(
      nationId,
      roundId,
      this.gameStore,
    );
    switch (data.type) {
      case 'infantry-placement': {
        if (data.nInfantries) {
          const armyPlacement = await this.executeTask(playerId, (p) =>
            p.armyPlacement(data.nInfantries, nationId, playerId),
          );
          const infantryPlacement: {
            areaId: BritLandAreaId;
            quantity: number;
          }[] = Array.from(armyPlacement.infantryPlacement, (ip) =>
            typeof ip === 'object' ? ip : { areaId: ip, quantity: 1 },
          );
          this.gameStore.applyPopulationIncrease(
            data.populationMarker,
            infantryPlacement,
            nationId,
          );
          for (const ip of infantryPlacement) {
            this.gameStore.logInfantryPlacement(ip.areaId, ip.quantity);
          }
        } else {
          this.gameStore.applyPopulationIncrease(
            data.populationMarker,
            [],
            nationId,
          );
        }
        this.gameStore.logPopulationMarkerSet(data.populationMarker);
        break;
      }
      case 'roman-reinforcements': {
        if (data.nInfantries) {
          this.gameStore.applyPopulationIncrease(
            undefined,
            [{ areaId: 'english-channel', quantity: data.nInfantries }],
            nationId,
          );
        }
        this.gameStore.logInfantryReinforcements(
          'english-channel',
          data.nInfantries,
        );
        break;
      }
    }
  }

  private async movementPhase(
    nationId: BritNationId,
    playerId: BritColor,
  ): Promise<void> {
    this.gameStore.logPhase('movement');
    const armyMovements = await this.executeTask(playerId, (p) =>
      p.armyMovements(nationId, playerId),
    );
    if (armyMovements.movements?.length) {
      this.gameStore.applyArmyMovements(armyMovements, true);
      for (const movement of armyMovements.movements) {
        this.gameStore.logArmyMovement(movement.units, movement.toAreaId);
      }
    }
  }

  private async battlesRetreatsPhase(
    nationId: BritNationId,
    playerId: BritColor,
  ): Promise<void> {
    this.gameStore.logPhase('battlesRetreats');
    if (this.rules.battlesRetreats.hasBattlesToResolve(this.gameStore)) {
      const battleInitiation = await this.executeTask(playerId, (p) =>
        p.battleInitiation(nationId, playerId),
      );
      console.log('battleInitiation', battleInitiation);
    }
  }

  private raiderWithdrawalPhase(): void {
    this.gameStore.logPhase('raiderWithdrawal');
  }

  private overpopulationPhase(): void {
    this.gameStore.logPhase('overpopulation');
  }
}
