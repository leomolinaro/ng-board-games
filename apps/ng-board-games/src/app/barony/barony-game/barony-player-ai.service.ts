import { Injectable } from '@angular/core';
import { randomUtil } from '@bg-utils';
import { Observable, of } from 'rxjs';
import {
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
  BaronyTurnRectruitment,
} from '../barony-models';
import { BaronyGameStore } from './barony-game.store';
import * as baronyRules from './barony-rules';

@Injectable()
export class BaronyPlayerAiService {
  constructor(private game: BaronyGameStore) {}

  setupPlacement$(playerId: string): Observable<BaronySetupPlacement> {
    const validLands = baronyRules.getValidLandsForSetupPlacement(this.game);
    const land = randomUtil.getRandomElement(validLands);
    return of<BaronySetupPlacement>({
      type: 'setupPlacement',
      land: land.coordinates,
    });
  } // setupPlacement$

  turn$(player: string): Observable<BaronyTurn> {
    const validActions = baronyRules.getValidActions(player, this.game);
    const action = randomUtil.getRandomElement(validActions);
    switch (action) {
      case 'recruitment': {
        const validLands = baronyRules.getValidLandsForRecruitment(
          player,
          this.game
        );
        const land = randomUtil.getRandomElement(validLands);
        const maxKnights = baronyRules.getMaxKnightForRecruitment(
          land.coordinates,
          player,
          this.game
        );
        return of<BaronyTurnRectruitment>({
          action: 'recruitment',
          land: land.coordinates,
          numberOfKnights: maxKnights,
        });
      } // case
      case 'movement': {
        const validSourceLands =
          baronyRules.getValidSourceLandsForFirstMovement(player, this.game);
        const sourceLand = randomUtil.getRandomElement(validSourceLands);
        const firstMovement = this.executeMovement(sourceLand, player);
        this.game.applyMovement(firstMovement, player);
        if (
          baronyRules.isSecondMovementValid(player, firstMovement, this.game)
        ) {
          const validSourceLands2 =
            baronyRules.getValidSourceLandsForSecondMovement(
              player,
              firstMovement,
              this.game
            );
          const sourceLand2 = randomUtil.getRandomElement(validSourceLands2);
          const secondMovement = this.executeMovement(sourceLand2, player);
          return of<BaronyTurnMovement>({
            action: 'movement',
            movements: [firstMovement, secondMovement],
          });
        } else {
          return of<BaronyTurnMovement>({
            action: 'movement',
            movements: [firstMovement],
          });
        } // if - else
      } // case
      case 'construction': {
        const constructions: BaronyConstruction[] = [];
        let validConstruction = true;
        do {
          const validLands = baronyRules.getValidLandsForConstruction(
            player,
            this.game
          );
          const land = randomUtil.getRandomElement(validLands);
          const validBuildings = baronyRules.getValidBuildingsForConstruction(
            player,
            this.game
          );
          const building = randomUtil.getRandomElement(validBuildings);
          const construction: BaronyConstruction = {
            building: building,
            land: land.coordinates,
          };
          constructions.push(construction);
          this.game.applyConstruction(construction, player);
          validConstruction = baronyRules.isConstructionValid(
            player,
            this.game
          );
        } while (validConstruction);
        return of<BaronyTurnConstruction>({
          action: 'construction',
          constructions: constructions,
        });
      } // case
      case 'newCity': {
        const validLands = baronyRules.getValidLandsForNewCity(
          player,
          this.game
        );
        const land = randomUtil.getRandomElement(validLands);
        return of<BaronyTurnNewCity>({
          action: 'newCity',
          land: land.coordinates,
        });
      } // case
      case 'expedition': {
        const validLands = baronyRules.getValidLandsForExpedition(
          player,
          this.game
        );
        const land = randomUtil.getRandomElement(validLands);
        return of<BaronyTurnExpedition>({
          action: 'expedition',
          land: land.coordinates,
        });
      } // case
      case 'nobleTitle': {
        const resources: BaronyResourceType[] = [];
        const p = this.game.getPlayer(player);
        const r = { ...p.resources };
        let sum = 0;
        while (sum < 15) {
          if (r.fields) {
            sum += 5;
            r.fields--;
            resources.push('fields');
          } else if (r.plain) {
            sum += 4;
            r.plain--;
            resources.push('plain');
          } else if (r.forest) {
            sum += 3;
            r.forest--;
            resources.push('forest');
          } else {
            sum += 2;
            r.mountain--;
            resources.push('mountain');
          }
        } // while
        return of<BaronyTurnNobleTitle>({
          action: 'nobleTitle',
          discardedResources: resources,
        });
      } // case
    } // switch
    throw new Error('TODO');
  } // turn$

  private executeMovement(
    sourceLand: BaronyLand,
    player: string
  ): BaronyMovement {
    const validTargetLands = baronyRules.getValidTargetLandsForMovement(
      sourceLand.coordinates,
      player,
      this.game
    );
    const targetLand = randomUtil.getRandomElement(validTargetLands);
    if (baronyRules.isConflict(targetLand.coordinates, player, this.game)) {
      if (
        baronyRules.isVillageBeingDestroyed(
          targetLand.coordinates,
          player,
          this.game
        )
      ) {
        const villagePlayer = baronyRules.getVillageDestroyedPlayer(
          targetLand.coordinates,
          player,
          this.game
        );
        if (
          baronyRules.hasResourcesToTakeForVillageDestruction(
            villagePlayer.id,
            this.game
          )
        ) {
          const validResourcesForVillageDestruction =
            baronyRules.getValidResourcesForVillageDestruction(
              villagePlayer.id,
              this.game
            );
          const resource = randomUtil.getRandomElement(
            validResourcesForVillageDestruction
          );
          return {
            fromLand: sourceLand.coordinates,
            toLand: targetLand.coordinates,
            conflict: true,
            gainedResource: resource,
          };
        } // if
      } // if
      return {
        fromLand: sourceLand.coordinates,
        toLand: targetLand.coordinates,
        conflict: true,
        gainedResource: null,
      };
    } else {
      return {
        fromLand: sourceLand.coordinates,
        toLand: targetLand.coordinates,
        conflict: false,
        gainedResource: null,
      };
    } // if - else
  } // executeMovement
} // BaronyPlayerAiService
