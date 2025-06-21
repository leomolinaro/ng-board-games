import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  inject,
  signal
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrValidCards } from "../game/wotr-game-ui.store";
import { WotrCardId } from "./wotr-card.models";

export interface WotrCardsDialogData {
  focusedCardId: WotrCardId | null;
  cardIds: WotrCardId[];
  selectableCards: WotrValidCards | null;
}

@Component({
  selector: "wotr-cards-dialog",
  imports: [BgTransformPipe, NgClass],
  template: `
    <div class="cards-container">
      @for (cardId of cardIds; track cardId) {
        <img
          class="card"
          [src]="cardId | bgTransform: cardImage"
          [ngClass]="{
            focused: cardId === focusedCardId,
            selected: data.selectableCards && selectedCards().includes(cardId)
          }"
          (click)="onCardClick(cardId)" />
      }
    </div>
    <div class="toolbar">
      @if (data.selectableCards) {
        <button
          class="confirm-button"
          [disabled]="!canConfirm()"
          (click)="onConfirm()">
          {{ data.selectableCards.message }}
        </button>
      }
    </div>
  `,
  styles: [
    `
      @use "wotr-variables" as wotr;
      .cards-container {
        // margin-left: 350px;
        // width: calc(100% - 350px);
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
      .toolbar {
        @include wotr.golden-padding(1vmin);
        display: flex;
        justify-content: end;
      }
      .confirm-button {
        @include wotr.button;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrCardsDialogComponent {
  protected data = inject<WotrCardsDialogData>(MAT_DIALOG_DATA);
  private assets = inject(WotrAssetsService);
  private dialogRef = inject(MatDialogRef<WotrCardsDialogComponent, undefined | WotrCardId[]>);

  protected cardIds = this.data.cardIds.slice().reverse();
  protected focusedCardId: WotrCardId | null = this.data.focusedCardId;
  protected cardImage: BgTransformFn<WotrCardId, string> = cardId =>
    this.assets.getCardImage(cardId);

  protected selectedCards = signal<WotrCardId[]>([]);

  protected canConfirm = computed(() => {
    return this.data.selectableCards?.nCards === this.selectedCards().length;
  });

  onConfirm() {
    if (!this.canConfirm()) return;
    this.dialogRef.close(this.selectedCards());
  }

  @HostListener("mouseover", ["$event"])
  onMouseHover(event: MouseEvent) {
    this.focusedCardId = null;
  }

  onCardClick(cardId: WotrCardId) {
    if (this.data.selectableCards) {
      if (this.selectedCards().includes(cardId)) {
        this.selectedCards.update(cards => cards.filter(c => c !== cardId));
      } else {
        this.selectedCards.update(cards => [...cards, cardId]);
      }
    }
  }
}
