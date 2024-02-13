import { Injectable, inject } from "@angular/core";
import { EMPTY, Observable, expand, last, of, switchMap, tap } from "rxjs";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrGameStore } from "../wotr-elements/wotr-game.store";
import { WotrRulesService } from "../wotr-rules/wotr-rules.service";
import { WotrStoryService } from "./wotr-story.service";

@Injectable ()
export class WotrFlowService {

  private store = inject (WotrGameStore);
  private rules = inject (WotrRulesService);
  private story = inject (WotrStoryService);

  game$ (): Observable<unknown> {
    this.setup ();
    let roundNumber = 0;
    return this.round$ (++roundNumber).pipe (
      expand (continueGame => {
        if (continueGame) { return this.round$ (++roundNumber); }
        this.store.logEndGame ();
        return EMPTY;
      }),
      last (),
    );
  }

  setup () {
    const gameSetup = this.rules.setup.getGameSetup ();
    this.store.applySetup (gameSetup);
  }

  round$ (roundNumber: number): Observable<boolean> {
    this.store.logRound (roundNumber);
    return this.firstPhase$ ().pipe (
      switchMap (gameContinue => gameContinue ? this.fellowshipPhase$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.huntAllocation$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionRoll$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.actionResolution$ () : of (false)),
      switchMap (gameContinue => gameContinue ? this.victoryCheck$ (roundNumber) : of (false))
    );
  }

  private firstPhase$ () {
    this.store.logPhase (1);
    return this.story.executeTasks$ (this.store.getFrontIds ().map (
      front => ({ playerId: front, task$: p => p.firstPhaseDrawCards$ (front) })
    )).pipe (
      tap (stories => {
        this.store.getFrontIds ().forEach ((frontId, index) => {
          const story = stories[index];
          this.store.applyActions (story.actions, frontId);
        });
      })
    );
  }

  private fellowshipPhase$ () {
    this.store.logPhase (2);
    return of (true);
  }

  private huntAllocation$ () {
    this.store.logPhase (3);
    return this.story.executeTask$ ("shadow", p => p.huntAllocation$! ()).pipe (
      tap (story => {
        this.store.applyActions (story.actions, "shadow");
      })
    );
  }

  private actionRoll$ () {
    this.store.logPhase (4);
    return this.story.executeTasks$ (this.store.getFrontIds ().map (
      front => ({ playerId: front, task$: p => p.rollActionDice$! (front) })
    )).pipe (
      tap (stories => {
        this.store.getFrontIds ().forEach ((frontId, index) => {
          const story = stories[index];
          this.store.applyActions (story.actions, frontId);
        });
      })
    );
  }

  private actionResolution$ () {
    this.store.logPhase (5);
    return of (true);
    // return this.executeTask$ (++roundNumber).pipe (
    //   expand (continueGame => {
    //     if (continueGame) { return this.round$ (++roundNumber); }
    //     return EMPTY;
    //   }),
    //   last (),
    // );
  }

  private frontActionResolution$ (frontId: WotrFrontId) {
    return this.story.executeTask$ (frontId, p => p.actionResolution$! (frontId)).pipe (
      tap (story => {
        // if (story.die) {
        //   this.store.discardDie (story.die, frontId);
        // }
      })
    );
  }

  private victoryCheck$ (roundNumber: number) {
    this.store.logPhase (6);
    return of (roundNumber < 6);
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
