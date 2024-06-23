import { Injectable, inject } from "@angular/core";
import { WotrCard, WotrCardCombatLabel } from "../card/wotr-card.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrStoryService } from "../game/wotr-story.service";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyUtils } from "../unit/wotr-army.utils";
import { WotrArmy } from "../unit/wotr-unit.models";
import { WotrCombatFront, WotrCombatRound } from "./wotr-battle.models";

export interface WotrCombatCardParams {
  front: WotrFrontId;
  shadow: WotrCombatFront;
  freePeoples: WotrCombatFront;
  combatRound: WotrCombatRound;
  card: WotrCard;
  isAttacker: boolean;
  attackedArmy: () => WotrArmy | undefined;
  attackingArmy: () => WotrArmy | undefined;
}

@Injectable ()
export class WotrCombatCardsService {

  private storyService = inject (WotrStoryService);
  private regionStore = inject (WotrRegionStore);
  private armyUtil = inject (WotrArmyUtils);

  async combatCardReaction (params: WotrCombatCardParams): Promise<void> {
    return this.combatCardEffects[params.card.combatLabel] (params);
  }

  private combatCardEffects: Record<WotrCardCombatLabel, (params: WotrCombatCardParams) => Promise<void>> = {
    "Advantageous Position": async params => { params.shadow.combatModifiers.push (-1); },
    Anduril: async params => { throw new Error ("TODO"); },
    "Black Breath": async params => { throw new Error ("TODO"); },
    "Blade of Westernesse": async params => { throw new Error ("TODO"); },
    "Brave Stand": async params => { throw new Error ("TODO"); },
    Charge: async params => { throw new Error ("TODO"); },
    Confusion: async params => { throw new Error ("TODO"); },
    "Cruel as Death": async params => {
      const leaders = await this.storyService.forfeitLeadership (params.front);
    },
    "Daring Defiance": async params => { throw new Error ("TODO"); },
    Daylight: async params => {
      params.shadow.maxNDice = 3;
    },
    "Deadly Strife": async params => {
      params.shadow.combatModifiers.push (2);
      params.shadow.leaderModifiers.push (2);
      params.freePeoples.combatModifiers.push (2);
      params.freePeoples.leaderModifiers.push (2);
    },
    "Delivery of Orthanc": async params => { throw new Error ("TODO"); },
    "Desperate Battle": async params => {
      params.shadow.combatModifiers.push (1);
      params.shadow.leaderModifiers.push (1);
      params.freePeoples.combatModifiers.push (1);
      params.freePeoples.leaderModifiers.push (1);
    },
    "Dread and Despair": async params => {
      const leaders = await this.storyService.forfeitLeadership (params.front);
    },
    "Durin's Bane": async params => { throw new Error ("TODO"); },
    "Ents' Rage": async params => { throw new Error ("TODO"); },
    "Fateful Strike": async params => { throw new Error ("TODO"); },
    "Foul Stench": async params => { throw new Error ("TODO"); },
    "Great Host": async params => {
      const attackedArmy = params.attackedArmy ();
      const attackingArmy = params.attackingArmy ();
      const nAttackedArmyUnits = attackedArmy ? this.armyUtil.getNArmyUnits (attackedArmy) : 0;
      const nAttackingArmyUnits = attackingArmy ? this.armyUtil.getNArmyUnits (attackingArmy) : 0;
      if ((params.isAttacker && nAttackedArmyUnits && nAttackingArmyUnits >= 2 * nAttackedArmyUnits) ||
        (!params.isAttacker && nAttackingArmyUnits && nAttackedArmyUnits >= 2 * nAttackingArmyUnits)) {
        await this.storyService.chooseCasualties ("free-peoples");
      }
    },
    "Heroic Death": async params => { throw new Error ("TODO"); },
    "Huorn-dark": async params => { throw new Error ("TODO"); },
    "It is a Gift": async params => { throw new Error ("TODO"); },
    "Mighty Attack": async params => { throw new Error ("TODO"); },
    Mumakil: async params => { throw new Error ("TODO"); },
    "Nameless Wood": async params => { throw new Error ("TODO"); },
    "No Quarter": async params => {
      // TODO
    },
    "One for the Dark Lord": async params => { throw new Error ("TODO"); },
    Onslaught: async params => { throw new Error ("TODO"); },
    "Relentless Assault": async params => {
      const casualties = await this.storyService.chooseCasualties ("shadow");
      const hits = casualties.reduce ((h, c) => h + (c.type === "regular-unit-elimination" ? 1 : 2), 0);
      if (hits) { params.shadow.combatModifiers.push (hits); }
    },
    Scouts: async params => {
      const r = await this.storyService.activateCombatCard (params.card.id, params.front);
      // eslint-disable-next-line require-atomic-updates
      if (r) { params.combatRound.endBattle = true; }
    },
    "Servant of the Secret Fire": async params => { throw new Error ("TODO"); },
    "Shield-Wall": async params => {
      // TODO
    },
    "Sudden Strike": async params => { throw new Error ("TODO"); },
    "Swarm of Bats": async params => { throw new Error ("TODO"); },
    "They are Terrible": async params => { throw new Error ("TODO"); },
    Valour: async params => {
      params.freePeoples.combatModifiers.push (1);
    },
    "We Come to Kill": async params => { throw new Error ("TODO"); },
    "Words of Power": async params => { throw new Error ("TODO"); },
  };

}
