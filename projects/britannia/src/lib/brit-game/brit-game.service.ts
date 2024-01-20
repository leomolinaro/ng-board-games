import { Injectable } from "@angular/core";
import { ABgGameService, BgAuthService } from "@leobg/commons";
import { forEach, forN } from "@leobg/commons/utils";
import { Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import { BritColor, BritLandAreaId, BritNationId, BritRoundId } from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritPlayer } from "../brit-game-state.models";
import { BritRemoteService, BritStoryDoc } from "../brit-remote.service";
import { BritRulesService } from "../brit-rules/brit-rules.service";
import { BritStory } from "../brit-story.models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerAiService } from "./brit-player-ai.service";
import { BritPlayerLocalService } from "./brit-player-local.service";
import { BritPlayerService } from "./brit-player.service";
import { BritUiStore } from "./brit-ui.store";

@Injectable ()
export class BritGameService extends ABgGameService<BritColor, BritPlayer, BritStory, BritPlayerService> {

  constructor (
    private rules: BritRulesService,
    private game: BritGameStore,
    private ui: BritUiStore,
    protected authService: BgAuthService,
    private remoteService: BritRemoteService,
    protected aiService: BritPlayerAiService,
    protected localService: BritPlayerLocalService,
    private components: BritComponentsService
  ) { super (); }

  protected stories: BritStoryDoc[] | null = null;

  protected getGameId () { return this.game.getGameId (); }
  protected getPlayer (playerColor: BritColor) { return this.game.getPlayer (playerColor); }
  protected getGameOwner () { return this.game.getGameOwner (); }
  protected startTemporaryState () { this.game.startTemporaryState (); }
  protected endTemporaryState () { this.game.endTemporaryState (); }

  protected insertStory$ (story: BritStoryDoc, gameId: string) { return this.remoteService.insertStory$ (story, gameId); }
  protected selectStory$ (storyId: number, gameId: string) { return this.remoteService.selectStory$ (storyId, gameId); }

  protected getCurrentPlayerId () { return this.ui.getCurrentPlayerId (); }
  protected setCurrentPlayer (playerId: BritColor) { this.ui.setCurrentPlayer (playerId); }
  protected currentPlayerChange$ () { return this.ui.currentPlayerChange$ (); }
  protected cancelChange$ () { return this.ui.cancelChange$ (); }

  protected resetUi (turnPlayer: BritColor) {
    this.ui.updateUi ("Reset UI", (s) => ({
      ...s,
      turnPlayer: turnPlayer,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.game.getPlayer (turnPlayer).name} is thinking...`,
    }));
  }

  game$ (stories: BritStoryDoc[]): Observable<void> {
    this.stories = stories;
    this.setup ();
    return forN (16, (index) => this.round$ ((index + 1) as BritRoundId)).pipe (
      tap (() => {
        this.ui.updateUi ("End game", (s) => ({
          ...s,
          ...this.ui.resetUi (),
        }));
      })
    );
  }

  setup () {
    this.game.logSetup ();
    const gameSetup = this.rules.setup.getGameSetup ();
    this.game.applySetup (gameSetup);
  }

  round$ (roundId: BritRoundId): Observable<void> {
    this.game.logRound (roundId);
    return forEach (this.components.NATION_IDS, (nationId) =>
      this.nationTurn$ (nationId, roundId)
    );
  }

  nationTurn$ (nationId: BritNationId, roundId: BritRoundId): Observable<void> {
    if (
      this.rules.populationIncrease.isNationActive (nationId, this.game.get ())
    ) {
      this.game.logNationTurn (nationId);
      const player = this.game.getPlayerByNation (nationId)!;
      return this.populationIncreasePhase$ (nationId, player.id, roundId).pipe (
        switchMap (() => this.movementPhase$ (nationId, player.id)),
        switchMap (() => this.battlesRetreatsPhase$ (nationId, player.id)),
        switchMap (() => this.raiderWithdrawalPhase$ (nationId, player.id)),
        switchMap (() => this.overpopulationPhase$ (nationId, player.id))
      );
    } else {
      return of (void 0);
    }
  }

  private populationIncreasePhase$ (nationId: BritNationId, playerId: BritColor, roundId: BritRoundId): Observable<void> {
    this.game.logPhase ("populationIncrease");
    const data = this.rules.populationIncrease.calculatePopulationIncreaseData (nationId, roundId, this.game.get ());
    switch (data.type) {
      case "infantry-placement": {
        if (data.nInfantries) {
          return this.executeTask$ (playerId, (p) => p.armyPlacement$ (data.nInfantries, nationId, playerId)).pipe (
            map ((armyPlacement) => {
              const infantryPlacement: { areaId: BritLandAreaId; quantity: number; }[] = [];
              for (const ip of armyPlacement.infantryPlacement) {
                infantryPlacement.push (
                  typeof ip === "object" ? ip : { areaId: ip, quantity: 1 }
                );
              }
              this.game.applyPopulationIncrease (data.populationMarker, infantryPlacement, nationId);
              for (const ip of infantryPlacement) {
                this.game.logInfantryPlacement (ip.areaId, ip.quantity);
              }
              this.game.logPopulationMarkerSet (data.populationMarker);
              return void 0;
            })
          );
        } else {
          this.game.applyPopulationIncrease (data.populationMarker, [], nationId);
          this.game.logPopulationMarkerSet (data.populationMarker);
          return of (void 0);
        }
      }
      case "roman-reinforcements": {
        if (data.nInfantries) {
          this.game.applyPopulationIncrease (null, [{ areaId: "english-channel", quantity: data.nInfantries }], nationId);
        }
        this.game.logInfantryReinforcements ("english-channel", data.nInfantries);
        return of (void 0);
      }
    }
  }

  private movementPhase$ (nationId: BritNationId, playerId: BritColor) {
    this.game.logPhase ("movement");
    return this.executeTask$ (playerId, (p) => p.armyMovements$ (nationId, playerId)).pipe (
      map ((armyMovements) => {
        if (armyMovements.movements?.length) {
          this.game.applyArmyMovements (armyMovements, true);
          for (const movement of armyMovements.movements) {
            this.game.logArmyMovement (movement.units, movement.toAreaId);
          }
        }
        return void 0;
      })
    );
  }

  private battlesRetreatsPhase$ (nationId: BritNationId, playerId: BritColor) {
    this.game.logPhase ("battlesRetreats");
    if (this.rules.battlesRetreats.hasBattlesToResolve (nationId, this.game.get ())) {
      return this.executeTask$ (playerId, (p) => p.battleInitiation$ (nationId, playerId)).pipe (
        map ((battleInitiation) => {
          console.log ("battleInitiation", battleInitiation);
          return void 0;
        })
      );
    } else {
      return of (void 0);
    }
  }

  private raiderWithdrawalPhase$ (nationId: BritNationId, playerId: BritColor) {
    this.game.logPhase ("raiderWithdrawal");
    return of (void 0);
  }

  private overpopulationPhase$ (nationId: BritNationId, playerId: BritColor) {
    this.game.logPhase ("overpopulation");
    return of (void 0);
  }
}
