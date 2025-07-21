import { Injectable, inject } from "@angular/core";
import { WotrCharacterId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import {
  WotrActionApplier,
  WotrActionLoggerMap,
  WotrEffectLoggerMap
} from "../commons/wotr-action.models";
import { WotrActionService } from "../commons/wotr-action.service";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrLogStore } from "../log/wotr-log.store";
import { WotrRegionId } from "../region/wotr-region.models";
import { WotrRegionStore } from "../region/wotr-region.store";
import {
  WotrNationAction,
  WotrPoliticalActivation,
  WotrPoliticalAdvance
} from "./wotr-nation-actions";
import { WotrNationId } from "./wotr-nation.models";
import { WotrNationStore } from "./wotr-nation.store";

@Injectable({ providedIn: "root" })
export class WotrNationHandler {
  private actionService = inject(WotrActionService);
  private nationStore = inject(WotrNationStore);
  private logStore = inject(WotrLogStore);
  private regionStore = inject(WotrRegionStore);
  private characterStore = inject(WotrCharacterStore);

  init() {
    this.actionService.registerAction<WotrPoliticalActivation>(
      "political-activation",
      this.politicalActivation
    );
    this.actionService.registerAction<WotrPoliticalAdvance>(
      "political-advance",
      this.politicalAdvance
    );
    this.actionService.registerActionLoggers(this.getActionLoggers() as any);
    this.actionService.registerEffectLoggers(this.getEffectLoggers() as any);
  }

  private politicalActivation: WotrActionApplier<WotrPoliticalActivation> = async action => {
    this.nationStore.activate(true, action.nation);
  };

  private politicalAdvance: WotrActionApplier<WotrPoliticalAdvance> = async action => {
    this.nationStore.advance(action.quantity, action.nation);
  };

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
        this.advanceNation(1, nationId);
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

  private activateNation(nation: WotrNationId) {
    const action: WotrPoliticalActivation = { type: "political-activation", nation };
    this.logStore.logEffect(action);
    this.nationStore.activate(true, nation);
  }

  advanceNation(quantity: number, nation: WotrNationId) {
    const action: WotrPoliticalAdvance = { type: "political-advance", nation, quantity };
    this.logStore.logEffect(action);
    this.nationStore.advance(quantity, nation);
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrNationAction> {
    return {
      "political-activation": (action, front, f) => [
        f.player(front),
        " activates ",
        f.nation(action.nation)
      ],
      "political-advance": (action, front, f) => [
        f.player(front),
        " advances ",
        f.nation(action.nation),
        " on the Political Track"
      ]
    };
  }

  private getEffectLoggers(): WotrEffectLoggerMap<WotrNationAction> {
    return {
      "political-activation": (effect, f) => [f.nation(effect.nation), " is activated"],
      "political-advance": (effect, f) => [
        f.nation(effect.nation),
        " is advanced on the Political Track"
      ]
    };
  }
}
