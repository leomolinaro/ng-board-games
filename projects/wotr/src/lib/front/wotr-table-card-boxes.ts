import type { Signal } from '@angular/core';
import { Component, computed, inject, input } from '@angular/core';
import { BgDialogService } from '@leobg/commons';
import { WotrAssetsStore } from '../assets/wotr-assets-store';
import type { WotrCardId } from '../card/wotr-card-models';
import { isFreePeoplesCard } from '../card/wotr-card-models';
import type { WotrCardsDialogData } from '../card/wotr-cards-dialog';
import { WotrCardsDialog } from '../card/wotr-cards-dialog';
import type { WotrFront } from './wotr-front-models';

interface WotrTableCardNode {
  id: WotrCardId;
  image: string;
  svgX: number;
  svgY: number;
}

const X0 = 164;
const Y0 = 407;
const YSTEP = 47;

@Component({
  selector: '[wotrTableCards]',
  imports: [],
  template: `
    @for (tableCardNode of tableCardNodes(); track tableCardNode.id) {
      <svg:image
        class="card-counters"
        transform="scale(0.8, 0.8)"
        [attr.x]="tableCardNode.svgX"
        [attr.y]="tableCardNode.svgY"
        [attr.xlink:href]="tableCardNode.image"
        (click)="openCardsDialog(tableCardNode.id)"
      ></svg:image>
    }
  `,
  styles: [
    `
      .card-counters {
        fill: white;
      }
    `,
  ],
})
export class WotrTableCardsComponent {
  private readonly dialogs = inject(BgDialogService);

  freePeoples = input.required<WotrFront>();
  shadow = input.required<WotrFront>();

  private assets = inject(WotrAssetsStore);

  tableCardNodes: Signal<WotrTableCardNode[]> = computed(() => {
    const nodes: WotrTableCardNode[] = [];
    let index = 0;
    for (const c of this.freePeoples().tableCards) {
      nodes.push(this.cardToNode(c, index));
      index++;
    }
    for (const c of this.shadow().tableCards) {
      nodes.push(this.cardToNode(c, index));
      index++;
    }
    return nodes;
  });

  private cardToNode(card: WotrCardId, index: number): WotrTableCardNode {
    return {
      id: card,
      image: this.assets.cardPreviewImage(card),
      svgX: X0,
      svgY: Y0 + index * YSTEP,
    };
  }

  protected openCardsDialog(cardId: WotrCardId): void {
    const isFreePeoples = isFreePeoplesCard(cardId);
    void this.dialogs.open<WotrCardsDialogData, WotrCardId[]>(WotrCardsDialog, {
      data: {
        focusedCardId: cardId,
        cardIds: isFreePeoples
          ? this.freePeoples().tableCards
          : this.shadow().tableCards,
        selectableCards: null,
      },
      size: 'l',
      closable: false,
      appearance: 'wotr-cards-dialog',
    });
  }
}
