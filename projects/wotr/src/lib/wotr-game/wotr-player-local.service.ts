import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { WotrFrontId } from "../wotr-components/wotr-front.models";
import { WotrStory } from "../wotr-story.models";
import { WotrGameStore } from "./wotr-game.store";
import { WotrPlayerService } from "./wotr-player.service";
import { WotrUiStore } from "./wotr-ui.store";

@Injectable ()
export class WotrPlayerLocalService implements WotrPlayerService {

  constructor (
    private game: WotrGameStore,
    private ui: WotrUiStore,
    // private rules: WotrRulesService,
  ) {}

  firstPhaseDrawCards$ (front: WotrFrontId): Observable<WotrStory> {
    this.ui.updateUi ("asd", s => ({
      ...s,
      // ...this.ui.resetUi (),
      // turnPlayer: playerId,
      message: `[${front}] Draw cards`,
      // validAreas: validLands,
      // canCancel: iInfantry !== 1,
    }));
    return this.ui.testChange$ ().pipe (
      map (() => ({
        phase: 1,
        actions: [{ type: "draw-cards", cards: ["fpcha01"] }]
      }))
    );
  }

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
