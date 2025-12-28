import { Injectable, inject } from "@angular/core";
import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrStory } from "../game/wotr-story-models";
import { WotrStoryService } from "../game/wotr-story-service";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  WotrPoliticalActivation,
  WotrPoliticalAdvance,
  WotrPoliticalAdvanceAtWar,
  WotrPoliticalRecede
} from "./wotr-nation-actions";
import { WotrNationId } from "./wotr-nation-models";
import { WotrNationModifiers } from "./wotr-nation-modifiers";
import { WotrNationAdvanceSource } from "./wotr-nation-rules";
import { WotrNationStore } from "./wotr-nation-store";

@Injectable({ providedIn: "root" })
export class WotrNationHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private nationStore = inject(WotrNationStore);
  private logger = inject(WotrLogWriter);
  private regionStore = inject(WotrRegionStore);
  private characterStore = inject(WotrCharacterStore);
  private nationModifiers = inject(WotrNationModifiers);
  private storyService = inject(WotrStoryService);

  init() {
    this.actionRegistry.registerAction<WotrPoliticalActivation>(
      "political-activation",
      (action, front) => this.nationStore.activate(true, action.nation),
      (action, front, f) => [f.player(front), " activates ", f.nation(action.nation)]
    );
    this.actionRegistry.registerAction<WotrPoliticalAdvance>(
      "political-advance",
      (action, front) =>
        this.advanceNation(action.quantity, action.nation, this.currentNationAdvanceSource()),
      (action, front, f) => [
        f.player(front),
        " advances ",
        f.nation(action.nation),
        " on the Political Track"
      ]
    );
    this.actionRegistry.registerAction<WotrPoliticalRecede>(
      "political-recede",
      action => this.nationStore.recede(action.quantity, action.nation),
      (action, front, f) => [
        f.player(front),
        " recedes ",
        f.nation(action.nation),
        " on the Political Track"
      ]
    );

    this.actionRegistry.registerEffectLogger<WotrPoliticalActivation>(
      "political-activation",
      (effect, f) => [f.nation(effect.nation), " is activated"]
    );
    this.actionRegistry.registerEffectLogger<WotrPoliticalAdvance>(
      "political-advance",
      (effect, f) => [f.nation(effect.nation), " is advanced on the Political Track"]
    );
    this.actionRegistry.registerEffectLogger<WotrPoliticalAdvanceAtWar>(
      "political-advance-at-war",
      (effect, f) => [f.nation(effect.nation), " is advanced to war"]
    );
  }

  checkNationActivationByArmyMovement(regionId: WotrRegionId, armyFront: WotrFrontId) {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (!nation.active && nation.front === "free-peoples" && armyFront === "shadow") {
        this.activateNation(region.nationId);
      }
    }
  }

  checkNationActivationByAttack(regionId: WotrRegionId) {
    const nations = this.nationOfAttackedUnits(regionId);
    for (const nationId of nations) {
      const nation = this.nationStore.nation(nationId);
      if (!nation.active) {
        this.activateNation(nationId);
      }
    }
  }

  checkNationAdvanceByAttack(regionId: WotrRegionId) {
    const nations = this.nationOfAttackedUnits(regionId);
    for (const nationId of nations) {
      const nation = this.nationStore.nation(nationId);
      if (nation.politicalStep !== "atWar") {
        this.advanceNationEffect(1, nationId);
      }
    }
  }

  private nationOfAttackedUnits(regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    const defendingArmy = region.underSiegeArmy || region.army!;
    const nations = new Set<WotrNationId>();
    defendingArmy.regulars?.forEach(r => nations.add(r.nation));
    defendingArmy.elites?.forEach(r => nations.add(r.nation));
    return nations;
  }

  checkNationAdvanceByCapture(regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (nation.politicalStep !== "atWar") {
        this.activateNation(region.nationId);
      }
    }
  }

  checkNationActivationByCharacters(regionId: WotrRegionId, characters: WotrCharacterId[]) {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (
        !nation.active &&
        nation.front === "free-peoples" &&
        (region.settlement === "city" || region.settlement === "stronghold")
      ) {
        for (const characterId of characters) {
          const character = this.characterStore.character(characterId);
          if (
            character.activationNation === "all" ||
            character.activationNation === region.nationId
          ) {
            this.activateNation(region.nationId);
          }
        }
      }
    }
  }

  checkNationActivationByFellowshipDeclaration(regionId: WotrRegionId) {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (
        !nation.active &&
        nation.front === "free-peoples" &&
        (region.settlement === "city" || region.settlement === "stronghold")
      ) {
        this.activateNation(region.nationId);
      }
    }
  }

  activateNation(nation: WotrNationId) {
    const action: WotrPoliticalActivation = { type: "political-activation", nation };
    this.logger.logEffect(action);
    this.nationStore.activate(true, nation);
  }

  advanceNationEffect(quantity: number, nation: WotrNationId) {
    const action: WotrPoliticalAdvance = { type: "political-advance", nation, quantity };
    this.logger.logEffect(action);
    this.advanceNation(quantity, nation, "auto-advance");
  }

  advanceNation(quantity: number, nation: WotrNationId, source: WotrNationAdvanceSource) {
    this.nationStore.advance(quantity, nation);
    this.nationModifiers.onAfterNationAdvance(nation, source);
  }

  advanceAtWar(nation: WotrNationId) {
    const action: WotrPoliticalAdvanceAtWar = { type: "political-advance-at-war", nation };
    this.logger.logEffect(action);
    this.nationStore.advanceAtWar(nation);
  }

  activateAllFreePeoplesNations(): void {
    const nations = this.nationStore.freePeoplesNations();
    for (const nation of nations) {
      if (!nation.active) {
        this.activateNation(nation.id);
      }
    }
  }

  private currentNationAdvanceSource(): WotrNationAdvanceSource {
    const story = this.storyService.getCurrentStory() as WotrStory;
    switch (story.type) {
      case "die":
        switch (story.die) {
          case "muster":
            return "muster-die-result";
          case "muster-army":
            return "muster-army-die-result";
          case "will-of-the-west":
            return "will-of-the-west-die-result";
          default:
            throw new Error(`Unexpected die type: ${story.die}`);
        }
      case "die-card":
        return "card-ability";
      case "reaction-card":
        return "card-ability";
      case "reaction-character":
        return "character-ability";
      case "token":
        return "token";
      default:
        throw new Error(`Unexpected story type: ${story.type}`);
    }
  }
}
