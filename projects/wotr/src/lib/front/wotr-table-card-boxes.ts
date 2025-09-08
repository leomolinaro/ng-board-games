import { ChangeDetectionStrategy, Component, computed, inject, input, Signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { isFreePeoplesCard, WotrCardId } from "../card/wotr-card-models";
import { WotrCardsDialog, WotrCardsDialogData } from "../card/wotr-cards-dialog";
import { WotrFront } from "./wotr-front-models";

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
  selector: "[wotrTableCards]",
  imports: [],
  template: `
    @for (tableCardNode of tableCardNodes(); track tableCardNode.id) {
      <svg:image
        class="card-counters"
        transform="scale(0.8, 0.8)"
        [attr.x]="tableCardNode.svgX"
        [attr.y]="tableCardNode.svgY"
        [attr.xlink:href]="tableCardNode.image"
        (click)="openCardsDialog(tableCardNode.id)"></svg:image>
    }
  `,
  styles: [
    `
      .card-counters {
        fill: white;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrTableCardsComponent {
  private dialog = inject(MatDialog);

  freePeoples = input.required<WotrFront>();
  shadow = input.required<WotrFront>();

  private assets = inject(WotrAssetsStore);

  tableCardNodes: Signal<WotrTableCardNode[]> = computed(() => {
    const nodes: WotrTableCardNode[] = [];
    let index = 0;
    this.freePeoples().tableCards.forEach(c => {
      nodes.push(this.cardToNode(c, index));
      index++;
    });
    this.shadow().tableCards.forEach(c => {
      nodes.push(this.cardToNode(c, index));
      index++;
    });
    return nodes;
  });

  private cardToNode(card: WotrCardId, index: number): WotrTableCardNode {
    return {
      id: card,
      image: this.assets.cardPreviewImage(card),
      svgX: X0,
      svgY: Y0 + index * YSTEP
    };
  }

  protected openCardsDialog(cardId: WotrCardId) {
    const isFreePeoples = isFreePeoplesCard(cardId);
    const cardsDialogRef = this.dialog.open<
      WotrCardsDialog,
      WotrCardsDialogData,
      undefined | WotrCardId[]
    >(WotrCardsDialog, {
      data: {
        focusedCardId: cardId,
        cardIds: isFreePeoples ? this.freePeoples().tableCards : this.shadow().tableCards,
        selectableCards: null
      },
      panelClass: "wotr-cards-overlay-panel",
      width: "100%",
      maxWidth: "100%"
    });
  }
}
