import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrFront, WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrActionDie, WotrActionToken } from "./wotr-action-die-models";

interface FrontNode {
  id: WotrFrontId;
  front: WotrFront;
  actionDieNodes: ActionDieNode[];
  actionTokenNodes: ActionTokendNode[];
}

interface ActionDieNode {
  id: WotrActionDie;
  imageSource: string;
  selectable: boolean;
  disabled: boolean;
}

interface ActionTokendNode {
  id: WotrActionToken;
  imageSource: string;
  selectable: boolean;
  disabled: boolean;
}

@Component({
  selector: "wotr-action-dice-box",
  template: `
    @for (frontNode of frontNodes(); track frontNode.id) {
      <div class="wotr-action-dice">
        @for (actionDieNode of frontNode.actionDieNodes; track $index) {
          <img
            [src]="actionDieNode.imageSource"
            [class]="{
              selectable: actionDieNode.selectable,
              disabled: actionDieNode.disabled
            }"
            (click)="onActionDieClick(actionDieNode)" />
        }
        @for (actionTokenNode of frontNode.actionTokenNodes; track $index) {
          <img
            [src]="actionTokenNode.imageSource"
            [class]="{
              selectable: actionTokenNode.selectable,
              disabled: actionTokenNode.disabled
            }"
            (click)="onActionTokenClick(actionTokenNode)" />
        }
      </div>
    }
  `,
  styles: `
    .wotr-action-dice {
      display: flex;
      img.selectable {
        cursor: pointer;
      }
      img.disabled {
        opacity: 0.5;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrActionDiceBox {
  protected assets = inject(WotrAssetsStore);
  private ui = inject(WotrGameUi);
  private frontStore = inject(WotrFrontStore);

  protected fronts = this.frontStore.fronts;

  protected frontNodes = computed<FrontNode[]>(() => {
    const selection = this.ui.actionBoxSelection();
    return this.fronts().map<FrontNode>(front => ({
      id: front.id,
      front,
      // selectable: dieSelection === front.id,
      // disabled: !!dieSelection && dieSelection !== front.id,
      actionDieNodes: front.actionDice.map<ActionDieNode>(actionDie => {
        const actionNode: ActionDieNode = {
          id: actionDie,
          imageSource: this.assets.actionDieImage(actionDie, front.id),
          selectable: false,
          disabled: false
        };
        if (selection) {
          const selectable =
            typeof actionDie === "string"
              ? selection.frontId === front.id
              : selection.frontId === front.id && selection.specialDice.includes(actionDie.type);
          actionNode.selectable = selectable;
          actionNode.disabled = !!selection && !selectable;
        }
        return actionNode;
      }),
      actionTokenNodes: front.actionTokens.map<ActionTokendNode>(actionToken => {
        const actionTokenNode: ActionTokendNode = {
          id: actionToken,
          imageSource: this.assets.actionTokenImage(actionToken, front.id),
          selectable: false,
          disabled: false
        };
        if (selection) {
          const selectable =
            selection.frontId === front.id && selection.tokens.includes(actionToken);
          actionTokenNode.selectable = selectable;
          actionTokenNode.disabled = !!selection && !selectable;
        }
        return actionTokenNode;
      })
    }));
  });

  onActionDieClick(actionDieNode: ActionDieNode) {
    if (!actionDieNode.selectable) return;
    this.ui.actionDieChoice.emit(actionDieNode.id);
  }

  onActionTokenClick(actionTokenNode: ActionTokendNode) {
    if (!actionTokenNode.selectable) return;
    this.ui.actionTokenChoice.emit(actionTokenNode.id);
  }
}
