import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostListener, inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BgTransformFn, BgTransformPipe } from "@leobg/commons/utils";
import { WotrAssetsService } from "../assets/wotr-assets.service";
import { WotrCardId } from "./wotr-card.models";

export interface WotrCardsDialogData {
  selectedCardId: WotrCardId;
  cardIds: WotrCardId[];
}

@Component ({
  selector: "wotr-cards-dialog",
  standalone: true,
  imports: [BgTransformPipe, NgClass],
  template: `
    @for (cardId of cardIds; track cardId) {
      <img class="card"
        [src]="cardId | bgTransform:cardImage"
        [ngClass]="{ selected: cardId === selectedCardId }">
    }
  `,
  styles: [`
    :host {
      width: 100%;
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
      box-shadow: 1rem 0 3rem #000;
      transition: 0.4s ease-out;
      position: relative;
      right: 0px;
    }

    .card:not(:last-child) {
        margin-left: -50px;
    }

    .card:hover, .card.selected {
      transform: translateY(-20px);
      transition: 0.4s ease-out;
    }

    .card:hover, .card.selected {
      & ~ .card {
        position: relative;
        right: 50px;
        transition: 0.4s ease-out;
      }
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WotrCardsDialogComponent {
  
  private data = inject<WotrCardsDialogData> (MAT_DIALOG_DATA);
  private assets = inject (WotrAssetsService);

  protected cardIds = this.data.cardIds.slice ().reverse ();
  protected selectedCardId: WotrCardId | null = this.data.selectedCardId;
  protected cardImage: BgTransformFn<WotrCardId, string> = cardId => this.assets.getCardImage (cardId);

  @HostListener ("mouseover", ["$event"])
  onMouseHover (event: MouseEvent) {
    this.selectedCardId = null;
  }

}
