import type { Signal } from '@angular/core';
import { Injectable, computed } from '@angular/core';
import { immutableUtil } from '@leobg/commons/utils';
import type {
  WotrActionDie,
  WotrActionToken,
} from '../action-die/wotr-action-die-models';
import type {
  WotrCardId,
  WotrCharacterCardId,
  WotrStrategyCardId,
} from '../card/wotr-card-models';
import { isCharacterCard, isStrategyCard } from '../card/wotr-card-models';
import type {
  WotrElvenRing,
  WotrFront,
  WotrFrontId,
} from './wotr-front-models';

export interface WotrFrontState {
  ids: WotrFrontId[];
  map: Record<WotrFrontId, WotrFront>;
  currentCard: WotrCardId | undefined;
  skipDiscardExcessCards: boolean;
}

export function initialState(): WotrFrontState {
  return {
    ids: ['free-peoples', 'shadow'],
    map: {
      'free-peoples': initialFront('free-peoples', 'Free Peoples', [
        'vilya',
        'nenya',
        'narya',
      ]),
      shadow: initialFront('shadow', 'Shadow', []),
    },
    currentCard: undefined,
    skipDiscardExcessCards: false,
  };
}

function initialFront(
  id: WotrFrontId,
  name: string,
  elvenRings: WotrElvenRing[],
): WotrFront {
  return {
    id,
    name,
    characterDeck: [],
    strategyDeck: [],
    handCards: [],
    tableCards: [],
    characterDiscardPile: [],
    strategyDiscardPile: [],
    actionDice: [],
    currentActionDie: undefined,
    actionTokens: [],
    currentActionToken: undefined,
    elvenRings,
    elvenRingUsed: false,
    victoryPoints: 0,
  };
}

@Injectable()
export class WotrFrontStore {
  update!: (
    actionName: string,
    updater: (a: WotrFrontState) => WotrFrontState,
  ) => void;
  state!: Signal<WotrFrontState>;

  fronts = computed(() => {
    const s = this.state();
    return s.ids.map((id) => s.map[id]);
  });
  freePeoplesFront = computed(() => this.state().map['free-peoples']);
  shadowFront = computed(() => this.state().map.shadow);
  frontIds(): WotrFrontId[] {
    return this.state().ids;
  }

  front(id: WotrFrontId): WotrFront {
    return this.state().map[id];
  }

  shouldSkipDiscardExcessCards(): boolean {
    return this.state().skipDiscardExcessCards;
  }
  skipDiscardExcessCards(shouldSkip: boolean): void {
    this.update('skipDiscardExcessCards', (s) => ({
      ...s,
      skipDiscardExcessCards: shouldSkip,
    }));
  }

  currentCard(): WotrCardId | undefined {
    return this.state().currentCard;
  }

  setElvenRingUsed(frontId: WotrFrontId): void {
    this.updateFront('setElvenRingUsed', frontId, (front) => ({
      ...front,
      elvenRingUsed: true,
    }));
  }
  resetElvenRingUsed(frontId: WotrFrontId): void {
    this.updateFront('resetElvenRingUsed', frontId, (front) => ({
      ...front,
      elvenRingUsed: false,
    }));
  }

  private updateFront(
    actionName: string,
    frontId: WotrFrontId,
    updater: (a: WotrFront) => WotrFront,
  ): void {
    this.update(actionName, (s) => ({
      ...s,
      map: { ...s.map, [frontId]: updater(s.map[frontId]) },
    }));
  }

  clearCurrentCard(): void {
    this.update('clearCurrentCard', (s) => ({ ...s, currentCard: undefined }));
  }

  setCurrentCard(currentCard: WotrCardId): void {
    this.update('setCurrentCard', (s) => ({ ...s, currentCard }));
  }

  setCharacterDeck(
    characterDeck: WotrCharacterCardId[],
    frontId: WotrFrontId,
  ): void {
    this.updateFront('setCharacterDeck', frontId, (front) => ({
      ...front,
      characterDeck,
    }));
  }

  setStrategyDeck(
    strategyDeck: WotrStrategyCardId[],
    frontId: WotrFrontId,
  ): void {
    this.updateFront('setStrategyDeck', frontId, (front) => ({
      ...front,
      strategyDeck,
    }));
  }

  discardCards(cardIds: WotrCardId[], frontId: WotrFrontId): void {
    this.updateFront('discardCards', frontId, (front) => {
      let characterDiscardPile = front.characterDiscardPile;
      let strategyDiscardPile = front.strategyDiscardPile;
      let handCards = front.handCards;
      for (const cardId of cardIds) {
        if (!handCards.includes(cardId)) continue;
        handCards = immutableUtil.listRemoveFirst(
          (c) => c === cardId,
          handCards,
        );
        if (isCharacterCard(cardId)) {
          characterDiscardPile = immutableUtil.listPush(
            [cardId],
            characterDiscardPile,
          );
        }
        if (isStrategyCard(cardId)) {
          strategyDiscardPile = immutableUtil.listPush(
            [cardId],
            strategyDiscardPile,
          );
        }
      }
      return {
        ...front,
        handCards,
        characterDiscardPile,
        strategyDiscardPile,
      };
    });
  }

  drawCards(cardIds: WotrCardId[], frontId: WotrFrontId): void {
    this.updateFront('drawCards', frontId, (front) => {
      let characterDeck = front.characterDeck;
      let strategyDeck = front.strategyDeck;
      for (const cardId of cardIds) {
        if (isCharacterCard(cardId)) {
          characterDeck = immutableUtil.listRemoveFirst(
            (c) => c === cardId,
            characterDeck,
          );
        } else if (isStrategyCard(cardId)) {
          strategyDeck = immutableUtil.listRemoveFirst(
            (c) => c === cardId,
            strategyDeck,
          );
        }
      }
      return {
        ...front,
        characterDeck,
        strategyDeck,
        handCards: immutableUtil.listPush(cardIds, front.handCards),
      };
    });
  }

  setActionTokens(tokens: WotrActionToken[], frontId: WotrFrontId): void {
    this.updateFront('setActionTokens', frontId, (front) => ({
      ...front,
      actionTokens: tokens,
    }));
  }

  setActionDice(dice: WotrActionDie[], frontId: WotrFrontId): void {
    this.updateFront('setActionDice', frontId, (front) => ({
      ...front,
      actionDice: dice,
    }));
  }

  setCurrentActionDie(die: WotrActionDie, frontId: WotrFrontId): void {
    this.updateFront('setCurrentActionDie', frontId, (front) => ({
      ...front,
      currentActionDie: die,
    }));
  }

  removeCurrentActionDie(frontId: WotrFrontId): void {
    this.updateFront('removeCurrentActionDie', frontId, (front) => ({
      ...front,
      currentActionDie: undefined,
    }));
  }

  removeActionDie(die: WotrActionDie, frontId: WotrFrontId): void {
    this.updateFront('removeActionDie', frontId, (front) => {
      return typeof die === 'string'
        ? {
            ...front,
            actionDice: immutableUtil.listRemoveFirst(
              (d) => d === die,
              front.actionDice,
            ),
          }
        : {
            ...front,
            actionDice: immutableUtil.listRemoveFirst(
              (d) =>
                typeof d !== 'string' &&
                d.type === die.type &&
                d.result === die.result,
              front.actionDice,
            ),
          };
    });
  }

  addActionDie(die: WotrActionDie, frontId: WotrFrontId): void {
    this.updateFront('addActionDie', frontId, (front) => ({
      ...front,
      actionDice: immutableUtil.listPush([die], front.actionDice),
    }));
  }

  removeElvenRing(ring: WotrElvenRing, frontId: WotrFrontId): void {
    this.updateFront('removeElvenRing', frontId, (front) => ({
      ...front,
      elvenRings: immutableUtil.listRemoveFirst(
        (r) => r === ring,
        front.elvenRings,
      ),
    }));
  }

  addElvenRing(ring: WotrElvenRing, frontId: WotrFrontId): void {
    this.updateFront('addElvenRing', frontId, (front) => ({
      ...front,
      elvenRings: immutableUtil.listPush([ring], front.elvenRings),
    }));
  }

  removeAllEyeResults(frontId: WotrFrontId): void {
    this.updateFront('removeAllEyeResults', frontId, (front) => ({
      ...front,
      actionDice: immutableUtil.listRemoveAll(
        (d) => d === 'eye',
        front.actionDice,
      ),
    }));
  }

  changeActionDie(
    die: WotrActionDie,
    toDie: WotrActionDie,
    frontId: WotrFrontId,
  ): void {
    this.updateFront('changeActionDie', frontId, (front) => ({
      ...front,
      actionDice: immutableUtil.listReplaceFirst(
        (d) => d === die,
        toDie,
        front.actionDice,
      ),
    }));
  }

  setCurrentActionToken(token: WotrActionToken, frontId: WotrFrontId): void {
    this.updateFront('setCurrentActionToken', frontId, (front) => ({
      ...front,
      currentActionToken: token,
    }));
  }

  removeCurrentActionToken(frontId: WotrFrontId): void {
    this.updateFront('removeCurrentActionToken', frontId, (front) => ({
      ...front,
      currentActionToken: undefined,
    }));
  }

  removeActionToken(token: WotrActionToken, frontId: WotrFrontId): void {
    this.updateFront('removeActionToken', frontId, (front) => ({
      ...front,
      actionTokens: immutableUtil.listRemoveFirst(
        (t) => t === token,
        front.actionTokens,
      ),
    }));
  }

  playCardOnTable(card: WotrCardId, frontId: WotrFrontId): void {
    this.updateFront('playCardOnTable', frontId, (front) => ({
      ...front,
      tableCards: immutableUtil.listPush([card], front.tableCards),
      // handCards: immutableUtil.listRemoveFirst(c => c === card, front.handCards)
    }));
  }

  discardCardFromTable(card: WotrCardId, frontId: WotrFrontId): void {
    this.updateFront('discardCardFromTable', frontId, (front) => ({
      ...front,
      tableCards: immutableUtil.listRemoveFirst(
        (c) => c === card,
        front.tableCards,
      ),
    }));
  }

  setVictoryPoints(victoryPoints: number, front: WotrFrontId): void {
    this.updateFront('setVictoryPoints', front, (f) => ({
      ...f,
      victoryPoints,
    }));
  }
}
