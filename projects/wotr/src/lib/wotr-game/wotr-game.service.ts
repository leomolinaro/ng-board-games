import { Injectable, inject } from "@angular/core";
import { ABgGameService, BgAuthService, unexpectedStory } from "@leobg/commons";
import { EMPTY, Observable, expand, last, of, switchMap, tap } from "rxjs";
import { WotrFront } from "../wotr-components/front.models";
import { WotrFrontComponentsService } from "../wotr-components/front.service";
import { WotrPlayer } from "../wotr-game-state.models";
import { WotrRemoteService, WotrStoryDoc } from "../wotr-remote.service";
import { WotrRulesService } from "../wotr-rules/wotr-rules.service";
import { WotrDiscardCards, WotrDrawCards, WotrStory } from "../wotr-story.models";
import { WotrGameStore } from "./wotr-game.store";
import { WotrPlayerAiService } from "./wotr-player-ai.service";
import { WotrPlayerLocalService } from "./wotr-player-local.service";
import { WotrPlayerService } from "./wotr-player.service";
import { WotrUiStore } from "./wotr-ui.store";

@Injectable ()
export class WotrGameService extends ABgGameService<WotrFront, WotrPlayer, WotrStory, WotrPlayerService> {

  private game = inject (WotrGameStore);
  private rules = inject (WotrRulesService);
  private ui = inject (WotrUiStore);
  protected authService = inject (BgAuthService);
  private remoteService = inject (WotrRemoteService);
  protected aiService = inject (WotrPlayerAiService);
  protected localService = inject (WotrPlayerLocalService);

  private fronts = inject (WotrFrontComponentsService);

  protected storyDocs: WotrStoryDoc[] | null = null;

  protected getGameId () { return this.game.getGameId (); }
  protected getPlayer (playerId: WotrFront) { return this.game.getPlayer (playerId); }
  protected getGameOwner () { return this.game.getGameOwner (); }
  protected startTemporaryState () { this.game.startTemporaryState (); }
  protected endTemporaryState () { this.game.endTemporaryState (); }

  protected insertStoryDoc$ (storyId: string, story: WotrStoryDoc, gameId: string) { return this.remoteService.insertStory$ (storyId, story, gameId); }
  protected selectStoryDoc$ (storyId: string, gameId: string) { return this.remoteService.selectStory$ (storyId, gameId); }

  protected getCurrentPlayerId () { return this.ui.getCurrentPlayerId (); }
  protected setCurrentPlayer (playerId: WotrFront) { this.ui.setCurrentPlayer (playerId); }
  protected currentPlayerChange$ () { return this.ui.currentPlayerChange$ (); }
  protected cancelChange$ () { return this.ui.cancelChange$ (); }

  protected resetUi (turnPlayer: WotrFront) {
    this.ui.updateUi ("Reset UI", (s) => ({
      ...s,
      turnPlayer: turnPlayer,
      ...this.ui.resetUi (),
      canCancel: false,
      message: `${this.game.getPlayer (turnPlayer).name} is thinking...`,
    }));
  }

  game$ (stories: WotrStoryDoc[]): Observable<unknown> {
    this.storyDocs = stories;
    this.setup ();
    let roundNumber = 0;
    return this.round$ (++roundNumber).pipe (
      expand (continueGame => {
        if (continueGame) { return this.round$ (++roundNumber); }
        this.ui.updateUi ("End game", (s) => ({
          ...s,
          ...this.ui.resetUi (),
          canCancel: false,
        }));
        this.gameEnd ();
        return EMPTY;
      }),
      last (),
    );
  }

  setup () {
    this.game.logSetup ();
    const gameSetup = this.rules.setup.getGameSetup ();
    this.game.applySetup (gameSetup);
  }

  round$ (roundNumber: number): Observable<boolean> {
    this.game.logRound (roundNumber);
    return this.firstPhase$ ().pipe (
      switchMap (gameContinue => gameContinue ? this.fellowshipPhase$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.huntAllocation$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionRoll$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionResolution$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.victoryCheck$ (roundNumber) : of (false))
    );
    // return forEach (this.components.NATION_IDS, (nationId) =>
    //   this.nationTurn$ (nationId, roundId)
    // );
  }

  private firstPhase$ () {
    this.game.logPhase (1);
    return this.executeTasks$ (this.fronts.getAll ().map (
      front => ({ playerId: front, task$: p => p.firstPhaseDrawCards$ (front) })
    )).pipe (
      tap (stories => {
        this.fronts.getAll ().forEach ((front, index) => {
          const story = stories[index];
          if (!this.validateFirstPhaseDrawCards$ (story)) { throw unexpectedStory (story); }
          const drawCards = story.actions[0];
          this.game.applyDrawCards (drawCards, front);
          const discardCards = story.actions[1];
          if (discardCards) {
            this.game.applyDiscardCards (discardCards, front);
          }
        });
      })
    );
  }

  private validateFirstPhaseDrawCards$ (story: WotrStory): story is Omit<WotrStory, "actions"> & { actions: [WotrDrawCards] | [WotrDrawCards, WotrDiscardCards] } {
    return true;
  }

  private fellowshipPhase$ () {
    this.game.logPhase (2);
    return of (true);
  }

  private huntAllocation$ () {
    this.game.logPhase (3);
    return of (true);
  }

  private actionRoll$ () {
    this.game.logPhase (4);
    return of (true);
  }

  private actionResolution$ () {
    this.game.logPhase (5);
    return of (true);
  }

  private victoryCheck$ (roundNumber: number) {
    this.game.logPhase (6);
    return of (roundNumber < 6);
  }

  private gameEnd () {
    this.game.logEndGame ();
  }

  // nationTurn$ (nationId: WotrNationId, roundId: WotrRoundId): Observable<void> {
  //   if (
  //     this.rules.populationIncrease.isNationActive (nationId, this.game.get ())
  //   ) {
  //     this.game.logNationTurn (nationId);
  //     const player = this.game.getPlayerByNation (nationId)!;
  //     return this.populationIncreasePhase$ (nationId, player.id, roundId).pipe (
  //       switchMap (() => this.movementPhase$ (nationId, player.id)),
  //       switchMap (() => this.battlesRetreatsPhase$ (nationId, player.id)),
  //       switchMap (() => this.raiderWithdrawalPhase$ (nationId, player.id)),
  //       switchMap (() => this.overpopulationPhase$ (nationId, player.id))
  //     );
  //   } else {
  //     return of (void 0);
  //   }
  // }

  // private populationIncreasePhase$ (
  //   nationId: WotrNationId,
  //   playerId: WotrPlayerId,
  //   roundId: WotrRoundId
  // ): Observable<void> {
  //   this.game.logPhase ("populationIncrease");
  //   const data = this.rules.populationIncrease.calculatePopulationIncreaseData (
  //     nationId,
  //     roundId,
  //     this.game.get ()
  //   );
  //   switch (data.type) {
  //     case "infantry-placement": {
  //       if (data.nInfantries) {
  //         return this.executeTask$ (playerId, (p) =>
  //           p.armyPlacement$ (data.nInfantries, nationId, playerId)
  //         ).pipe (
  //           map ((armyPlacement) => {
  //             const infantryPlacement: {
  //               areaId: WotrLandAreaId;
  //               quantity: number;
  //             }[] = [];
  //             for (const ip of armyPlacement.infantryPlacement) {
  //               infantryPlacement.push (
  //                 typeof ip === "object" ? ip : { areaId: ip, quantity: 1 }
  //               );
  //             }
  //             this.game.applyPopulationIncrease (
  //               data.populationMarker,
  //               infantryPlacement,
  //               nationId
  //             );
  //             for (const ip of infantryPlacement) {
  //               this.game.logInfantryPlacement (ip.areaId, ip.quantity);
  //             }
  //             this.game.logPopulationMarkerSet (data.populationMarker);
  //             return void 0;
  //           })
  //         );
  //       } else {
  //         this.game.applyPopulationIncrease (
  //           data.populationMarker,
  //           [],
  //           nationId
  //         );
  //         this.game.logPopulationMarkerSet (data.populationMarker);
  //         return of (void 0);
  //       }
  //     }
  //     case "roman-reinforcements": {
  //       if (data.nInfantries) {
  //         this.game.applyPopulationIncrease (
  //           null,
  //           [{ areaId: "english-channel", quantity: data.nInfantries }],
  //           nationId
  //         );
  //       }
  //       this.game.logInfantryReinforcements (
  //         "english-channel",
  //         data.nInfantries
  //       );
  //       return of (void 0);
  //     }
  //   }
  // }

  // private movementPhase$ (nationId: WotrNationId, playerId: WotrPlayerId) {
  //   this.game.logPhase ("movement");
  //   return this.executeTask$ (playerId, (p) =>
  //     p.armyMovements$ (nationId, playerId)
  //   ).pipe (
  //     map ((armyMovements) => {
  //       if (armyMovements.movements?.length) {
  //         this.game.applyArmyMovements (armyMovements, true);
  //         for (const movement of armyMovements.movements) {
  //           this.game.logArmyMovement (movement.units, movement.toAreaId);
  //         }
  //       }
  //       return void 0;
  //     })
  //   );
  // }

  // private battlesRetreatsPhase$ (
  //   nationId: WotrNationId,
  //   playerId: WotrPlayerId
  // ) {
  //   this.game.logPhase ("battlesRetreats");
  //   if (
  //     this.rules.battlesRetreats.hasBattlesToResolve (nationId, this.game.get ())
  //   ) {
  //     return this.executeTask$ (playerId, (p) =>
  //       p.battleInitiation$ (nationId, playerId)
  //     ).pipe (
  //       map ((battleInitiation) => {
  //         console.log ("battleInitiation", battleInitiation);
  //         return void 0;
  //       })
  //     );
  //   } else {
  //     return of (void 0);
  //   }
  // }

  // private raiderWithdrawalPhase$ (
  //   nationId: WotrNationId,
  //   playerId: WotrPlayerId
  // ) {
  //   this.game.logPhase ("raiderWithdrawal");
  //   return of (void 0);
  // }

  // private overpopulationPhase$ (nationId: WotrNationId, playerId: WotrPlayerId) {
  //   this.game.logPhase ("overpopulation");
  //   return of (void 0);
  // }

}
