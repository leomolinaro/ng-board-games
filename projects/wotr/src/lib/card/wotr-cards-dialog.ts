import {
  Component,
  computed,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import type { BgTransformFn } from '@leobg/commons/utils';
import { BgTransformPipe } from '@leobg/commons/utils';
import { injectDialogContext } from '../../../../commons/src';
import { WotrAssetsStore } from '../assets/wotr-assets-store';
import type { WotrCardSelection } from '../game/wotr-game-ui';
import type { WotrCardId } from './wotr-card-models';
import { WotrCardTooltipService } from './wotr-card-tooltip.service';

export interface WotrCardsDialogData {
  focusedCardId: WotrCardId | undefined;
  cardIds: WotrCardId[];
  selectableCards: WotrCardSelection | undefined;
}

@Component({
  selector: 'wotr-cards-dialog',
  imports: [BgTransformPipe],
  template: `
    <div class="cards-container">
      @for (cardId of cardIds; track cardId) {
        <!-- [tuiHint]="cardTooltip.hint(cardId)"
          [tuiHintAppearance]="cardTooltip.appearance" -->
        <img
          class="card"
          [src]="cardId | bgTransform: cardImage"
          [class]="{
            focused: cardId === focusedCardId,
            selected: data.selectableCards && selectedCards().includes(cardId),
            disabled: cardId | bgTransform: isDisabled,
          }"
          (mouseenter)="cardTooltip.preload(cardId)"
          (click)="onCardClick(cardId)"
        />
      }
    </div>
    <div class="toolbar">
      @if (data.selectableCards) {
        <button
          class="confirm-button"
          [disabled]="!canConfirm()"
          (click)="onConfirm()"
        >
          {{ data.selectableCards.message }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      @use 'wotr-variables' as wotr;

      ::ng-deep {
        [data-appearance='wotr-cards-dialog'] {
          width: 100%;
          background-color: transparent;
          overflow: visible;
        }
      }

      .cards-container {
        overflow: visible;
        padding-right: 250px;
        overflow-x: auto;
        padding-top: 20px;
        margin-top: -20px;
        height: 100%;
        display: flex;
        flex-direction: row-reverse;
        justify-content: center;
        align-items: center;
      }

      .card {
        display: flex;
        height: 352px;
        width: 192px;
        background-color: #17141d;
        border-radius: 10px;
        // box-shadow: 1rem 0 3rem #000;
        box-shadow: 1rem 2rem 3rem #000;
        transition: 0.4s ease-out;
        position: relative;
        right: 0px;
      }

      .card:not(:last-child) {
        margin-left: -50px;
      }

      .card:hover,
      .card.focused,
      .card.selected {
        transform: translateY(-20px);
        transition: 0.4s ease-out;
        & ~ .card {
          position: relative;
          right: 50px;
          transition: 0.4s ease-out;
        }
      }
      .card.selected {
        border: 2px solid #ffffff;
      }
      .card.disabled {
        opacity: 0.7;
        pointer-events: none;
      }
      .toolbar {
        @include wotr.golden-padding(1vmin);
        display: flex;
        justify-content: end;
      }
      .confirm-button {
        @include wotr.button;
      }
    `,
  ],
})
export class WotrCardsDialog {
  readonly context = injectDialogContext<WotrCardsDialogData, WotrCardId[]>();
  protected data = this.context.data;
  private assets = inject(WotrAssetsStore);
  protected cardTooltip = inject(WotrCardTooltipService);

  constructor() {
    this.cardIds = [...this.data.cardIds];
    this.cardIds.sort((a, b) => a.localeCompare(b));
    this.cardIds.reverse();
  }

  protected cardIds: WotrCardId[];
  protected focusedCardId: WotrCardId | undefined = this.data.focusedCardId;
  protected cardImage: BgTransformFn<WotrCardId, string> = (cardId) =>
    this.assets.cardImage(cardId);

  protected selectedCards = signal<WotrCardId[]>([]);

  isDisabled: BgTransformFn<WotrCardId, boolean> = (cardId) => {
    if (!this.data.selectableCards) return false;
    if (!this.data.selectableCards.cards) return false;
    return !this.data.selectableCards.cards.includes(cardId);
  };

  protected canConfirm = computed(() => {
    return this.data.selectableCards?.nCards === this.selectedCards().length;
  });

  onConfirm(): void {
    if (!this.canConfirm()) return;
    this.context.complete(this.selectedCards());
  }

  @HostListener('mouseover')
  onMouseHover(): void {
    this.focusedCardId = undefined;
  }

  onCardClick(cardId: WotrCardId): void {
    if (this.data.selectableCards) {
      if (this.selectedCards().includes(cardId)) {
        this.selectedCards.update((cards) => cards.filter((c) => c !== cardId));
      } else {
        if (this.data.selectableCards.nCards === 1) {
          this.selectedCards.set([cardId]);
        } else {
          this.selectedCards.update((cards) => [...cards, cardId]);
        }
      }
    }
  }
}
