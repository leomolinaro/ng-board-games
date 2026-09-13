import { Injectable, inject } from '@angular/core';
import type { WotrArmyAttack } from '../battle/wotr-battle-actions';
import type { WotrCharacterId } from '../character/wotr-character-models';
import { WotrActionRegistry } from '../commons/wotr-action-registry';
import type { WotrFrontId } from '../front/wotr-front-models';
import { WotrGameQuery } from '../game/wotr-game-query';
import { WotrStoryService } from '../game/wotr-story-service';
import { WotrLogWriter } from '../log/wotr-log-writer';
import type { WotrRegionId } from '../region/wotr-region-models';
import { WotrRegionStore } from '../region/wotr-region-store';
import type {
  WotrPoliticalActivation,
  WotrPoliticalAdvance,
  WotrPoliticalAdvanceAtWar,
  WotrPoliticalRecede,
} from './wotr-nation-actions';
import type { WotrNationId } from './wotr-nation-models';
import { WotrNationModifiers } from './wotr-nation-modifiers';
import type {
  WotrNationActivationSource,
  WotrNationAdvanceSource,
} from './wotr-nation-rules';
import { WotrNationStore } from './wotr-nation-store';

@Injectable()
export class WotrNationHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private nationStore = inject(WotrNationStore);
  private logger = inject(WotrLogWriter);
  private regionStore = inject(WotrRegionStore);
  private nationModifiers = inject(WotrNationModifiers);
  private storyService = inject(WotrStoryService);
  private q = inject(WotrGameQuery);

  init(): void {
    this.actionRegistry.registerAction<WotrPoliticalActivation>(
      'political-activation',
      (action) => this.activateNation(action.nation, 'card-ability'),
      (action, front, f) => [
        f.player(front),
        ' activates ',
        f.nation(action.nation),
      ],
    );
    this.actionRegistry.registerAction<WotrPoliticalAdvance>(
      'political-advance',
      (action) =>
        this.advanceNation(
          action.quantity,
          action.nation,
          this.currentNationAdvanceSource(),
        ),
      (action, front, f) => [
        f.player(front),
        ' advances ',
        f.nation(action.nation),
        ' on the Political Track',
      ],
    );
    this.actionRegistry.registerAction<WotrPoliticalRecede>(
      'political-recede',
      (action) => this.nationStore.recede(action.quantity, action.nation),
      (action, front, f) => [
        f.player(front),
        ' recedes ',
        f.nation(action.nation),
        ' on the Political Track',
      ],
    );

    this.actionRegistry.registerEffectLogger<WotrPoliticalActivation>(
      'political-activation',
      (effect, f) => [f.nation(effect.nation), ' is activated'],
    );
    this.actionRegistry.registerEffectLogger<WotrPoliticalAdvance>(
      'political-advance',
      (effect, f) => [
        f.nation(effect.nation),
        ' is advanced on the Political Track',
      ],
    );
    this.actionRegistry.registerEffectLogger<WotrPoliticalAdvanceAtWar>(
      'political-advance-at-war',
      (effect, f) => [f.nation(effect.nation), ' is advanced to war'],
    );
  }

  checkNationActivationByArmyMovement(
    regionId: WotrRegionId,
    armyFront: WotrFrontId,
  ): void {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (
        armyFront === 'shadow' &&
        !nation.active &&
        nation.front === 'free-peoples'
      ) {
        this.activateNationEffect(region.nationId, 'region-entered');
      }
    }
  }

  checkNationActivationByAttack(attack: WotrArmyAttack): void {
    const nations = this.nationOfAttackedUnits(attack.toRegion);
    for (const nationId of nations) {
      const nation = this.nationStore.nation(nationId);
      if (!nation.active) {
        this.activateNationEffect(nationId, attack);
      }
    }
  }

  checkNationAdvanceByAttack(regionId: WotrRegionId): void {
    const nations = this.nationOfAttackedUnits(regionId);
    for (const nationId of nations) {
      const nation = this.nationStore.nation(nationId);
      if (nation.politicalStep !== 'atWar') {
        this.advanceNationEffect(1, nationId);
      }
    }
  }

  private nationOfAttackedUnits(regionId: WotrRegionId): Set<WotrNationId> {
    const region = this.regionStore.region(regionId);
    const defendingArmy = region.underSiegeArmy ?? region.army!;
    const nations = new Set<WotrNationId>();
    if (defendingArmy.regulars)
      for (const r of defendingArmy.regulars) nations.add(r.nation);
    if (defendingArmy.elites)
      for (const r of defendingArmy.elites) nations.add(r.nation);
    return nations;
  }

  checkNationAdvanceByCapture(regionId: WotrRegionId): void {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (nation.politicalStep !== 'atWar') {
        this.advanceNationEffect(1, region.nationId);
      }
    }
  }

  checkNationActivationByCharacters(
    regionId: WotrRegionId,
    characters: WotrCharacterId[],
  ): void {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (
        !nation.active &&
        nation.front === 'free-peoples' &&
        (region.settlement === 'city' || region.settlement === 'stronghold')
      ) {
        let shouldActivate = false;
        for (const characterId of characters) {
          const character = this.q.character(characterId);
          if (
            character.activationNation === 'all' ||
            character.activationNation === region.nationId
          ) {
            shouldActivate = true;
          }
        }
        if (shouldActivate) {
          this.activateNationEffect(region.nationId, 'companion-ability');
        }
      }
    }
  }

  checkNationActivationByFellowshipDeclaration(regionId: WotrRegionId): void {
    const region = this.regionStore.region(regionId);
    if (region.nationId) {
      const nation = this.nationStore.nation(region.nationId);
      if (
        !nation.active &&
        nation.front === 'free-peoples' &&
        (region.settlement === 'city' || region.settlement === 'stronghold')
      ) {
        this.activateNationEffect(region.nationId, 'fellowship-declaration');
      }
    }
  }

  activateNation(
    nation: WotrNationId,
    source: WotrNationActivationSource,
  ): void {
    if (this.nationModifiers.canActivateNation(nation, source)) {
      this.nationStore.activate(true, nation);
      this.nationModifiers.onAfterNationActivation(nation, source);
    } else {
      // TODO WOTR log
    }
  }

  activateNationEffect(
    nation: WotrNationId,
    source: WotrNationActivationSource,
  ): void {
    if (this.nationModifiers.canActivateNation(nation, source)) {
      const action: WotrPoliticalActivation = {
        type: 'political-activation',
        nation,
      };
      this.logger.logEffect(action);
      this.activateNation(nation, source);
    } else {
      // TODO WOTR log
    }
  }

  advanceNationEffect(quantity: number, nation: WotrNationId): void {
    if (this.canAdvanceForActiveState(quantity, nation)) {
      const action: WotrPoliticalAdvance = {
        type: 'political-advance',
        nation,
        quantity,
      };
      this.logger.logEffect(action);
      this.advanceNation(quantity, nation, 'auto-advance');
    } else {
      // TODO WOTR log
    }
  }

  advanceNation(
    quantity: number,
    nation: WotrNationId,
    source: WotrNationAdvanceSource,
  ): void {
    if (this.canAdvanceForActiveState(quantity, nation)) {
      this.nationStore.advance(quantity, nation);
      this.nationModifiers.onAfterNationAdvance(nation, source);
    } else {
      // TODO WOTR log
    }
  }

  advanceAtWar(nation: WotrNationId, source: WotrNationAdvanceSource): void {
    if (this.canAdvanceForActiveState('war', nation)) {
      const action: WotrPoliticalAdvanceAtWar = {
        type: 'political-advance-at-war',
        nation,
      };
      this.logger.logEffect(action);
      this.nationStore.advanceAtWar(nation);
      this.nationModifiers.onAfterNationAdvance(nation, source);
    } else {
      // TODO WOTR log
    }
  }

  private canAdvanceForActiveState(
    quantity: number | 'war',
    nation: WotrNationId,
  ): boolean {
    const isActive = this.nationStore.isActive(nation);
    if (isActive) return true;
    const stepsToWar = this.nationStore.stepsToWar(nation);
    const shouldGoToWar = quantity === 'war' || quantity >= stepsToWar;
    return !shouldGoToWar;
  }

  activateAllFreePeoplesNations(source: WotrNationActivationSource): void {
    const nations = this.nationStore.freePeoplesNations();
    for (const nation of nations) {
      if (!nation.active) {
        this.activateNationEffect(nation.id, source);
      }
    }
  }

  private currentNationAdvanceSource(): WotrNationAdvanceSource {
    const story = this.storyService.getCurrentStory()!;
    switch (story.type) {
      case 'die':
        if (story.character) return 'character-ability';
        switch (story.die) {
          case 'muster':
            return 'muster-die-result';
          case 'muster-army':
            return 'muster-army-die-result';
          case 'will-of-the-west':
            return 'will-of-the-west-die-result';
          default:
            throw new Error(`Unexpected die type`);
        }
      case 'die-card':
        return 'card-ability';
      case 'card-effect':
        return 'card-ability';
      case 'character-effect':
        return 'character-ability';
      case 'token':
        return 'token';
      default:
        throw new Error(`Unexpected story type: ${story.type}`);
    }
  }
}
