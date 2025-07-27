import { Injectable, inject } from "@angular/core";
import { objectUtil } from "@leobg/commons/utils";
import { WotrCombatRoll } from "../battle/wotr-battle-actions";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrGameStory, assertAction } from "../game/wotr-story-models";
import { WotrHuntTileDraw } from "../hunt/wotr-hunt-actions";
import { WotrHuntFlow } from "../hunt/wotr-hunt-flow";
import { WotrHuntStore } from "../hunt/wotr-hunt-store";
import { WotrFreePeoplesPlayer } from "../player/wotr-free-peoples-player";
import { WotrPlayer } from "../player/wotr-player";
import { WotrShadowPlayer } from "../player/wotr-shadow-player";
import { WotrRegionChoose } from "../region/wotr-region-actions";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import { WotrCardHandler } from "./wotr-card-handler";
import { WotrCardId, WotrCardLabel, labelToCardId } from "./wotr-card-models";

export interface WotrCardParams {
  front: WotrFrontId;
  story: WotrGameStory;
  // shadow: WotrCombatFront;
  // freePeoples: WotrCombatFront;
  // combatRound: WotrCombatRound;
  // card: WotrCard;
  // isAttacker: boolean;
}

@Injectable({ providedIn: "root" })
export class WotrCardEffectsService {
  private freePeoples = inject(WotrFreePeoplesPlayer);
  private shadow = inject(WotrShadowPlayer);
  private huntStore = inject(WotrHuntStore);
  private regionStore = inject(WotrRegionStore);
  private huntFlow = inject(WotrHuntFlow);
  private unitUtils = inject(WotrUnitUtils);

  private cardHandler = inject(WotrCardHandler);

  private async rollCombatDice(nDice: number, player: WotrPlayer): Promise<WotrCombatDie[]> {
    const story = await player.rollCombatDice(nDice);
    const action = assertAction<WotrCombatRoll>(story, "combat-roll");
    return action.dice;
  }

  private cardEffects: Partial<Record<WotrCardLabel, (params: WotrCardParams) => Promise<void>>> = {
    "Nazgul Search": async params => {
      const fellowshipRegionId = this.regionStore.fellowshipRegion();
      const fellowshipRegion = this.regionStore.region(fellowshipRegionId);
      if (
        (fellowshipRegion.army && this.unitUtils.hasNazgul(fellowshipRegion.army)) ||
        (fellowshipRegion.freeUnits && this.unitUtils.hasNazgul(fellowshipRegion.freeUnits))
      ) {
        await this.huntFlow.revealFellowship();
      }
    },
    "Dreadful Spells": async params => {
      assertAction<WotrRegionChoose>(params.story, "region-choose");
      await this.rollCombatDice(1, this.shadow); // TODO nDice
      await this.freePeoples.chooseCasualties(1); // TODO hitPoints
    },
    "Isildur's Bane": async params => {
      const action = assertAction<WotrHuntTileDraw>(params.story, "hunt-tile-draw");
      this.huntFlow.resolveHuntTile(action.tile, {
        ignoreEyeTile: true,
        ignoreFreePeopleSpecialTile: true
      });
    },
    "The Breaking of the Fellowship": async params => {
      const action = assertAction<WotrHuntTileDraw>(params.story, "hunt-tile-draw");
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
    const cardEffectsById: Partial<Record<WotrCardId, (params: WotrCardParams) => Promise<void>>> =
      {};
    objectUtil.forEachProp(this.cardEffects, (label, cardEffect) => {
      cardEffectsById[labelToCardId(label as WotrCardLabel)] = cardEffect;
    });
    this.cardHandler.registerCardEffects(cardEffectsById);
  }
}
