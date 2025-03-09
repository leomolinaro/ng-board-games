import { Injectable, inject } from "@angular/core";
import { Observable, of, race } from "rxjs";
import { map, mapTo, switchMap } from "rxjs/operators";
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

  setupPlacement$ (playerId: BaronyColor): Observable<BaronySetupPlacement> {
    return this.chooseLandForSetupPlacement$ (playerId).pipe (
      map<BaronyLand, BaronySetupPlacement> (landTile => ({
        type: "setupPlacement",
        land: landTile.coordinates,
      }))
    );
  } // setupPlacement$

  turn$ (playerId: BaronyColor): Observable<BaronyTurn> {
    return this.chooseAction$ (playerId).pipe (
      switchMap ((action) => {
        switch (action) {
          case "recruitment": {
            return this.chooseRectruitment$ (playerId).pipe (
              map<
              { land: BaronyLand; numberOfKnights: number },
              BaronyTurnRectruitment
              > ((result) => ({
                action: "recruitment",
                land: result.land.coordinates,
                numberOfKnights: result.numberOfKnights,
              }))
            );
          } // case
          case "movement": {
            return this.chooseMovements$ (playerId).pipe (
              map<BaronyMovement[], BaronyTurnMovement> ((movements) => ({
                action: "movement",
                movements: movements,
              }))
            );
          } // case
          case "construction": {
            return this.chooseConstructions$ (playerId, null).pipe (
              map<BaronyConstruction[], BaronyTurnConstruction> (
                (constructions) => ({
                  action: "construction",
                  constructions: constructions,
                })
              )
            );
          } // case
          case "newCity": {
            return this.chooseNewCity$ (playerId).pipe (
              map<BaronyLand, BaronyTurnNewCity> ((land) => ({
                action: "newCity",
                land: land.coordinates,
              }))
            );
          } // case
          case "expedition": {
            return this.chooseExpedition$ (playerId).pipe (
              map<BaronyLand, BaronyTurnExpedition> ((land) => ({
                action: "expedition",
                land: land.coordinates,
              }))
            );
          } // case
          case "nobleTitle": {
            return this.chooseNobleTitle$ (playerId).pipe (
              map<BaronyResourceType[], BaronyTurnNobleTitle> ((resources) => ({
                action: "nobleTitle",
                discardedResources: resources,
              }))
            );
          } // case
          default:
            throw new Error ("TODO");
        } // switch
      })
    );
  } // turn$

  private chooseLandForSetupPlacement$ (player: BaronyColor): Observable<BaronyLand> {
    const validLands = baronyRules.getValidLandsForSetupPlacement (this.game);
    this.ui.updateUi ("Choose land for setup placement", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      ...this.ui.setFirstActionUi (player),
      message: "Place a city and a knight.",
      validLands: validLands.map ((land) => land.coordinates),
    }));
    return this.ui.landChange$ ();
  } // chooseLandForSetupPlacement$

  private chooseAction$ (player: BaronyColor): Observable<BaronyAction> {
    const validActions = baronyRules.getValidActions (player, this.game);
    this.ui.updateUi ("Choose action", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      ...this.ui.setFirstActionUi (player),
      message: "Choose an action to perform.",
      validActions: validActions,
    }));
    return this.ui.actionChange$ ();
  } // chooseAction$

  private chooseRectruitment$ (
    player: BaronyColor
  ): Observable<{ land: BaronyLand; numberOfKnights: number }> {
    return this.chooseLandForRecruitment$ (player).pipe (
      switchMap ((land) =>
        this.chooseNumberOfKnightsForRecruitment$ (
          land.coordinates,
          player
        ).pipe (
          map ((numberOfKnights) => ({
            land: land,
            numberOfKnights: numberOfKnights,
          }))
        )
      )
    );
  } // chooseRectruitment$

  private chooseLandForRecruitment$ (player: BaronyColor): Observable<BaronyLand> {
    const validLands = baronyRules.getValidLandsForRecruitment (
      player,
      this.game
    );
    this.ui.updateUi ("Choose land for recruitment", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to recruit on.",
      validLands: validLands.map ((lt) => lt.coordinates),
    }));
    return this.ui.landChange$ ();
  } // chooseLandForRecruitment$

  private chooseNumberOfKnightsForRecruitment$ (
    land: BaronyLandCoordinates,
    player: BaronyColor
  ): Observable<number> {
    const maxNumberOfKnights = baronyRules.getMaxKnightForRecruitment (
      land,
      player,
      this.game
    );
    this.ui.updateUi ("Choose number of knights for recruitment", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose the number of knights to recruit.",
      maxNumberOfKnights: maxNumberOfKnights,
    }));
    return this.ui.numberOfKnightsChange$ ();
  } // chooseNumberOfKnightsForRecruitment$

  private chooseMovements$ (player: BaronyColor): Observable<BaronyMovement[]> {
    return this.chooseFirstMovement$ (player).pipe (
      switchMap ((firstMovement) => {
        this.game.applyMovement (firstMovement, player);
        if (
          baronyRules.isSecondMovementValid (player, firstMovement, this.game)
        ) {
          return this.chooseSecondMovement$ (player, firstMovement).pipe (
            map ((secondMovement) => {
              if (secondMovement) {
                return [firstMovement, secondMovement];
              } else {
                return [firstMovement];
              } // if - else
            })
          );
        } else {
          return of ([firstMovement]);
        } // if - else
      })
    );
  } // chooseMovements$

  private chooseFirstMovement$ (player: BaronyColor): Observable<BaronyMovement> {
    return this.chooseLandSourceForFirstMovement$ (player).pipe (
      switchMap ((movementSource) =>
        this.chooseMovementTargetAndConflict$ (
          movementSource.coordinates,
          player
        )
      )
    );
  } // chooseFirstMovement$

  private chooseSecondMovement$ (
    player: BaronyColor,
    firstMovement: BaronyMovement
  ): Observable<BaronyMovement | null> {
    return this.chooseLandSourceOrPassForSecondMovement$ (
      player,
      firstMovement
    ).pipe (
      switchMap ((movementSource) => {
        if (movementSource) {
          return this.chooseMovementTargetAndConflict$ (
            movementSource.coordinates,
            player
          );
        } else {
          return of (null);
        } // if - else
      })
    );
  } // chooseSecondMovement$

  private chooseMovementTargetAndConflict$ (
    movementSource: BaronyLandCoordinates,
    player: BaronyColor
  ): Observable<BaronyMovement> {
    return this.chooseLandTargetForMovement$ (movementSource, player).pipe (
      switchMap ((movementTarget) => {
        if (
          baronyRules.isConflict (movementTarget.coordinates, player, this.game)
        ) {
          if (
            baronyRules.isVillageBeingDestroyed (
              movementTarget.coordinates,
              player,
              this.game
            )
          ) {
            const villagePlayer = baronyRules.getVillageDestroyedPlayer (
              movementTarget.coordinates,
              player,
              this.game
            );
            if (
              baronyRules.hasResourcesToTakeForVillageDestruction (
                villagePlayer.id,
                this.game
              )
            ) {
              return this.chooseResourceForVillageDestruction$ (
                player,
                villagePlayer.id
              ).pipe (
                map ((resource) => ({
                  fromLand: movementSource,
                  toLand: movementTarget.coordinates,
                  conflict: true,
                  gainedResource: resource,
                }))
              );
            } // if
          } // if
          return of ({
            fromLand: movementSource,
            toLand: movementTarget.coordinates,
            conflict: true,
            gainedResource: null,
          });
        } else {
          return of ({
            fromLand: movementSource,
            toLand: movementTarget.coordinates,
            conflict: false,
            gainedResource: null,
          });
        } // if - else
      }) // switchMap
    );
  } // chooseMovementTargetAndConflict$

  private chooseResourceForVillageDestruction$ (
    player: BaronyColor,
    villagePlayer: BaronyColor
  ): Observable<BaronyResourceType> {
    const validResourcesForVillageDestruction =
      baronyRules.getValidResourcesForVillageDestruction (
        villagePlayer,
        this.game
      );
    this.ui.updateUi ("Choose resource for village destruction", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a resource to take for the village destruction.",
      validResources: {
        player: villagePlayer,
        resources: validResourcesForVillageDestruction,
      },
    }));
    return this.ui.resourceChange$ ();
  } // chooseResourceForVillageDestruction$

  private chooseLandSourceForFirstMovement$ (
    player: BaronyColor
  ): Observable<BaronyLand> {
    const validSourceLands = baronyRules.getValidSourceLandsForFirstMovement (
      player,
      this.game
    );
    this.ui.updateUi ("Choose land source for first movement", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to move a knight from.",
      validLands: validSourceLands.map ((lt) => lt.coordinates),
    }));
    return this.ui.landChange$ ();
  } // chooseLandSourceForFirstMovement$

  private chooseLandSourceOrPassForSecondMovement$ (
    player: BaronyColor,
    firstMovement: BaronyMovement
  ): Observable<BaronyLand | null> {
    const validSourceLands = baronyRules.getValidSourceLandsForSecondMovement (
      player,
      firstMovement,
      this.game
    );
    this.ui.updateUi ("Choose land source or pass for second movement", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to move a knight from, or pass.",
      validLands: validSourceLands.map ((lt) => lt.coordinates),
      canPass: true,
    }));
    return race (this.ui.landChange$ (), this.ui.passChange$ ().pipe (mapTo (null)));
  } // chooseLandTileSourceOrPassForSecondMovement$

  private chooseLandTargetForMovement$ (
    movementSource: BaronyLandCoordinates,
    player: BaronyColor
  ): Observable<BaronyLand> {
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
    return this.ui.landChange$ ();
  } // chooseLandTargetForMovement$

  private chooseConstructions$ (
    player: BaronyColor,
    prevConstructions: BaronyConstruction[] | null
  ): Observable<BaronyConstruction[]> {
    if (prevConstructions) {
      return this.chooseConstructionOrPass$ (player).pipe (
        switchMap ((construction) => {
          if (construction) {
            this.game.applyConstruction (construction, player);
            const constructions = [...prevConstructions, construction];
            if (baronyRules.isConstructionValid (player, this.game)) {
              return this.chooseConstructions$ (player, constructions);
            } else {
              return of (constructions);
            } // if - else
          } else {
            return of (prevConstructions);
          } // if - else
        })
      );
    } else {
      return this.chooseConstruction$ (player, false).pipe (
        switchMap ((construction) => {
          const constructions = [construction];
          this.game.applyConstruction (construction, player);
          if (baronyRules.isConstructionValid (player, this.game)) {
            return this.chooseConstructions$ (player, constructions);
          } else {
            return of (constructions);
          } // if - else
        })
      );
    } // if - else
  } // chooseConstructions$

  private chooseConstructionOrPass$ (
    player: BaronyColor
  ): Observable<BaronyConstruction | null> {
    return race (
      this.chooseConstruction$ (player, true),
      this.ui.passChange$ ().pipe (mapTo (null))
    );
  } // chooseConstructionOrPass$

  private chooseConstruction$ (
    player: BaronyColor,
    orPass: boolean
  ): Observable<BaronyConstruction> {
    return this.chooseLandForConstruction$ (player, orPass).pipe (
      switchMap ((land) =>
        this.chooseBuildingForConstruction$ (player, orPass).pipe (
          map<"stronghold" | "village", BaronyConstruction> ((building) => ({
            building: building,
            land: land.coordinates,
          }))
        )
      )
    );
  } // chooseConstruction$

  private chooseLandForConstruction$ (
    player: BaronyColor,
    orPass: boolean
  ): Observable<BaronyLand> {
    const validLands = baronyRules.getValidLandsForConstruction (
      player,
      this.game
    );
    this.ui.updateUi ("Choose land for construction", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: `Choose a land tile to construct on${
        orPass ? ", or pass" : ""
      }.`,
      validLands: validLands.map ((lt) => lt.coordinates),
      canPass: orPass,
    }));
    return this.ui.landChange$ ();
  } // chooseLandForConstruction$

  private chooseBuildingForConstruction$ (
    player: BaronyColor,
    orPass: boolean
  ): Observable<"stronghold" | "village"> {
    const validBuildings = baronyRules.getValidBuildingsForConstruction (
      player,
      this.game
    );
    this.ui.updateUi ("Choose building for construction", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: `Choose a building to construct on the tile${
        orPass ? ", or pass" : ""
      }.`,
      validBuildings: validBuildings,
      canPass: orPass,
    }));
    return this.ui.buildingChange$ ();
  } // chooseBuildingForConstruction$

  private chooseNewCity$ (player: BaronyColor): Observable<BaronyLand> {
    const validLandsForNewCity = baronyRules.getValidLandsForNewCity (
      player,
      this.game
    );
    this.ui.updateUi ("Choose new city", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile to build a new city.",
      validLands: validLandsForNewCity.map ((l) => l.coordinates),
    }));
    return this.ui.landChange$ ();
  } // chooseNewCity$

  private chooseExpedition$ (player: BaronyColor): Observable<BaronyLand> {
    const validLandsForExpedition = baronyRules.getValidLandsForExpedition (
      player,
      this.game
    );
    this.ui.updateUi ("Choose expedition", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: "Choose a land tile for the expedition.",
      validLands: validLandsForExpedition.map ((l) => l.coordinates),
    }));
    return this.ui.landChange$ ();
  } // chooseExpedition$

  private chooseNobleTitle$ (player: BaronyColor): Observable<BaronyResourceType[]> {
    return this.chooseResourcesForNobleTitle$ (player, [], 0);
  } // chooseNobleTitle$

  private chooseResourcesForNobleTitle$ (
    player: BaronyColor,
    resources: BaronyResourceType[],
    sum: number
  ): Observable<BaronyResourceType[]> {
    return this.chooseResourceForNobleTitle$ (player, sum).pipe (
      switchMap ((resource) => {
        const resoucePoints = baronyRules.getResourcePoints (resource);
        sum += resoucePoints;
        resources.push (resource);
        this.game.discardResource (resource, player);
        if (sum < 15) {
          return this.chooseResourcesForNobleTitle$ (player, resources, sum);
        } else {
          return of (resources);
        } // if - else
      })
    );
  } // chooseResourcesForNobleTitle$

  private chooseResourceForNobleTitle$ (
    player: BaronyColor,
    sum: number
  ): Observable<BaronyResourceType> {
    const validResourcesForNobleTitle =
      baronyRules.getValidResourcesForNobleTitle (player, this.game);
    this.ui.updateUi ("Choose resource for noble title", (s) => ({
      ...s,
      ...this.ui.resetUi (),
      message: `Choose a resource to discard for the noble title (${sum} / 15).`,
      validResources: {
        player: player,
        resources: validResourcesForNobleTitle,
      },
    }));
    return this.ui.resourceChange$ ();
  } // chooseResourceForNobleTitle$
} // BaronyPlayerLocalService
