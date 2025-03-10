import { Injectable, inject } from "@angular/core";
import {
  BaronyAction,
  BaronyColor,
  BaronyConstruction,
  BaronyLand,
  BaronyLandCoordinates,
  BaronyMovement,
  BaronyResourceType,
  BaronySetupPlacement,
  BaronyTurn,
  BaronyTurnConstruction,
  BaronyTurnExpedition,
  BaronyTurnMovement,
  BaronyTurnNewCity,
  BaronyTurnNobleTitle,
  BaronyTurnRectruitment,
} from "../barony-models";
import { BaronyGameStore } from "./barony-game.store";
import * as baronyRules from "./barony-rules";
import { BaronyUiStore } from "./barony-ui.store";

@Injectable ()
export class BaronyPlayerLocalService {
  
  private game = inject (BaronyGameStore);
  private ui = inject (BaronyUiStore);

  async setupPlacement (playerId: BaronyColor): Promise<BaronySetupPlacement> {
    const landTile = await this.chooseLandForSetupPlacement (playerId);
    return <BaronySetupPlacement> {
      type: "setupPlacement",
      land: landTile.coordinates,
    };
  }

  async turn (playerId: BaronyColor): Promise<BaronyTurn> {
    const action = await this.chooseAction (playerId);
    switch (action) {
      case "recruitment": {
        const result = await this.chooseRectruitment (playerId);
        return {
          action: "recruitment",
          land: result.land.coordinates,
          numberOfKnights: result.numberOfKnights,
        } as BaronyTurnRectruitment;
      }
      case "movement": {
        const movements = await this.chooseMovements (playerId);
        return {
          action: "movement",
          movements: movements,
        } as BaronyTurnMovement
      }
      case "construction": {
        const constructions = await this.chooseConstructions (playerId, null);
        return {
          constructions: constructions,
        } as BaronyTurnConstruction;
      }
      case "newCity": {
        const land = await this.chooseNewCity (playerId);
        return {
          action: "newCity",
          land: land.coordinates,
        } as BaronyTurnNewCity;
      }
      case "expedition": {
        const land = await this.chooseExpedition (playerId);
        return {
          action: "expedition",
          land: land.coordinates,
        } as BaronyTurnExpedition;
      }
      case "nobleTitle": {
        const resources = await this.chooseNobleTitle (playerId);
        return {
          action: "nobleTitle",
          discardedResources: resources,
        } as BaronyTurnNobleTitle;
      }
      default: throw new Error ("TODO");
    }
  }

  private chooseLandForSetupPlacement (player: BaronyColor): Promise<BaronyLand> {
    const validLands = baronyRules.getValidLandsForSetupPlacement (this.game);
    this.ui.updateUi ("Choose land for setup placement", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      ...this.ui.setFirstActionUi (player),
      message: "Place a city and a knight.",
      validLands: validLands.map ((land) => land.coordinates),
    }));
    return this.ui.landSelect.get ();
  }

  private chooseAction (player: BaronyColor): Promise<BaronyAction> {
    const validActions = baronyRules.getValidActions (player, this.game);
    this.ui.updateUi ("Choose action", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      ...this.ui.setFirstActionUi (player),
      message: "Choose an action to perform.",
      validActions: validActions,
    }));
    return this.ui.actionSelect.get ();
  }

  private async chooseRectruitment (player: BaronyColor): Promise<{ land: BaronyLand; numberOfKnights: number }> {
    const land = await this.chooseLandForRecruitment (player);
    const numberOfKnights = await this.chooseNumberOfKnightsForRecruitment (land.coordinates, player);
    return { land, numberOfKnights };
  }

  private chooseLandForRecruitment (player: BaronyColor): Promise<BaronyLand> {
    const validLands = baronyRules.getValidLandsForRecruitment (player, this.game);
    this.ui.updateUi ("Choose land for recruitment", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to recruit on.",
      validLands: validLands.map ((lt) => lt.coordinates),
    }));
    return this.ui.landSelect.get ();
  }

  private chooseNumberOfKnightsForRecruitment (land: BaronyLandCoordinates, player: BaronyColor): Promise<number> {
    const maxNumberOfKnights = baronyRules.getMaxKnightForRecruitment (land, player, this.game);
    this.ui.updateUi ("Choose number of knights for recruitment", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose the number of knights to recruit.",
      maxNumberOfKnights: maxNumberOfKnights,
    }));
    return this.ui.numberOfKnightsSelect.get ();
  }

  private async chooseMovements (player: BaronyColor): Promise<BaronyMovement[]> {
    const firstMovement = await this.chooseFirstMovement (player);
    this.game.applyMovement (firstMovement, player);
    if (baronyRules.isSecondMovementValid (player, firstMovement, this.game)) {
      const secondMovement = await this.chooseSecondMovement (player, firstMovement);
      if (secondMovement) {
        return [firstMovement, secondMovement];
      } else {
        return [firstMovement];
      }
    } else {
      return [firstMovement];
    }
  }

  private async chooseFirstMovement (player: BaronyColor): Promise<BaronyMovement> {
    const movementSource = await this.chooseLandSourceForFirstMovement (player);
    return this.chooseMovementTargetAndConflict (movementSource.coordinates, player);
  }

  private async chooseSecondMovement (player: BaronyColor, firstMovement: BaronyMovement): Promise<BaronyMovement | null> {
    const movementSource = await this.chooseLandSourceOrPassForSecondMovement (player, firstMovement);
    if (movementSource) {
      return this.chooseMovementTargetAndConflict (movementSource.coordinates, player);
    } else {
      return null;
    }
  }

  private async chooseMovementTargetAndConflict (movementSource: BaronyLandCoordinates, player: BaronyColor): Promise<BaronyMovement> {
    const movementTarget = await this.chooseLandTargetForMovement (movementSource, player);
    if (baronyRules.isConflict (movementTarget.coordinates, player, this.game)) {
      if (baronyRules.isVillageBeingDestroyed (movementTarget.coordinates, player, this.game)) {
        const villagePlayer = baronyRules.getVillageDestroyedPlayer (movementTarget.coordinates, player, this.game);
        if (baronyRules.hasResourcesToTakeForVillageDestruction (villagePlayer.id, this.game)) {
          const resource = await this.chooseResourceForVillageDestruction (player, villagePlayer.id);
          return {
            fromLand: movementSource,
            toLand: movementTarget.coordinates,
            conflict: true,
            gainedResource: resource,
          };
        }
      }
      return {
        fromLand: movementSource,
        toLand: movementTarget.coordinates,
        conflict: true,
        gainedResource: null,
      };
    } else {
      return {
        fromLand: movementSource,
        toLand: movementTarget.coordinates,
        conflict: false,
        gainedResource: null,
      };
    }
  }

  private chooseResourceForVillageDestruction (player: BaronyColor, villagePlayer: BaronyColor): Promise<BaronyResourceType> {
    const validResourcesForVillageDestruction = baronyRules.getValidResourcesForVillageDestruction (villagePlayer, this.game);
    this.ui.updateUi ("Choose resource for village destruction", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a resource to take for the village destruction.",
      validResources: {
        player: villagePlayer,
        resources: validResourcesForVillageDestruction,
      },
    }));
    return this.ui.resourceSelect.get ();
  }

  private chooseLandSourceForFirstMovement (player: BaronyColor): Promise<BaronyLand> {
    const validSourceLands = baronyRules.getValidSourceLandsForFirstMovement (player, this.game);
    this.ui.updateUi ("Choose land source for first movement", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to move a knight from.",
      validLands: validSourceLands.map ((lt) => lt.coordinates),
    }));
    return this.ui.landSelect.get ();
  }

  private chooseLandSourceOrPassForSecondMovement (player: BaronyColor, firstMovement: BaronyMovement): Promise<BaronyLand | void> {
    const validSourceLands = baronyRules.getValidSourceLandsForSecondMovement (player, firstMovement, this.game);
    this.ui.updateUi ("Choose land source or pass for second movement", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to move a knight from, or pass.",
      validLands: validSourceLands.map ((lt) => lt.coordinates),
      canPass: true,
    }));
    return Promise.race ([
      this.ui.landSelect.get (),
      this.ui.passSelect.get ()
    ]);
  }

  private chooseLandTargetForMovement (movementSource: BaronyLandCoordinates, player: BaronyColor): Promise<BaronyLand> {
    const validSourceLands = baronyRules.getValidTargetLandsForMovement (
      movementSource,
      player,
      this.game
    );
    this.ui.updateUi ("Choose land target for movement", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to move a knight to.",
      validLands: validSourceLands.map ((lt) => lt.coordinates),
    }));
    return this.ui.landSelect.get ();
  }

  private async chooseConstructions (player: BaronyColor, prevConstructions: BaronyConstruction[] | null): Promise<BaronyConstruction[]> {
    if (prevConstructions) {
      const construction = await this.chooseConstructionOrPass (player);
      if (construction) {
        this.game.applyConstruction (construction, player);
        const constructions = [...prevConstructions, construction];
        if (baronyRules.isConstructionValid (player, this.game)) {
          return this.chooseConstructions (player, constructions);
        } else {
          return constructions;
        }
      } else {
        return prevConstructions;
      }
    } else {
      const construction = await this.chooseConstruction (player, false);
      const constructions = [construction];
      this.game.applyConstruction (construction, player);
      if (baronyRules.isConstructionValid (player, this.game)) {
        return this.chooseConstructions (player, constructions);
      } else {
        return constructions;
      }
    }
  }

  private chooseConstructionOrPass (player: BaronyColor): Promise<BaronyConstruction | void> {
    return Promise.race ([
      this.chooseConstruction (player, true),
      this.ui.passSelect.get ()
    ]);
  }

  private async chooseConstruction (player: BaronyColor, orPass: boolean): Promise<BaronyConstruction> {
    const land = await this.chooseLandForConstruction (player, orPass);
    const building = await this.chooseBuildingForConstruction (player, orPass);
    return { building, land: land.coordinates };
  }

  private chooseLandForConstruction (player: BaronyColor, orPass: boolean): Promise<BaronyLand> {
    const validLands = baronyRules.getValidLandsForConstruction (player, this.game);
    this.ui.updateUi ("Choose land for construction", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: `Choose a land tile to construct on${
        orPass ? ", or pass" : ""
      }.`,
      validLands: validLands.map ((lt) => lt.coordinates),
      canPass: orPass,
    }));
    return this.ui.landSelect.get ();
  }

  private chooseBuildingForConstruction (player: BaronyColor, orPass: boolean): Promise<"stronghold" | "village"> {
    const validBuildings = baronyRules.getValidBuildingsForConstruction (player, this.game);
    this.ui.updateUi ("Choose building for construction", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: `Choose a building to construct on the tile${
        orPass ? ", or pass" : ""
      }.`,
      validBuildings: validBuildings,
      canPass: orPass,
    }));
    return this.ui.buildingSelect.get ();
  }

  private chooseNewCity (player: BaronyColor): Promise<BaronyLand> {
    const validLandsForNewCity = baronyRules.getValidLandsForNewCity (player, this.game);
    this.ui.updateUi ("Choose new city", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to build a new city.",
      validLands: validLandsForNewCity.map ((l) => l.coordinates),
    }));
    return this.ui.landSelect.get ();
  }

  private chooseExpedition (player: BaronyColor): Promise<BaronyLand> {
    const validLandsForExpedition = baronyRules.getValidLandsForExpedition (player, this.game);
    this.ui.updateUi ("Choose expedition", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile for the expedition.",
      validLands: validLandsForExpedition.map ((l) => l.coordinates),
    }));
    return this.ui.landSelect.get ();
  }

  private chooseNobleTitle (player: BaronyColor): Promise<BaronyResourceType[]> {
    return this.chooseResourcesForNobleTitle (player, [], 0);
  }

  private async chooseResourcesForNobleTitle (player: BaronyColor, resources: BaronyResourceType[], sum: number): Promise<BaronyResourceType[]> {
    const resource = await this.chooseResourceForNobleTitle (player, sum);
    const resoucePoints = baronyRules.getResourcePoints (resource);
    sum += resoucePoints;
    resources.push (resource);
    this.game.discardResource (resource, player);
    if (sum < 15) {
      return this.chooseResourcesForNobleTitle (player, resources, sum);
    } else {
      return resources;
    }
  }

  private async chooseResourceForNobleTitle (player: BaronyColor, sum: number): Promise<BaronyResourceType> {
    const validResourcesForNobleTitle = baronyRules.getValidResourcesForNobleTitle (player, this.game);
    this.ui.updateUi ("Choose resource for noble title", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: `Choose a resource to discard for the noble title (${sum} / 15).`,
      validResources: {
        player: player,
        resources: validResourcesForNobleTitle,
      },
    }));
    return this.ui.resourceSelect.get ();
  }
}
