import { Injectable, inject } from "@angular/core";
import { objectUtil } from "@leobg/commons/utils";
import { WotrCombatRoll } from "../battle/wotr-battle-actions";
import { WotrCombatDie } from "../battle/wotr-combat-die.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrGameStory, findAction } from "../game/wotr-story.models";
import { WotrHuntTileDraw } from "../hunt/wotr-hunt-actions";
import { WotrHuntFlowService } from "../hunt/wotr-hunt-flow.service";
import { WotrHuntStore } from "../hunt/wotr-hunt.store";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionChoose } from "../region/wotr-region-actions";
import { WotrRegionStore } from "../region/wotr-region.store";
import { WotrArmyUtils } from "../unit/wotr-army.utils";
import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-card.models";
import { WotrCardService } from "./wotr-card.service";

export interface WotrCardParams {
  front: WotrFrontId;
  story: WotrGameStory;
  // shadow: WotrCombatFront;
  // freePeoples: WotrCombatFront;
  // combatRound: WotrCombatRound;
  // card: WotrCard;
  // isAttacker: boolean;
}

@Injectable()
export class WotrCardEffectsService {
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private huntStore = inject(WotrHuntStore);
  private regionStore = inject(WotrRegionStore);
  private huntFlow = inject(WotrHuntFlowService);
  private armyUtil = inject(WotrArmyUtils);

  private cardService = inject(WotrCardService);

  private async rollCombatDice(player: WotrPlayer): Promise<WotrCombatDie[]> {
    const story = await player.rollCombatDice();
    const action = findAction<WotrCombatRoll>(story, "combat-roll");
    return action.dice;
  }

  private cardEffects: Partial<Record<WotrCardLabel, (params: WotrCardParams) => Promise<void>>> = {
    "Nazgul Search": async params => {
      const fellowshipRegionId = this.regionStore.fellowshipRegion();
      const fellowshipRegion = this.regionStore.region(fellowshipRegionId);
      if (
        (fellowshipRegion.army && this.armyUtil.hasNazgul(fellowshipRegion.army)) ||
        (fellowshipRegion.freeUnits && this.armyUtil.hasNazgul(fellowshipRegion.freeUnits))
      ) {
        await this.huntFlow.revealFellowship();
      }
    },
    "Dreadful Spells": async params => {
      findAction<WotrRegionChoose>(params.story, "region-choose");
      await this.rollCombatDice(this.shadow);
      await this.freePeoples.chooseCasualties();
    },
    "Isildur's Bane": async params => {
      const action = findAction<WotrHuntTileDraw>(params.story, "hunt-tile-draw");
      this.huntFlow.resolveHuntTile(action.tile, {
        ignoreEyeTile: true,
        ignoreFreePeopleSpecialTile: true
      });
    },
    "The Breaking of the Fellowship": async params => {
      const action = findAction<WotrHuntTileDraw>(params.story, "hunt-tile-draw");
      const huntTile = this.huntStore.huntTile(action.tile);
      if (huntTile.eye || huntTile.type === "free-people-special") {
        return;
      }
      const damage = huntTile.quantity!; // TODO shelob die
      if (damage) {
        await this.huntFlow.separateCompanions(this.freePeoples);
      }
    }
  };

  registerCardEffects() {
    const cardEffectsById: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>> = {};
    objectUtil.forEachProp(this.cardEffects, (label, cardEffect) => {
      cardEffectsById[labelToCardId(label as WotrCardLabel)] = cardEffect;
    });
    this.cardService.registerCardEffects(cardEffectsById);
  }
}
