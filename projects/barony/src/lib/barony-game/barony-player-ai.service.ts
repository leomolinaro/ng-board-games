import { Injectable, inject } from "@angular/core";
import { randomUtil } from "@leobg/commons/utils";
import {
  BaronyColor,
  BaronyConstruction,
  BaronyLand,
  BaronyMovement,
  BaronyResourceType,
  BaronySetupPlacement,
  BaronyTurn,
  BaronyTurnConstruction,
  BaronyTurnExpedition,
  BaronyTurnMovement,
  BaronyTurnNewCity,
  BaronyTurnNobleTitle,
  BaronyTurnRectruitment
} from "../barony-models";
import { BaronyGameStore } from "./barony-game.store";
import * as baronyRules from "./barony-rules";

@Injectable()
export class BaronyPlayerAiService {
  private game = inject(BaronyGameStore);

  async setupPlacement(playerId: BaronyColor): Promise<BaronySetupPlacement> {
    const validLands = baronyRules.getValidLandsForSetupPlacement(this.game);
    const land = randomUtil.getRandomElement(validLands);
    return {
      type: "setupPlacement",
      land: land.coordinates
    };
  }

  async turn(playerId: BaronyColor): Promise<BaronyTurn> {
    const validActions = baronyRules.getValidActions(playerId, this.game);
    const action = randomUtil.getRandomElement(validActions);
    switch (action) {
      case "recruitment": {
        const validLands = baronyRules.getValidLandsForRecruitment(playerId, this.game);
        const land = randomUtil.getRandomElement(validLands);
        const maxKnights = baronyRules.getMaxKnightForRecruitment(land.coordinates, playerId, this.game);
        return <BaronyTurnRectruitment>{
          action: "recruitment",
          land: land.coordinates,
          numberOfKnights: maxKnights
        };
      }
      case "movement": {
        const validSourceLands = baronyRules.getValidSourceLandsForFirstMovement(playerId, this.game);
        const sourceLand = randomUtil.getRandomElement(validSourceLands);
        const firstMovement = this.executeMovement(sourceLand, playerId);
        this.game.applyMovement(firstMovement, playerId);
        if (baronyRules.isSecondMovementValid(playerId, firstMovement, this.game)) {
          const validSourceLands2 = baronyRules.getValidSourceLandsForSecondMovement(
            playerId,
            firstMovement,
            this.game
          );
          const sourceLand2 = randomUtil.getRandomElement(validSourceLands2);
          const secondMovement = this.executeMovement(sourceLand2, playerId);
          return <BaronyTurnMovement>{
            action: "movement",
            movements: [firstMovement, secondMovement]
          };
        } else {
          return <BaronyTurnMovement>{
            action: "movement",
            movements: [firstMovement]
          };
        }
      }
      case "construction": {
        const constructions: BaronyConstruction[] = [];
        let validConstruction = true;
        do {
          const validLands = baronyRules.getValidLandsForConstruction(playerId, this.game);
          const land = randomUtil.getRandomElement(validLands);
          const validBuildings = baronyRules.getValidBuildingsForConstruction(playerId, this.game);
          const building = randomUtil.getRandomElement(validBuildings);
          const construction: BaronyConstruction = { building: building, land: land.coordinates };
          constructions.push(construction);
          this.game.applyConstruction(construction, playerId);
          validConstruction = baronyRules.isConstructionValid(playerId, this.game);
        } while (validConstruction);
        return <BaronyTurnConstruction>{
          action: "construction",
          constructions: constructions
        };
      }
      case "newCity": {
        const validLands = baronyRules.getValidLandsForNewCity(playerId, this.game);
        const land = randomUtil.getRandomElement(validLands);
        return <BaronyTurnNewCity>{
          action: "newCity",
          land: land.coordinates
        };
      }
      case "expedition": {
        const validLands = baronyRules.getValidLandsForExpedition(playerId, this.game);
        const land = randomUtil.getRandomElement(validLands);
        return <BaronyTurnExpedition>{
          action: "expedition",
          land: land.coordinates
        };
      }
      case "nobleTitle": {
        const resources: BaronyResourceType[] = [];
        const p = this.game.getPlayer(playerId);
        const r = { ...p.resources };
        let sum = 0;
        while (sum < 15) {
          if (r.fields) {
            sum += 5;
            r.fields--;
            resources.push("fields");
          } else if (r.plain) {
            sum += 4;
            r.plain--;
            resources.push("plain");
          } else if (r.forest) {
            sum += 3;
            r.forest--;
            resources.push("forest");
          } else {
            sum += 2;
            r.mountain--;
            resources.push("mountain");
          }
        }
        return <BaronyTurnNobleTitle>{
          action: "nobleTitle",
          discardedResources: resources
        };
      }
    }
    throw new Error("TODO");
  }

  private executeMovement(sourceLand: BaronyLand, player: BaronyColor): BaronyMovement {
    const validTargetLands = baronyRules.getValidTargetLandsForMovement(sourceLand.coordinates, player, this.game);
    const targetLand = randomUtil.getRandomElement(validTargetLands);
    if (baronyRules.isConflict(targetLand.coordinates, player, this.game)) {
      if (baronyRules.isVillageBeingDestroyed(targetLand.coordinates, player, this.game)) {
        const villagePlayer = baronyRules.getVillageDestroyedPlayer(targetLand.coordinates, player, this.game);
        if (baronyRules.hasResourcesToTakeForVillageDestruction(villagePlayer.id, this.game)) {
          const validResourcesForVillageDestruction = baronyRules.getValidResourcesForVillageDestruction(
            villagePlayer.id,
            this.game
          );
          const resource = randomUtil.getRandomElement(validResourcesForVillageDestruction);
          return {
            fromLand: sourceLand.coordinates,
            toLand: targetLand.coordinates,
            conflict: true,
            gainedResource: resource
          };
        }
      }
      return {
        fromLand: sourceLand.coordinates,
        toLand: targetLand.coordinates,
        conflict: true,
        gainedResource: null
      };
    } else {
      return {
        fromLand: sourceLand.coordinates,
        toLand: targetLand.coordinates,
        conflict: false,
        gainedResource: null
      };
    }
  }
}
