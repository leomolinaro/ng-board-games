import { Injectable, inject } from "@angular/core";
import { WotrUiAbility } from "../ability/wotr-ability";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { WotrStory } from "../game/wotr-story-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrNazgulMovement, moveNazgul } from "../unit/wotr-unit-actions";
import { WotrUnitHandler } from "../unit/wotr-unit-handler";
import { WotrCharacterCard } from "./characters/wotr-character-card";
import { WotrCharacterMovement, moveCharacters } from "./wotr-character-actions";
import { WotrCharacterHandler } from "./wotr-character-handler";
import { WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterRules } from "./wotr-character-rules";
import { WotrCharacterStore } from "./wotr-character-store";
import { WotrCharacters } from "./wotr-characters";

class WotrBringCharacterIntoPlayChoice implements WotrUiChoice {
  constructor(
    private die: WotrActionDie,
    private characterCard: WotrCharacterCard,
    private characterStore: WotrCharacterStore,
    private ui: WotrGameUi
  ) {}

  label(): string {
    return this.characterStore.character(this.characterCard.characterId).name;
  }

  isAvailable(): boolean {
    return this.characterCard.canBeBroughtIntoPlay(this.die);
  }

  async actions(): Promise<WotrAction[]> {
    return [await this.characterCard.bringIntoPlay(this.ui)];
  }
}

export interface WotrCharacterMovementOptions {
  extraMovements?: number;
  asLevel?: number;
  onlyOneGroup?: boolean;
  canEndInSiege?: boolean;
}

@Injectable({ providedIn: "root" })
export class WotrCharacterUi {
  private regionStore = inject(WotrRegionStore);
  private characterStore = inject(WotrCharacterStore);
  private characterRules = inject(WotrCharacterRules);
  private characters = inject(WotrCharacters);
  private characterHandler = inject(WotrCharacterHandler);
  private unitHandler = inject(WotrUnitHandler);
  private ui = inject(WotrGameUi);

  bringCharacterIntoPlay(die: WotrActionDie, frontId: WotrFrontId): Promise<WotrAction[]> {
    const characterCards =
      frontId === "free-peoples"
        ? this.characters.freePeoplesCharacterCards()
        : this.characters.shadowCharacterCards();
    return this.ui.askChoice(
      "Choose character to bring into play",
      characterCards.map<WotrUiChoice>(
        characterCard =>
          new WotrBringCharacterIntoPlayChoice(die, characterCard, this.characterStore, this.ui)
      ),
      frontId
    );
  }

  async moveCompanions(options?: WotrCharacterMovementOptions): Promise<WotrAction[]> {
    const movableCompanions = new Set(
      this.characterStore
        .companions()
        .filter(c => this.characterRules.canMoveCharacter(c))
        .map(c => c.id)
    );
    const actions: WotrAction[] = [];
    let continueMoving = movableCompanions.size > 0;
    while (continueMoving) {
      const action = await this.moveCharacterGroup(movableCompanions);
      this.characterHandler.moveCharacters(action.characters, action.fromRegion, action.toRegion);
      actions.push(action);
      action.characters.forEach(c => movableCompanions.delete(c));
      if (movableCompanions.size > 0 && !options?.onlyOneGroup) {
        continueMoving = await this.ui.askConfirm(
          "Do you want to move more companions?",
          "Move more",
          "Stop moving"
        );
      } else {
        continueMoving = false;
      }
    }
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
        this.characterHandler.moveCharacters(action.characters, action.fromRegion, action.toRegion);
        actions.push(action);
        action.characters.forEach(c => moveableNonFlyingMinions.delete(c));
      } else {
        const moveNazgulActions = await this.moveNazgul();
        for (const action of moveNazgulActions) {
          if (action.type === "nazgul-movement") {
            this.unitHandler.moveNazgul(action);
          } else {
            this.characterHandler.moveCharacters(
              action.characters,
              action.fromRegion,
              action.toRegion
            );
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

  async moveAnyOrAllNazgul(): Promise<WotrAction[]> {
    const hasNazgul =
      this.characterRules.canMoveStandardNazgul() ||
      this.characterRules.canMoveCharacter(this.characterStore.character("the-witch-king"));
    if (!hasNazgul) {
      await this.ui.askContinue("No Nazgul to move");
      return [];
    }
    const actions: WotrAction[] = [];
    let continueMoving = true;
    do {
      const moveNazgulActions = await this.moveNazgul();
      for (const action of moveNazgulActions) {
        if (action.type === "nazgul-movement") {
          this.unitHandler.moveNazgul(action);
        } else {
          this.characterHandler.moveCharacters(
            action.characters,
            action.fromRegion,
            action.toRegion
          );
        }
        actions.push(action);
      }
      continueMoving = await this.ui.askConfirm(
        "Do you want to move more Nazgul?",
        "Move more",
        "Stop moving"
      );
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
    moveableCharacters: Set<WotrCharacterId>,
    options?: WotrCharacterMovementOptions
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
    let totalMovements =
      options?.asLevel ?? this.characterRules.characterGroupLevel(movingCharacters);
    if (options?.extraMovements) totalMovements += options.extraMovements;
    const targetRegions = this.regionStore.reachableRegions(
      fromRegion,
      totalMovements,
      (region, distance) => this.characterRules.companionCanEnterRegion(region, distance, options),
      (region, distance) => this.characterRules.companionCanLeaveRegion(region, distance)
    );
    const toRegion = await this.ui.askRegion("Select a region to move companions", targetRegions);

    return moveCharacters(fromRegion, toRegion, ...movingCharacters);
  }

  bringCharacterIntoPlayChoice(die: WotrActionDie): WotrUiChoice {
    return {
      label: () => "Bring character into play",
      isAvailable: (frontId: WotrFrontId) =>
        this.characters.canBringCharacterIntoPlay(die, frontId),
      actions: (frontId: WotrFrontId) => this.bringCharacterIntoPlay(die, frontId)
    };
  }

  async activateCharacterAbility(
    ability: WotrUiAbility,
    characterId: WotrCharacterId
  ): Promise<WotrStory> {
    const character = this.characterStore.character(characterId);
    const confirm = await this.ui.askConfirm(
      `Do you want to activate ${character.name + "'s ability?"}`,
      "Activate",
      "Skip"
    );
    if (confirm) {
      return {
        type: "reaction-character",
        character: characterId,
        actions: await ability.play()
      };
    } else {
      return { type: "reaction-character-skip", character: characterId };
    }
  }

  moveCompanionsChoice: WotrUiChoice = {
    label: () => "Move companions",
    isAvailable: () => this.characterRules.canMoveCompanions(),
    actions: () => this.moveCompanions()
  };

  moveMinionsChoice: WotrUiChoice = {
    label: () => "Move minions",
    isAvailable: () => this.characterRules.canMoveNazgulOrMinions(),
    actions: () => this.moveNazgulAndMinions()
  };
}
