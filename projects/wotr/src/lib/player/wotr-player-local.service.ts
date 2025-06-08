import { inject, Injectable } from "@angular/core";
import { rollActionDice } from "../action/wotr-action-die-actions";
import { WotrActionDieRules } from "../action/wotr-action-die.rules";
import { WotrActionPlayerService } from "../action/wotr-action-player.service";
import { WotrActionDie } from "../action/wotr-action.models";
import { drawCardIds } from "../card/wotr-card-actions";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import { declareFellowship, notDeclareFellowship } from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrFrontStore } from "../front/wotr-front.store";
import { WotrGameUiStore } from "../game/wotr-game-ui.store";
import { WotrGameStory } from "../game/wotr-story.models";
import { allocateHuntDice } from "../hunt/wotr-hunt-actions";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrPlayer } from "./wotr-player";
import { WotrPlayerService } from "./wotr-player.service";

@Injectable()
export class WotrPlayerLocalService implements WotrPlayerService {
  private front = inject(WotrFrontStore);
  private ui = inject(WotrGameUiStore);
  private fellowship = inject(WotrFellowshipStore);
  private hunt = inject(WotrHuntStore);
  private actionDieRules = inject(WotrActionDieRules);
  private playerActionService = inject(WotrActionPlayerService);

  async firstPhase(player: WotrPlayer): Promise<WotrGameStory> {
    await this.ui.askContinue("Draw cards");
    const characterDeck = this.front.characterDeck(player.frontId);
    const strategyDeck = this.front.strategyDeck(player.frontId);
    const drawnCards: WotrCardId[] = [];
    if (characterDeck.length) {
      drawnCards.push(characterDeck[0]);
    }
    if (strategyDeck.length) {
      drawnCards.push(strategyDeck[0]);
    }
    this.front.drawCards(drawnCards, player.frontId);
    await this.ui.askContinue("Continue");
    return { type: "phase", actions: [drawCardIds(...drawnCards)] };
  }

  async fellowshipPhase(): Promise<WotrGameStory> {
    const declare = await this.ui.askConfirm("Do you want to declare the fellowship?");
    if (!declare) {
      return { type: "phase", actions: [notDeclareFellowship()] };
    }
    const validRegions = this.fellowship.validRegionsForDeclaration();
    const region = await this.ui.askRegion(validRegions);
    return { type: "phase", actions: [declareFellowship(region)] };
  }

  async huntAllocationPhase(): Promise<WotrGameStory> {
    const min = this.hunt.minimumNumberOfHuntDice();
    const max = this.hunt.maximumNumberOfHuntDice();
    const quantity = await this.ui.askQuantity("How many hunt dice do you want to allocate?", min, max);
    return { type: "phase", actions: [allocateHuntDice(quantity)] };
  }

  async rollActionDice(player: WotrPlayer): Promise<WotrGameStory> {
    await this.ui.askContinue("Roll action dice");
    const nActionDice = this.actionDieRules.rollableActionDice(player.frontId);
    const actionDice: WotrActionDie[] = [];
    for (let i = 0; i < nActionDice; i++) {
      actionDice.push(this.actionDieRules.rollActionDie(player.frontId));
    }
    return { type: "phase", actions: [rollActionDice(...actionDice)] };
  }

  async actionResolution(player: WotrPlayer): Promise<WotrGameStory> {
    return this.playerActionService.actionResolution(player);
  }

  async separateCompanions(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async rollHuntDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async reRollHuntDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async drawHuntTile(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async huntEffect(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async revealFellowship(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async activateTableCard(cardId: WotrCardId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async activateCombatCard(cardId: WotrCardId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async activateCharacterAbility(characterId: WotrCharacterId): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async forfeitLeadership(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async wantRetreatIntoSiege(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async wantRetreat(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async chooseCombatCard(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async rollCombatDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async reRollCombatDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async chooseCasualties(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async battleAdvance(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async wantContinueBattle(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  //   this.ui.updateUi ("asd", s => ({
  //     ...s,
  //     // ...this.ui.resetUi (),
  //     // turnPlayer: playerId,
  //     message: `[${front}] Draw cards`,
  //     // validAreas: validLands,
  //     // canCancel: iInfantry !== 1,
  //   }));
  //   await firstValueFrom (this.ui.testChange$ ());
  //     map (() => ({
  //       phase: 1,
  //       actions: [{ type: "card-draw", cards: ["fpcha01"] }]
  //     }))
  //   );
  // }

  // armyPlacement$ (nInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyPlacement> {
  //   const placement: WotrArmyPlacement = {
  //     infantryPlacement: [],
  //   };
  //   return forN (nInfantries, (index) => {
  //     return this.chooseLandForPlacement$ (index + 1, nInfantries, nationId, playerId).pipe (
  //       map ((landAreaId) => {
  //         this.game.applyInfantryPlacement (landAreaId, nationId);
  //         const ipIndex = placement.infantryPlacement.findIndex ((ip) => (typeof ip === "object" ? ip.areaId : ip) === landAreaId);
  //         if (ipIndex >= 0) {
  //           let ip = placement.infantryPlacement[ipIndex];
  //           ip = { areaId: landAreaId, quantity: typeof ip === "object" ? ip.quantity + 1 : 2 };
  //           placement.infantryPlacement[ipIndex] = ip;
  //         } else {
  //           placement.infantryPlacement.push (landAreaId);
  //         } // if - else
  //         return void 0;
  //       })
  //     );
  //   }).pipe (mapTo (placement));
  // } // armiesPlacement$

  // private chooseLandForPlacement$ (iInfantry: number, nTotInfantries: number, nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrLandAreaId> {
  //   const validLands = this.rules.populationIncrease.getValidLandsForPlacement (nationId, playerId, this.game.get ());
  //   this.ui.updateUi ("Choose land for placement", (s) => ({
  //     ...s,
  //     ...this.ui.resetUi (),
  //     turnPlayer: playerId,
  //     message: `Choose a land area to place an infantry on (${iInfantry} / ${nTotInfantries}).`,
  //     validAreas: validLands,
  //     canCancel: iInfantry !== 1,
  //   }));
  //   return this.ui.areaChange$<WotrLandAreaId> ();
  // } // chooseLandForRecruitment$

  // armyMovements$ (nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrArmyMovements> {
  //   const armyMovements: WotrArmyMovements = { movements: [] };
  //   return this.armyMovement$ (nationId, playerId, armyMovements.movements).pipe (
  //     expand<WotrArmyMovement | "pass", Observable<WotrArmyMovement | "pass">> ((movementOrPass) => {
  //       if (movementOrPass === "pass") {
  //         return EMPTY;
  //       } else {
  //         armyMovements.movements.push (movementOrPass);
  //         this.game.applyArmyMovement (movementOrPass, true);
  //         return this.armyMovement$ (
  //           nationId,
  //           playerId,
  //           armyMovements.movements
  //         );
  //       } // if - else
  //     }),
  //     last (),
  //     mapTo (armyMovements)
  //   );
  // } // armyMovements$

  // private armyMovement$ (nationId: WotrNationId, playerId: WotrPlayerId, movements: WotrArmyMovement[]): Observable<WotrArmyMovement | "pass"> {
  //   return this.chooseUnitsForMovement$ (nationId, playerId, movements).pipe (
  //     map ((unitsOrPass) => unitsOrPass === "pass" ? "pass" : { units: unitsOrPass, toAreaId: null! }),
  //     expand<WotrArmyMovement | "pass", Observable<WotrArmyMovement | "pass">> ((armyMovementOrPass) => {
  //       if (armyMovementOrPass === "pass") {
  //         return EMPTY;
  //       } else if (armyMovementOrPass.toAreaId) {
  //         return EMPTY;
  //       } else {
  //         this.ui.updateUi ("Units selected", (s) => ({ ...s, selectedUnits: armyMovementOrPass.units }));
  //         if (armyMovementOrPass.units.length) {
  //           return this.chooseUnitsOrAreaForMovement$ (nationId, playerId, armyMovementOrPass.units).pipe (
  //             map ((unitsOrAreaId) => {
  //               if (typeof unitsOrAreaId === "string") {
  //                 return { ...armyMovementOrPass, toAreaId: unitsOrAreaId };
  //               } else {
  //                 return { ...armyMovementOrPass, units: unitsOrAreaId };
  //               } // if - else
  //             })
  //           );
  //         } else {
  //           return this.chooseUnitsForMovement$ (nationId, playerId, movements).pipe (
  //             map ((unitsOrPass) => unitsOrPass === "pass" ? "pass" : { ...armyMovementOrPass, units: unitsOrPass })
  //           );
  //         } // if - else
  //       } // if - else
  //     }),
  //     last ()
  //   );
  // } // armyMovement$

  // private chooseUnitsForMovement$ (nationId: WotrNationId, playerId: WotrPlayerId, movements: WotrArmyMovement[]): Observable<WotrAreaUnit[] | "pass"> {
  //   const validUnits = this.rules.movement.getValidUnitsForMovement (nationId, this.game.get ());
  //   this.ui.updateUi ("Select units for movement", (s) => ({
  //     ...s,
  //     ...this.ui.resetUi (),
  //     turnPlayer: playerId,
  //     message: "Select one or more units to be moved.",
  //     validUnits: validUnits,
  //     selectedUnits: [],
  //     canCancel: !!movements.length,
  //     canPass: true,
  //   }));
  //   return race<[WotrAreaUnit[], "pass"]> (
  //     this.ui.selectedUnitsChange$ (),
  //     this.ui.passChange$ ().pipe (mapTo ("pass"))
  //   );
  // } // chooseUnitsForMovement$

  // private chooseUnitsOrAreaForMovement$ (nationId: WotrNationId, playerId: WotrPlayerId, selectedUnits: WotrAreaUnit[]): Observable<WotrAreaUnit[] | WotrAreaId> {
  //   const areaId = selectedUnits[0].areaId;
  //   const validUnits = this.rules.movement.getValidUnitsByAreaForMovement (nationId, areaId, this.game.get ());
  //   const validAreas = this.rules.movement.getValidAreasForMovement (areaId, nationId, this.game.get ());
  //   this.ui.updateUi ("Select area or units for movement", (s) => ({
  //     ...s,
  //     ...this.ui.resetUi (),
  //     turnPlayer: playerId,
  //     message: "Choose an area to move the selected units to, or select more units to be moved.",
  //     validUnits: validUnits,
  //     validAreas: validAreas,
  //     selectedUnits: selectedUnits,
  //     canCancel: true,
  //   }));
  //   return race (this.ui.selectedUnitsChange$ (), this.ui.areaChange$ ());
  // } // chooseUnitsOrAreaForMovement$

  // battleInitiation$ (nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrBattleInitiation> {
  //   return this.chooseLandForBattle$ (nationId, playerId).pipe (
  //     switchMap ((landId) => {
  //       return this.confirmBattleInitiation$ (landId, playerId).pipe (
  //         map (() => ({ landId }))
  //       );
  //     })
  //   );
  // } // battleInitiation$

  // private chooseLandForBattle$ (nationId: WotrNationId, playerId: WotrPlayerId): Observable<WotrLandAreaId> {
  //   const validAreas = this.rules.battlesRetreats.getValidAreasForBattle (nationId, this.game.get ());
  //   this.ui.updateUi ("Select area for battle", (s) => ({
  //     ...s,
  //     ...this.ui.resetUi (),
  //     turnPlayer: playerId,
  //     message: "Choose an area to resolve the battle into.",
  //     validAreas: validAreas,
  //   }));
  //   return this.ui.areaChange$<WotrLandAreaId> ();
  // } // chooseLandForBattle$

  // private confirmBattleInitiation$ (landId: WotrLandAreaId, playerId: WotrPlayerId): Observable<void> {
  //   this.ui.updateUi ("Confirm battle initiation", (s) => ({
  //     ...s,
  //     ...this.ui.resetUi (),
  //     turnPlayer: playerId,
  //     message: `Confirm to initiate the battle in ${this.components.AREA[landId].name}.`,
  //     validAreas: [landId],
  //     canConfirm: true,
  //     canCancel: true,
  //   }));
  //   return this.ui.confirmChange$ ();
  // } // confirmBattleInitiation$
} // WotrPlayerLocalService
