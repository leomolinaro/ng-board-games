import { inject, Injectable } from "@angular/core";
import { unexpectedStory } from "../../../../../commons/src";
import { WotrAbility, WotrUiAbility } from "../../ability/wotr-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFrontId } from "../../front/wotr-front-models";
import { WotrGameStore } from "../../game/wotr-game-store";
import { WotrStory } from "../../game/wotr-story-models";
import { WotrPlayer } from "../../player/wotr-player";
import {
  isFreePeopleCharacterCard,
  isFreePeopleStrategyCard,
  isShadowCharacterCard,
  WotrCardId
} from "../wotr-card-models";
import { WotrFreePeoplesCharacterCards } from "./wotr-free-peoples-character-cards";
import { WotrFreePeoplesStrategyCards } from "./wotr-free-peoples-strategy-cards";
import { WotrShadowCharacterCards } from "./wotr-shadow-character-cards";
import { WotrShadowStrategyCards } from "./wotr-shadow-strategy-cards";

export interface WotrEventCard {
  canBePlayed?: () => boolean;
  play: () => Promise<WotrAction[]>;
  effect?: (params: WotrCardParams) => Promise<void>;
  onTableAbilities?: () => WotrAbility[];
}

export interface WotrCardParams {
  front: WotrFrontId;
  story: WotrStory & { actions: WotrAction[] };
  // shadow: WotrCombatFront;
  // freePeoples: WotrCombatFront;
  // combatRound: WotrCombatRound;
  cardId: WotrCardId;
  // isAttacker: boolean;
}

@Injectable({ providedIn: "root" })
export class WotrCards {
  private cards: Partial<Record<WotrCardId, WotrEventCard>> = {};
  private abilities: Partial<Record<WotrCardId, WotrAbility[]>> = {};

  private freePeopleCharacterCards = inject(WotrFreePeoplesCharacterCards);
  private freePeopleStrategyCards = inject(WotrFreePeoplesStrategyCards);
  private shadowCharacterCards = inject(WotrShadowCharacterCards);
  private shadowStrategyCards = inject(WotrShadowStrategyCards);
  private gameStore = inject(WotrGameStore);

  getCard(cardId: WotrCardId): WotrEventCard {
    if (!this.cards[cardId]) {
      this.cards[cardId] = this.createCard(cardId);
    }
    return this.cards[cardId];
  }

  activateAbilities(card: WotrCardId) {
    if (this.gameStore.isTemporaryState()) return;
    const abilities = this.getAbilities(card);
    for (const ability of abilities) {
      if (!ability.modifier) console.error("Modifier is not defined for this ability", this);
      ability.modifier.register(ability.handler);
    }
  }

  deactivateAbilities(cardId: WotrCardId) {
    if (this.gameStore.isTemporaryState()) return;
    const abilities = this.getAbilities(cardId);
    for (const ability of abilities) {
      ability.modifier.unregister(ability.handler);
    }
  }

  private getAbilities(cardId: WotrCardId): WotrAbility[] {
    if (!this.abilities[cardId]) {
      const abilities = this.createAbilities(cardId);
      this.abilities[cardId] = abilities;
    }
    return this.abilities[cardId];
  }

  private createAbilities(cardId: WotrCardId): WotrAbility[] {
    const card = this.getCard(cardId);
    if (!card.onTableAbilities) throw new Error(`Card ${cardId} has no on-table abilities`);
    const abilities = card.onTableAbilities();
    return abilities;
  }

  private createCard(cardId: WotrCardId): WotrEventCard {
    if (isFreePeopleCharacterCard(cardId)) {
      return this.freePeopleCharacterCards.createCard(cardId);
    } else if (isFreePeopleStrategyCard(cardId)) {
      return this.freePeopleStrategyCards.createCard(cardId);
    } else if (isShadowCharacterCard(cardId)) {
      return this.shadowCharacterCards.createCard(cardId);
    } else {
      return this.shadowStrategyCards.createCard(cardId);
    }
  }
}

export async function activateTableCard(
  ability: WotrUiAbility,
  cardId: WotrCardId,
  player: WotrPlayer
): Promise<false | WotrAction[]> {
  const story = await player.activateTableCard(ability, cardId);
  switch (story.type) {
    case "card-effect":
      return story.actions;
    case "card-effect-skip":
      return false;
    default:
      throw unexpectedStory(story, "card activation or not");
  }
}
