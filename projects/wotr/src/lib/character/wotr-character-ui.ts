import { Injectable, inject } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameUi, WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrNazgulMovement, moveNazgul } from "../unit/wotr-unit-actions";
import { WotrUnitHandler } from "../unit/wotr-unit-handler";
import { WotrCharacterMovement, moveCharacters } from "./wotr-character-actions";
import { WotrCharacterHandler } from "./wotr-character-handler";
import { WotrCharacterRules } from "./wotr-character-rules";
import { WotrCharacterId } from "./wotr-character.models";
import { WotrCharacterStore } from "./wotr-character.store";

@Injectable({ providedIn: "root" })
export class WotrCharacterUi {
  private regionStore = inject(WotrRegionStore);
  private characterStore = inject(WotrCharacterStore);
  private characterRules = inject(WotrCharacterRules);
  private characterHandler = inject(WotrCharacterHandler);
  private unitHandler = inject(WotrUnitHandler);
  private ui = inject(WotrGameUi);

  bringCharacterIntoPlay(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrAction[]> {
    const cards =
      frontId === "free-peoples"
        ? this.characterRules.freePeoplesCharacterCards()
        : this.characterRules.shadowCharacterCards();
    return this.ui.askChoice(
      "Choose character to bring into play",
      cards.map<WotrPlayerChoice>(card => ({
        label: () => card.name(),
        isAvailable: () => card.canBeBroughtIntoPlay(die),
        resolve: async () => {
          const action = await card.bringIntoPlay(this.ui);
          return [action];
        }
      })),
      frontId
    );
  }

  async moveCompanions(): Promise<WotrAction[]> {
    const movableCompanions = new Set(
      this.characterStore
        .companions()
        .filter(c => this.characterRules.canMoveCharacter(c))
        .map(c => c.id)
    );
    const actions: WotrAction[] = [];
    let continueMoving = true;
    do {
      const action = await this.moveCharacterGroup(movableCompanions);
      this.characterHandler.moveCharacters(action, "free-peoples");
      actions.push(action);
      action.characters.forEach(c => movableCompanions.delete(c));
      if (movableCompanions.size > 0) {
        continueMoving = await this.ui.askConfirm(
          "Do you want to move more companions?",
          "Move more",
          "Stop moving"
        );
      } else {
        continueMoving = false;
      }
    } while (continueMoving);
    return actions;
  }

  async moveNazgulAndMinions(): Promise<WotrAction[]> {
    const moveableNonFlyingMinions = new Set(
      this.characterStore
        .minions()
        .filter(c => !c.flying && this.characterRules.canMoveCharacter(c))
        .map(c => c.id)
    );
    const hasNazgul =
      this.characterRules.canMoveStandardNazgul() ||
      this.characterRules.canMoveCharacter(this.characterStore.character("the-witch-king"));
    const actions: WotrAction[] = [];
    let continueMoving = true;
    do {
      let moveNonFlyingMinions = moveableNonFlyingMinions.size > 0;
      if (moveNonFlyingMinions && hasNazgul) {
        moveNonFlyingMinions = await this.ui.askConfirm(
          "Do you want to move non-flying minions or Nazgul?",
          "Move non-flying minions",
          "Move Nazgul"
        );
      }

      if (moveNonFlyingMinions) {
        const action = await this.moveCharacterGroup(moveableNonFlyingMinions);
        this.characterHandler.moveCharacters(action, "shadow");
        actions.push(action);
        action.characters.forEach(c => moveableNonFlyingMinions.delete(c));
      } else {
        const moveNazgulActions = await this.moveNazgul();
        for (const action of moveNazgulActions) {
          if (action.type === "nazgul-movement") {
            this.unitHandler.moveNazgul(action);
          } else {
            this.characterHandler.moveCharacters(action, "shadow");
          }
          actions.push(action);
        }
      }

      if (hasNazgul || moveableNonFlyingMinions.size > 0) {
        continueMoving = await this.ui.askConfirm(
          "Do you want to move more minions?",
          "Move more",
          "Stop moving"
        );
      } else {
        continueMoving = false;
      }
    } while (continueMoving);
    return actions;
  }

  private async moveNazgul(): Promise<(WotrNazgulMovement | WotrCharacterMovement)[]> {
    const fromRegions = this.regionStore
      .regions()
      .filter(region => this.characterRules.hasNazgul(region));
    const movingNazgul = await this.ui.askRegionUnits("Select Nazgul to move", {
      type: "moveNazgul",
      regionIds: fromRegions.map(r => r.id)
    });
    const fromRegion = movingNazgul.regionId;
    const targetRegions = this.regionStore.regions().filter(region => {
      if (
        region.settlement === "stronghold" &&
        region.controlledBy === "free-peoples" &&
        !region.underSiegeArmy
      )
        return false;
      return true;
    });
    const targetRegion = await this.ui.askRegion(
      "Select a region to move Nazgul",
      targetRegions.map(r => r.id)
    );
    const actions: (WotrNazgulMovement | WotrCharacterMovement)[] = [];
    if (movingNazgul.nNazgul) {
      actions.push(moveNazgul(fromRegion, targetRegion, movingNazgul.nNazgul));
    }
    if (movingNazgul.characters?.includes("the-witch-king")) {
      actions.push(moveCharacters(fromRegion, targetRegion, "the-witch-king"));
    }
    return actions;
  }

  private async moveCharacterGroup(
    moveableCharacters: Set<WotrCharacterId>
  ): Promise<WotrCharacterMovement> {
    const fromRegions = this.regionStore.regions().filter(region => {
      if (region.army?.characters?.some(c => moveableCharacters.has(c))) return true;
      if (region.freeUnits?.characters?.some(c => moveableCharacters.has(c))) return true;
      return false;
    });
    const movingUnits = await this.ui.askRegionUnits("Choose characters to move", {
      type: "moveCharacters",
      regionIds: fromRegions.map(r => r.id),
      characters: Array.from(moveableCharacters)
    });
    const movingCharacters = movingUnits.characters!;
    const fromRegion = movingUnits.regionId;
    const level = this.characterRules.characterGroupLevel(movingCharacters);

    const targetRegions = this.regionStore.reachableRegions(
      fromRegion,
      level,
      (region, distance) => this.characterRules.companionCanEnterRegion(region, distance),
      (region, distance) => this.characterRules.companionCanLeaveRegion(region, distance)
    );
    const toRegion = await this.ui.askRegion("Select a region to move companions", targetRegions);

    return moveCharacters(fromRegion, toRegion, ...movingCharacters);
  }
}
