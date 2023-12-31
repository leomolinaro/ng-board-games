import { Injectable } from "@angular/core";
import { ABgGameService, BgAuthService, forEach, forN } from "@leobg/commons";
import { Observable, of } from "rxjs";
import { map, switchMap, tap } from "rxjs/operators";
import {
  BritLandAreaId,
  BritNationId,
  BritRoundId,
} from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritPlayer, BritPlayerId } from "../brit-game-state.models";
import { BritRemoteService, BritStoryDoc } from "../brit-remote.service";
import { BritRulesService } from "../brit-rules/brit-rules.service";
import { BritStory } from "../brit-story.models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerAiService } from "./brit-player-ai.service";
import { BritPlayerLocalService } from "./brit-player-local.service";
import { BritPlayerService } from "./brit-player.service";
import { BritUiStore } from "./brit-ui.store";

@Injectable ()
export class BritGameService extends ABgGameService<
BritPlayer,
BritStory,
BritPlayerService
> {
  constructor (
    private rules: BritRulesService,
    private game: BritGameStore,
    private ui: BritUiStore,
    protected authService: BgAuthService,
    private remoteService: BritRemoteService,
    protected aiService: BritPlayerAiService,
    protected localService: BritPlayerLocalService,
    private components: BritComponentsService
  ) {
    super ();
  }

  protected stories: BritStoryDoc[] | null = null;

  protected getGameId () {
    return this.game.getGameId ();
  }
  protected getPlayer (playerId: string) {
    return this.game.getPlayer (playerId);
  }
  protected getGameOwner () {
    return this.game.getGameOwner ();
  }
  protected startTemporaryState () {
    this.game.startTemporaryState ();
  }
  protected endTemporaryState () {
    this.game.endTemporaryState ();
  }

  protected insertStory$<S extends BritStory> (
    story: S,
    storyId: number,
    gameId: string
  ): Observable<S> {
    return this.remoteService.insertStory$ (
      {
        id: storyId,
        ...(story),
      },
      gameId
    ) as any as Observable<S>;
  } // insertStory$

  protected selectStory$ (storyId: number, gameId: string) {
    return this.remoteService.selectStory$ (storyId, gameId);
  }

  protected getCurrentPlayerId () {
    return this.ui.getCurrentPlayerId ();
  }
  protected setCurrentPlayer (playerId: string) {
    this.ui.setCurrentPlayer (playerId);
  }
  protected currentPlayerChange$ () {
    return this.ui.currentPlayerChange$ ();
  }
  protected cancelChange$ () {
    return this.ui.cancelChange$ ();
  }

  protected resetUi (player: string) {
    this.ui.updateUi ("Reset UI", (s) => ({
      ...s,
      turnPlayer: player,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.game.getPlayer (player).name} is thinking...`,
    }));
  } // resetUi

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
  } // game$

  setup () {
    this.game.logSetup ();
    const gameSetup = this.rules.setup.getGameSetup ();
    this.game.applySetup (gameSetup);
  } // setup

  round$ (roundId: BritRoundId): Observable<void> {
    this.game.logRound (roundId);
    return forEach (this.components.NATION_IDS, (nationId) =>
      this.nationTurn$ (nationId, roundId)
    );
  } // round$

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
    } // if - else
  } // nationTurn$

  private populationIncreasePhase$ (
    nationId: BritNationId,
    playerId: BritPlayerId,
    roundId: BritRoundId
  ): Observable<void> {
    this.game.logPhase ("populationIncrease");
    const data = this.rules.populationIncrease.calculatePopulationIncreaseData (
      nationId,
      roundId,
      this.game.get ()
    );
    switch (data.type) {
      case "infantry-placement": {
        if (data.nInfantries) {
          return this.executeTask$ (playerId, (p) =>
            p.armyPlacement$ (data.nInfantries, nationId, playerId)
          ).pipe (
            map ((armyPlacement) => {
              const infantryPlacement: {
                areaId: BritLandAreaId;
                quantity: number;
              }[] = [];
              for (const ip of armyPlacement.infantryPlacement) {
                infantryPlacement.push (
                  typeof ip === "object" ? ip : { areaId: ip, quantity: 1 }
                );
              } // for
              this.game.applyPopulationIncrease (
                data.populationMarker,
                infantryPlacement,
                nationId
              );
              for (const ip of infantryPlacement) {
                this.game.logInfantryPlacement (ip.areaId, ip.quantity);
              } // for
              this.game.logPopulationMarkerSet (data.populationMarker);
              return void 0;
            })
          );
        } else {
          this.game.applyPopulationIncrease (
            data.populationMarker,
            [],
            nationId
          );
          this.game.logPopulationMarkerSet (data.populationMarker);
          return of (void 0);
        } // if - else
      } // case
      case "roman-reinforcements": {
        if (data.nInfantries) {
          this.game.applyPopulationIncrease (
            null,
            [{ areaId: "english-channel", quantity: data.nInfantries }],
            nationId
          );
        } // if
        this.game.logInfantryReinforcements (
          "english-channel",
          data.nInfantries
        );
        return of (void 0);
      } // case
    } // if - else
  } // populationIncreasePhase$

  private movementPhase$ (nationId: BritNationId, playerId: BritPlayerId) {
    this.game.logPhase ("movement");
    return this.executeTask$ (playerId, (p) =>
      p.armyMovements$ (nationId, playerId)
    ).pipe (
      map ((armyMovements) => {
        if (armyMovements.movements?.length) {
          this.game.applyArmyMovements (armyMovements, true);
          for (const movement of armyMovements.movements) {
            this.game.logArmyMovement (movement.units, movement.toAreaId);
          } // for
        } // if
        return void 0;
      })
    );
  } // movement$

  private battlesRetreatsPhase$ (
    nationId: BritNationId,
    playerId: BritPlayerId
  ) {
    this.game.logPhase ("battlesRetreats");
    if (
      this.rules.battlesRetreats.hasBattlesToResolve (nationId, this.game.get ())
    ) {
      return this.executeTask$ (playerId, (p) =>
        p.battleInitiation$ (nationId, playerId)
      ).pipe (
        map ((battleInitiation) => {
          console.log ("battleInitiation", battleInitiation);
          return void 0;
        })
      );
    } else {
      return of (void 0);
    } // if - else
  } // battlesRetreatsPhase$

  private raiderWithdrawalPhase$ (
    nationId: BritNationId,
    playerId: BritPlayerId
  ) {
    this.game.logPhase ("raiderWithdrawal");
    return of (void 0);
  } // raiderWithdrawalPhase$

  private overpopulationPhase$ (nationId: BritNationId, playerId: BritPlayerId) {
    this.game.logPhase ("overpopulation");
    return of (void 0);
  } // overpopulationPhase$
} // BritGameService
