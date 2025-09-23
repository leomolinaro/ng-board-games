import { Injectable, inject } from "@angular/core";
import { unexpectedStory } from "@leobg/commons";
import { WotrCard, WotrCardCombatLabel, WotrCardId } from "../card/wotr-card-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { assertAction } from "../game/wotr-story-models";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionId } from "../region/wotr-region-models";
import { WotrUnitHandler } from "../unit/wotr-unit-handler";
import { WotrArmy, WotrLeaderUnits } from "../unit/wotr-unit-models";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import { WotrLeaderForfeit } from "./wotr-battle-actions";
import { WotrCombatFront, WotrCombatRound } from "./wotr-battle-models";

export interface WotrCombatCardParams {
  front: WotrFrontId;
  shadow: WotrCombatFront;
  freePeoples: WotrCombatFront;
  combatRound: WotrCombatRound;
  card: WotrCard;
  isAttacker: boolean;
  attackedArmy: () => WotrArmy | undefined;
  attackingArmy: () => WotrArmy | undefined;
  regionId: WotrRegionId;
}

@Injectable({ providedIn: "root" })
export class WotrCombatCardsService {
  private unitService = inject(WotrUnitHandler);
  private unitUtils = inject(WotrUnitUtils);

  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);

  async combatCardReaction(params: WotrCombatCardParams): Promise<void> {
    return this.combatCardEffects[params.card.combatLabel](params);
  }

  private async activateCombatCard(
    cardId: WotrCardId,
    player: WotrPlayer
  ): Promise<false | WotrAction[]> {
    const story = await player.activateCombatCard(cardId);
    switch (story.type) {
      case "reaction-combat-card":
        return story.actions;
      case "reaction-combat-card-skip":
        return false;
      default:
        throw unexpectedStory(story, " combat card activation or not");
    }
  }

  async forfeitLeadership(player: WotrPlayer): Promise<WotrLeaderUnits> {
    const story = await player.forfeitLeadership();
    const action = assertAction<WotrLeaderForfeit>(story, "leader-forfeit");
    return action.leaders;
  }

  private combatCardEffects: Record<
    WotrCardCombatLabel,
    (params: WotrCombatCardParams) => Promise<void>
  > = {
    "Advantageous Position": async params => {
      params.shadow.combatModifiers.push(-1);
    },
    "Anduril": async params => {
      throw new Error("TODO");
    },
    "Black Breath": async params => {
      throw new Error("TODO");
    },
    "Blade of Westernesse": async params => {
      throw new Error("TODO");
    },
    "Brave Stand": async params => {
      throw new Error("TODO");
    },
    "Charge": async params => {
      throw new Error("TODO");
    },
    "Confusion": async params => {
      throw new Error("TODO");
    },
    "Cruel as Death": async params => {
      await this.forfeitLeadership(this.shadow);
    },
    "Daring Defiance": async params => {
      throw new Error("TODO");
    },
    "Daylight": async params => {
      params.shadow.maxNDice = 3;
    },
    "Deadly Strife": async params => {
      params.shadow.combatModifiers.push(2);
      params.shadow.leaderModifiers.push(2);
      params.freePeoples.combatModifiers.push(2);
      params.freePeoples.leaderModifiers.push(2);
    },
    "Delivery of Orthanc": async params => {
      throw new Error("TODO");
    },
    "Desperate Battle": async params => {
      params.shadow.combatModifiers.push(1);
      params.shadow.leaderModifiers.push(1);
      params.freePeoples.combatModifiers.push(1);
      params.freePeoples.leaderModifiers.push(1);
    },
    "Dread and Despair": async params => {
      await this.forfeitLeadership(this.shadow);
    },
    "Durin's Bane": async params => {
      throw new Error("TODO");
    },
    "Ents' Rage": async params => {
      throw new Error("TODO");
    },
    "Fateful Strike": async params => {
      throw new Error("TODO");
    },
    "Foul Stench": async params => {
      throw new Error("TODO");
    },
    "Great Host": async params => {
      const attackedArmy = params.attackedArmy();
      const attackingArmy = params.attackingArmy();
      const nAttackedArmyUnits = attackedArmy ? this.unitUtils.getNArmyUnits(attackedArmy) : 0;
      const nAttackingArmyUnits = attackingArmy ? this.unitUtils.getNArmyUnits(attackingArmy) : 0;
      if (
        (params.isAttacker &&
          nAttackedArmyUnits &&
          nAttackingArmyUnits >= 2 * nAttackedArmyUnits) ||
        (!params.isAttacker && nAttackingArmyUnits && nAttackedArmyUnits >= 2 * nAttackingArmyUnits)
      ) {
        await this.unitService.chooseCasualties(1, params.regionId, null, this.freePeoples); // TODO hitPoints
      }
    },
    "Heroic Death": async params => {
      throw new Error("TODO");
    },
    "Huorn-dark": async params => {
      throw new Error("TODO");
    },
    "It is a Gift": async params => {
      throw new Error("TODO");
    },
    "Mighty Attack": async params => {
      throw new Error("TODO");
    },
    "Mumakil": async params => {
      throw new Error("TODO");
    },
    "Nameless Wood": async params => {
      throw new Error("TODO");
    },
    "No Quarter": async params => {
      // TODO
    },
    "One for the Dark Lord": async params => {
      throw new Error("TODO");
    },
    "Onslaught": async params => {
      throw new Error("TODO");
    },
    "Relentless Assault": async params => {
      const casualties = await this.unitService.chooseCasualties(
        1,
        params.regionId,
        null,
        this.shadow
      ); // TODO hitPoints
      const hits = casualties?.reduce(
        (h, c) => h + (c.type === "regular-unit-elimination" ? 1 : 2),
        0
      );
      if (hits) {
        params.shadow.combatModifiers.push(hits);
      }
    },
    "Scouts": async params => {
      const r = await this.activateCombatCard(params.card.id, this.freePeoples);
      // eslint-disable-next-line require-atomic-updates
      if (r) {
        params.combatRound.endBattle = true;
      }
    },
    "Servant of the Secret Fire": async params => {
      throw new Error("TODO");
    },
    "Shield-Wall": async params => {
      // TODO
    },
    "Sudden Strike": async params => {
      throw new Error("TODO");
    },
    "Swarm of Bats": async params => {
      throw new Error("TODO");
    },
    "They are Terrible": async params => {
      throw new Error("TODO");
    },
    "Valour": async params => {
      params.freePeoples.combatModifiers.push(1);
    },
    "We Come to Kill": async params => {
      throw new Error("TODO");
    },
    "Words of Power": async params => {
      throw new Error("TODO");
    }
  };
}
