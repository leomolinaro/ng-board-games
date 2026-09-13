import {
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type { BgTransformFn } from '@leobg/commons/utils';
import { arrayUtil, BgTransformPipe } from '@leobg/commons/utils';
import { TuiButton, tuiButtonOptionsProvider, TuiHint } from '@taiga-ui/core';
import { WotrAssetsStore } from '../assets/wotr-assets-store';
import type { WotrCardId } from '../card/wotr-card-models';
import { WotrCardTooltipService } from '../card/wotr-card-tooltip.service';
import type {
  WotrCharacter,
  WotrCharacterId,
} from '../character/wotr-character-models';
import { WotrGameUi } from '../game/wotr-game-ui';
import type {
  WotrArmyUnitType,
  WotrGenericUnitType,
  WotrNation,
  WotrNationId,
} from '../nation/wotr-nation-models';
import type { WotrFront } from './wotr-front-models';

interface ValidUnits {
  regulars: boolean;
  elites: boolean;
  leaders: boolean;
  nazgul: boolean;
}

function initValidUnits(): ValidUnits {
  return {
    regulars: false,
    elites: false,
    leaders: false,
    nazgul: false,
  };
}

@Component({
  selector: 'wotr-front-area',
  imports: [BgTransformPipe, TuiButton, TuiHint],
  providers: [tuiButtonOptionsProvider({ appearance: 'flat', size: 'xs' })],
  template: `
    <header>
      <button
        tuiButton
        [class.is-active]="activeTabId === 'cards'"
        (click)="activeTabId = 'cards'"
      >
        Cards
      </button>
      <button
        tuiButton
        [class.is-active]="activeTabId === 'reinforcements'"
        (click)="activeTabId = 'reinforcements'"
      >
        Reinforcements
      </button>
      <button
        tuiButton
        [class.is-active]="activeTabId === 'casualties'"
        (click)="activeTabId = 'casualties'"
      >
        Casualties
      </button>
    </header>
    <main>
      @switch (activeTabId) {
        @case ('cards') {
          <div class="cards">
            @for (card of sortedHandCards(); track card) {
              <img
                class="card-preview-image"
                [src]="card | bgTransform: cardPreviewImage"
                [tuiHint]="cardTooltip.hint(card)"
                [tuiHintAppearance]="cardTooltip.appearance"
                (mouseenter)="cardTooltip.preload(card)"
                (click)="cardClick.emit(card)"
              />
            }
          </div>
        }
        @case ('reinforcements') {
          <div class="reinforcements">
            @for (nation of nations(); track nation.id) {
              @let validUnits = reinforcementUnitSelection()?.[nation.id];
              @for (
                i of nation.reinforcements.regular | bgTransform: range;
                track i
              ) {
                <img
                  class="reinforcement-unit"
                  [class]="{
                    disabled: validUnits && !validUnits.regulars,
                    selectable: validUnits && validUnits.regulars,
                  }"
                  [src]="nation.id | bgTransform: armyUnitImage : 'regular'"
                  [tuiHint]="nation.regularLabel"
                  (click)="onReinforcementUnitSelect('regular', nation.id)"
                />
              }
              @for (
                i of nation.reinforcements.elite | bgTransform: range;
                track i
              ) {
                <img
                  class="reinforcement-unit"
                  [class]="{
                    disabled: validUnits && !validUnits.elites,
                    selectable: validUnits && validUnits.elites,
                  }"
                  [src]="nation.id | bgTransform: armyUnitImage : 'elite'"
                  [tuiHint]="nation.eliteLabel"
                  (click)="onReinforcementUnitSelect('elite', nation.id)"
                />
              }
              @for (
                i of nation.reinforcements.leader | bgTransform: range;
                track i
              ) {
                <img
                  class="reinforcement-unit"
                  [class]="{
                    disabled: validUnits && !validUnits.leaders,
                    selectable: validUnits && validUnits.leaders,
                  }"
                  [src]="nation.id | bgTransform: leaderImage"
                  [tuiHint]="nation.leaderLabel"
                  (click)="onReinforcementUnitSelect('leader', nation.id)"
                />
              }
              @for (
                i of nation.reinforcements.nazgul | bgTransform: range;
                track i
              ) {
                <img
                  class="reinforcement-unit"
                  [class]="{
                    disabled: validUnits && !validUnits.nazgul,
                    selectable: validUnits && validUnits.nazgul,
                  }"
                  [src]="nation.id | bgTransform: nazgulImage"
                  tuiHint="Nazgul"
                  (click)="onReinforcementUnitSelect('nazgul', nation.id)"
                />
              }
            }
            @for (character of frontCharacters(); track character.id) {
              @if (character.status === 'available') {
                <img
                  [src]="character.id | bgTransform: characterImage"
                  [tuiHint]="character.name"
                />
              }
            }
          </div>
        }
        @case ('casualties') {
          <div class="casualties">
            @for (nation of nations(); track nation.id) {
              @for (
                i of nation.casualties.regular | bgTransform: range;
                track i
              ) {
                <img
                  [src]="nation.id | bgTransform: armyUnitImage : 'regular'"
                  [tuiHint]="nation.regularLabel"
                />
              }
              @for (
                i of nation.casualties.elite | bgTransform: range;
                track i
              ) {
                <img
                  [src]="nation.id | bgTransform: armyUnitImage : 'elite'"
                  [tuiHint]="nation.eliteLabel"
                />
              }
              @for (
                i of nation.casualties.leader | bgTransform: range;
                track i
              ) {
                <img
                  [src]="nation.id | bgTransform: leaderImage"
                  [tuiHint]="nation.leaderLabel"
                />
              }
            }
            @for (character of frontCharacters(); track character.id) {
              @if (character.status === 'eliminated') {
                <img
                  [src]="character.id | bgTransform: characterImage"
                  [tuiHint]="character.name"
                />
              }
            }
          </div>
        }
      }
    </main>
  `,
  styles: [
    `
      $color: var(--wotr-front-color);

      :host {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
      }
      header {
        display: flex;
        background-color: transparent;

        button {
          flex: 1;
          border-radius: 0;
          &.is-active {
            color: $color;
          }
        }
      }
      main {
        overflow: auto;
        flex: 1;
      }
      .cards {
        margin-top: 5px;
        .card-preview-image {
          cursor: pointer;
          &:not(:last-child) {
            margin-right: 5px;
          }
        }
      }

      .reinforcement-unit {
        &.selectable {
          cursor: pointer;
        }
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    `,
  ],
})
export class WotrFrontArea {
  protected assets = inject(WotrAssetsStore);
  protected cardTooltip = inject(WotrCardTooltipService);
  protected ui = inject(WotrGameUi);

  protected activeTabId = 'cards';

  front = input.required<WotrFront>();
  nations = input.required<WotrNation[]>();
  characters = input<WotrCharacter[]>();
  frontCharacters = computed(() => {
    const front = this.front();
    return this.characters()?.filter((c) => c.front === front.id);
  });

  cardClick = output<WotrCardId>();

  private handCards = computed(() => this.front().handCards);
  protected sortedHandCards = computed(() => {
    const cards = [...this.handCards()];
    cards.sort((a, b) => a.localeCompare(b));
    return cards;
  });

  protected cardPreviewImage: BgTransformFn<WotrCardId, string> = (cardId) =>
    this.assets.cardPreviewImage(cardId);
  protected armyUnitImage: BgTransformFn<
    WotrNationId,
    string,
    WotrArmyUnitType
  > = (nationId, type) => this.assets.armyUnitImage(type, nationId).source;
  protected leaderImage: BgTransformFn<WotrNationId, string> = (nationId) =>
    this.assets.leaderImage(nationId).source;
  protected nazgulImage: BgTransformFn<void, string> = () =>
    this.assets.nazgulImage().source;
  protected characterImage: BgTransformFn<WotrCharacterId, string> = (
    characterId,
  ) => this.assets.frontCharacterImage(characterId).source;
  protected range: BgTransformFn<number, number[]> = (n) => arrayUtil.range(n);

  protected selectedTabIndex = signal<number>(0);
  private focusReinforcements = effect(() => {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    if (!reinforcementUnitSelection) return;
    if (reinforcementUnitSelection.frontId !== this.front().id) return;
    this.selectedTabIndex.set(1);
  });

  private focusCards = effect(() => {
    const cardSelection = this.ui.handCardSelection();
    if (!cardSelection) return;
    if (cardSelection.frontId !== this.front().id) return;
    this.selectedTabIndex.set(0);
  });

  protected reinforcementUnitSelection = computed<
    Record<WotrNationId, ValidUnits> | undefined
  >(() => {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    if (!reinforcementUnitSelection) return;
    const validUnitsByNation: Record<WotrNationId, ValidUnits> = {
      dwarves: initValidUnits(),
      elves: initValidUnits(),
      gondor: initValidUnits(),
      rohan: initValidUnits(),
      isengard: initValidUnits(),
      southrons: initValidUnits(),
      sauron: initValidUnits(),
      north: initValidUnits(),
    };
    for (const u of reinforcementUnitSelection.units) {
      const validUnits = validUnitsByNation[u.nation];
      switch (u.type) {
        case 'regular':
          validUnits.regulars = true;
          break;
        case 'elite':
          validUnits.elites = true;
          break;
        case 'leader':
          validUnits.leaders = true;
          break;
        case 'nazgul':
          validUnits.nazgul = true;
          break;
      }
    }
    return validUnitsByNation;
  });

  onReinforcementUnitSelect(
    type: WotrGenericUnitType,
    nationId: WotrNationId,
  ): void {
    const reinforcementUnitSelection = this.ui.reinforcementUnitSelection();
    if (!reinforcementUnitSelection) return;
    if (
      reinforcementUnitSelection.units.every(
        (u) => !(u.nation === nationId && u.type === type),
      )
    )
      return;
    this.ui.reinforcementUnit.emit({
      nation: nationId,
      type,
    });
  }
}
