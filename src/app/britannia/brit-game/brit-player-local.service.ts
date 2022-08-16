import { Injectable } from "@angular/core";
import { forN } from "@bg-utils";
import { map, mapTo, Observable } from "rxjs";
import { BritArmiesPlacement, BritLandAreaId, BritNationId, BritPlayerId } from "../brit-models";
import { BritGameStore } from "./brit-game.store";
import { BritPlayerService } from "./brit-player.service";
import * as britRules from "./brit-rules";
import { BritUiStore } from "./brit-ui.store";

@Injectable ()
export class BritPlayerLocalService implements BritPlayerService {

  constructor (
    private game: BritGameStore,
    private ui: BritUiStore
  ) { }

  armiesPlacement$ (nInfantries: number, nationId: BritNationId, playerId: BritPlayerId): Observable<BritArmiesPlacement> {
    const placement: BritArmiesPlacement = {
      infantriesPlacement: []
    };
    return forN (nInfantries, index => {
      return this.chooseLandForPlacement$ (index + 1, nInfantries, nationId, playerId).pipe (
        map (landAreaId => {
          this.game.applyInfantryPlacement (landAreaId, nationId);
          placement.infantriesPlacement.push (landAreaId);
          return void 0;
        })
      );
    }).pipe (
      mapTo (placement)
    );
  } // armiesPlacement$


  private chooseLandForPlacement$ (iInfantry: number, nTotInfantries: number, nationId: BritNationId, playerId: BritPlayerId): Observable<BritLandAreaId> {
    const validLands = britRules.getValidLandsForPlacement (nationId, playerId, this.game);
    this.ui.updateUi ("Choose land for placement", s => ({
      ...s,
      ...this.ui.resetUi (),
      turnPlayer: playerId,
      message: `Choose a land area to place an infantry on (${iInfantry} / ${nTotInfantries}).`,
      validAreas: validLands,
    }));
    return this.ui.areaChange$<BritLandAreaId> ();
  } // chooseLandForRecruitment$

} // BritPlayerLocalService
