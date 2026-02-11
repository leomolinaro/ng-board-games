import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";
import { WotrAssetsStore } from "../assets/wotr-assets-store";
import { WotrFront, WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameUi } from "../game/wotr-game-ui";
import { WotrActionDie, WotrActionToken } from "./wotr-action-die-models";

interface FrontNode {
  id: WotrFrontId;
  front: WotrFront;
  selectable: boolean;
  disabled: boolean;
  actionDieNodes: ActionDieNode[];
  actionTokenNodes: ActionTokendNode[];
}

interface ActionDieNode {
  id: WotrActionDie;
  imageSource: string;
}

interface ActionTokendNode {
  id: WotrActionToken;
  imageSource: string;
}

@Component({
  selector: "wotr-action-dice-box",
  template: `
    @for (frontNode of frontNodes(); track frontNode.id) {
      <div
        class="wotr-action-dice"
        [class]="{
          selectable: frontNode.selectable,
          disabled: frontNode.disabled
        }">
        @for (actionDieNode of frontNode.actionDieNodes; track $index) {
          <img
            [src]="actionDieNode.imageSource"
            (click)="onActionDieClick(actionDieNode.id, frontNode)" />
        }
        @for (actionTokenNode of frontNode.actionTokenNodes; track $index) {
          <img
            [src]="actionTokenNode.imageSource"
            (click)="onActionTokenClick(actionTokenNode.id, frontNode)" />
        }
      </div>
    }
  `,
  styles: [
    `
      .wotr-action-dice {
        display: flex;
        &.selectable > * {
          cursor: pointer;
        }
        &.disabled > * {
          opacity: 0.5;
        }
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WotrActionDiceBox {
  protected assets = inject(WotrAssetsStore);
  private ui = inject(WotrGameUi);
  private frontStore = inject(WotrFrontStore);

  protected fronts = this.frontStore.fronts;
  protected actionDieSelection = this.ui.actionDieSelection;

  protected frontNodes = computed<FrontNode[]>(() => {
    const actionDieSelection = this.actionDieSelection();
    return this.fronts().map<FrontNode>(front => ({
      id: front.id,
      front,
      selectable: actionDieSelection?.frontId === front.id,
      disabled: !!actionDieSelection && actionDieSelection.frontId !== front.id,
      actionDieNodes: front.actionDice.map<ActionDieNode>(actionDie => ({
        id: actionDie,
        imageSource: this.assets.actionDieImage(actionDie, front.id)
      })),
      actionTokenNodes: front.actionTokens.map<ActionTokendNode>(actionToken => ({
        id: actionToken,
        imageSource: this.assets.actionTokenImage(actionToken, front.id)
      }))
    }));
  });

  onActionDieClick(actionDie: WotrActionDie, frontNode: FrontNode) {
    if (!frontNode.selectable) return;
    this.ui.actionChoice.emit({ type: "die", die: actionDie });
  }

  onActionTokenClick(actionToken: WotrActionToken, frontNode: FrontNode) {
    if (!frontNode.selectable) return;
    this.ui.actionChoice.emit({ type: "token", token: actionToken });
  }
}
