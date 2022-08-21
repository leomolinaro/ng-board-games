import { Injectable } from "@angular/core";
import { forN } from "@bg-utils";
import { EMPTY, expand, last, map, mapTo, Observable, race, tap } from "rxjs";
import { BritAreaId, BritLandAreaId, BritNationId, BritUnitId } from "../brit-components.models";
import { BritPlayerId } from "../brit-game-state.models";
import { BritRulesService } from "../brit-rules/brit-rules.service";
import { BritArmyMovement, BritArmyPlacement } from "../brit-story.models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerService } from "./brit-player.service";
import { BritUiStore } from "./brit-ui.store";

@Injectable ()
export class BritPlayerLocalService implements BritPlayerService {

  constructor (
    private game: BritGameStore,
    private ui: BritUiStore,
    private rules: BritRulesService
  ) { }

  armyPlacement$ (nInfantries: number, nationId: BritNationId, playerId: BritPlayerId): Observable<BritArmyPlacement> {
    const placement: BritArmyPlacement = {
      infantryPlacement: []
    };
    return forN (nInfantries, index => {
      return this.chooseLandForPlacement$ (index + 1, nInfantries, nationId, playerId).pipe (
        map (landAreaId => {
          this.game.applyInfantryPlacement (landAreaId, nationId);
          const ipIndex = placement.infantryPlacement.findIndex (ip => (typeof ip === "object" ? ip.areaId : ip) === landAreaId);
          if (ipIndex >= 0) {
            let ip = placement.infantryPlacement[ipIndex];
            ip = { areaId: landAreaId, quantity: typeof ip === "object" ? ip.quantity + 1 : 2 };
            placement.infantryPlacement[ipIndex] = ip;
          } else {
            placement.infantryPlacement.push (landAreaId);
          } // if - else
          return void 0;
        })
      );
    }).pipe (
      mapTo (placement)
    );
  } // armiesPlacement$

  private chooseLandForPlacement$ (iInfantry: number, nTotInfantries: number, nationId: BritNationId, playerId: BritPlayerId): Observable<BritLandAreaId> {
    const validLands = this.rules.populationIncrease.getValidLandsForPlacement (nationId, playerId, this.game.get ());
    this.ui.updateUi ("Choose land for placement", s => ({
      ...s,
      ...this.ui.resetUi (),
      turnPlayer: playerId,
      message: `Choose a land area to place an infantry on (${iInfantry} / ${nTotInfantries}).`,
      validAreas: validLands,
      canCancel: iInfantry !== 1
    }));
    return this.ui.areaChange$<BritLandAreaId> ();
  } // chooseLandForRecruitment$

  armyMovement$ (nationId: BritNationId, playerId: BritPlayerId): Observable<BritArmyMovement> {
    return this.chooseUnitsForMovement$ (nationId, playerId).pipe (
      expand<BritUnitId[] | BritAreaId, Observable<BritUnitId[] | BritAreaId>> (unitIdsOrAreaId => {
        if (Array.isArray (unitIdsOrAreaId)) {
          this.ui.updateUi ("Units selected", s => ({
            ...s,
            selectedUnits: unitIdsOrAreaId
          }));
          if (unitIdsOrAreaId.length) {
            console.log ("TODO");
            return this.chooseUnitsOrAreaForMovement$ (nationId, playerId, unitIdsOrAreaId).pipe (
              tap (r => console.log ("RRRRRRR", r))
            );
          } else {
            return this.chooseUnitsForMovement$ (nationId, playerId);
          } // if - else
        } else {
          return EMPTY;
        } // if - else
      }),
      last ()
    );
  } // armyMovement$

  private chooseUnitsForMovement$ (nationId: BritNationId, playerId: BritPlayerId): Observable<BritUnitId[]> {
    const validUnits = this.rules.movement.getValidUnitsForMovement (nationId, this.game.get ());
    this.ui.updateUi ("Select units for movement", s => ({
      ...s,
      ...this.ui.resetUi (),
      turnPlayer: playerId,
      message: `Select one or more units to be moved.`,
      validUnits: validUnits,
      canCancel: false,
    }));
    return this.ui.unitsChange$<BritUnitId> ();
  } // chooseUnitsForMovement$

  private chooseUnitsOrAreaForMovement$ (nationId: BritNationId, playerId: BritPlayerId, selectedUnitIds: BritUnitId[]): Observable<BritUnitId[] | BritAreaId> {
    const unitAreaId = this.rules.movement.getAreaByUnit (selectedUnitIds[0], this.game.get ())!;
    const validUnits = this.rules.movement.getValidUnitsByAreaForMovement (nationId, unitAreaId, this.game.get ());
    const validAreas = this.rules.movement.getValidAreasForMovement (unitAreaId, nationId, this.game.get ())
    this.ui.updateUi ("Select area or units for movement", s => ({
      ...s,
      ...this.ui.resetUi (),
      turnPlayer: playerId,
      message: `Select an area to move the selected units, or select more units to be moved.`,
      validUnits: validUnits,
      validAreas: validAreas,
      selectedUnits: selectedUnitIds,
      canCancel: true,
    }));
    return race (
      this.ui.unitsChange$<BritUnitId> (),
      this.ui.areaChange$ ()
    );
  } // chooseUnitsOrAreaForMovement$

} // BritPlayerLocalService
