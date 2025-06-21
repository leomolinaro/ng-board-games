import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { rollActionDice } from "../action-die/wotr-action-die-actions";
import { WotrActionDiePlayerService } from "../action-die/wotr-action-die-player.service";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrActionDieService } from "../action-die/wotr-action-die.service";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrCardPlayerService } from "../card/wotr-card-player.service";
import { WotrCardId } from "../card/wotr-card.models";
import { WotrCharacterId } from "../character/wotr-character.models";
import {
  declareFellowship,
  notDeclareFellowship,
  revealFellowship
} from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship.store";
import { WotrGameUiStore, WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { WotrGameStory } from "../game/wotr-story.models";
import { allocateHuntDice, drawHuntTile, rollHuntDice } from "../hunt/wotr-hunt-actions";
import {
  WotrFellowshipCorruptionChoice,
  WotrHuntEffectChoiceParams
} from "../hunt/wotr-hunt-effect-choices";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrPlayer } from "./wotr-player";
import { WotrPlayerService } from "./wotr-player.service";

@Injectable({ providedIn: "root" })
export class WotrPlayerLocalService implements WotrPlayerService {
  private ui = inject(WotrGameUiStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private huntStore = inject(WotrHuntStore);
  private actionDieService = inject(WotrActionDieService);
  private playerActionDieService = inject(WotrActionDiePlayerService);
  private fellowshipCorruptionChoice = inject(WotrFellowshipCorruptionChoice);
  private regionStore = inject(WotrRegionStore);
  private cardPlayerService = inject(WotrCardPlayerService);

  async firstPhase(player: WotrPlayer): Promise<WotrGameStory> {
    return this.cardPlayerService.firstPhaseDrawCards(player);
  }

  async fellowshipPhase(): Promise<WotrGameStory> {
    const declare = await this.ui.askConfirm("Do you want to declare the fellowship?");
    if (!declare) {
      return { type: "phase", actions: [notDeclareFellowship()] };
    }
    const validRegions = this.fellowshipStore.validRegionsForDeclaration();
    const region = await this.ui.askRegion(
      "Choose a region to declare the fellowship",
      validRegions
    );
    return { type: "phase", actions: [declareFellowship(region)] };
  }

  async huntAllocationPhase(): Promise<WotrGameStory> {
    const min = this.huntStore.minimumNumberOfHuntDice();
    const max = this.huntStore.maximumNumberOfHuntDice();
    const quantity = await this.ui.askQuantity(
      "How many hunt dice do you want to allocate?",
      min,
      max
    );
    return { type: "phase", actions: [allocateHuntDice(quantity)] };
  }

  async rollActionDice(player: WotrPlayer): Promise<WotrGameStory> {
    await this.ui.askContinue("Roll action dice");
    const nActionDice = this.actionDieService.rollableActionDice(player.frontId);
    const actionDice: WotrActionDie[] = [];
    for (let i = 0; i < nActionDice; i++) {
      actionDice.push(this.actionDieService.rollActionDie(player.frontId));
    }
    return { type: "phase", actions: [rollActionDice(...actionDice)] };
  }

  async actionResolution(player: WotrPlayer): Promise<WotrGameStory> {
    return this.playerActionDieService.actionResolution(player);
  }

  async separateCompanions(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async rollHuntDice(): Promise<WotrGameStory> {
    await this.ui.askContinue("Roll hunt dice");
    const huntDice: WotrCombatDie[] = [];
    for (let i = 0; i < this.huntStore.nHuntDice(); i++) {
      huntDice.push(randomUtil.getRandomInteger(1, 7) as WotrCombatDie);
    }
    return { type: "hunt", actions: [rollHuntDice(...huntDice)] };
  }

  async reRollHuntDice(): Promise<WotrGameStory> {
    throw new Error("Method not implemented.");
  }

  async drawHuntTile(): Promise<WotrGameStory> {
    await this.ui.askContinue("Draw hunt tile");
    const huntTile = randomUtil.getRandomElement(this.huntStore.huntPool());
    return { type: "hunt", actions: [drawHuntTile(huntTile)] };
  }

  async huntEffect(damage: number): Promise<WotrGameStory> {
    // TODO
    const choices: WotrPlayerChoice<WotrHuntEffectChoiceParams>[] = [
      this.fellowshipCorruptionChoice
    ];
    const actions = await this.ui.playerChoice(`Absorbe ${damage} hunt damage points`, choices, {
      damage
    });
    return { type: "hunt", actions };
  }

  async revealFellowship(): Promise<WotrGameStory> {
    const progress = this.fellowshipStore.progress();
    const fellowshipRegion = this.regionStore.regions().find(r => r.fellowship)!;
    const reachableRegions = this.regionStore.reachableRegions(fellowshipRegion.id, progress);
    const validRegions = reachableRegions.filter(r => {
      const region = this.regionStore.region(r);
      if (region.settlement !== "city" && region.settlement !== "stronghold") return true;
      if (region.controlledBy !== "free-peoples") return true;
      return false;
    });
    const chosenRegion = await this.ui.askRegion(
      "Choose a region where to reveal the fellowship",
      validRegions
    );
    return {
      type: "hunt",
      actions: [revealFellowship(chosenRegion)]
    };
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
