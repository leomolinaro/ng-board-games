import { Injectable } from "@angular/core";
import { forN } from "@bg-utils";
import { map, mapTo, Observable } from "rxjs";
import { BritLandAreaId, BritNationId } from "../brit-components.models";
import { BritPlayerId } from "../brit-game-state.models";
import { BritRulesService } from "../brit-rules/brit-rules.service";
import { BritArmyPlacement } from "../brit-story.models";
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

} // BritPlayerLocalService
