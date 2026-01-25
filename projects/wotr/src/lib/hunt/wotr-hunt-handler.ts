import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { cardToLabel, WotrCardId } from "../card/wotr-card-models";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrHuntAction } from "./wotr-hunt-actions";
import { WotrHuntStore } from "./wotr-hunt-store";

@Injectable()
export class WotrHuntHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private huntStore = inject(WotrHuntStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private frontStore = inject(WotrFrontStore);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
  }

  getActionAppliers(): WotrActionApplierMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front) => this.huntStore.addHuntDice(action.quantity),
      "hunt-lidless-eye-die-change": (action, front) => this.lidlessEyeChange(action.dice),
      "hunt-roll": (action, front) => {
        /*empty*/
      },
      "hunt-re-roll": (action, front) => {
        /*empty*/
      },
      "hunt-shelobs-lair-roll": (action, front) => {
        /*empty*/
      },
      "hunt-tile-draw": (action, front) => {
        action.tiles.forEach(tile => this.huntStore.drawHuntTile(tile));
      },
      "hunt-tile-add": (action, front) => {
        if (this.fellowshipStore.isOnMordorTrack()) {
          this.huntStore.moveAvailableTileToPool(action.tile);
        } else {
          this.huntStore.moveAvailableTileToReady(action.tile);
        }
      },
      "hunt-tile-return": (action, front) => this.huntStore.returnDrawnTileToPool(action.tile)
    };
  }

  private getActionLoggers(): WotrActionLoggerMap<WotrHuntAction> {
    return {
      "hunt-allocation": (action, front, f) => [
        f.player(front),
        ` allocates ${this.nDice(action.quantity)} in the Hunt Box`
      ],
      "hunt-lidless-eye-die-change": (action, front, f) => {
        const multiple = action.dice.length > 1;
        return [
          f.player(front),
          ` changes ${action.dice.length} action ${multiple ? "die" : "dice"} into Eye${multiple ? "s" : ""} for the hunt`
        ];
      },
      "hunt-re-roll": (action, front, f) => [
        f.player(front),
        ` re-rolls ${this.dice(action.dice)} for the hunt`
      ],
      "hunt-roll": (action, front, f) => [
        f.player(front),
        ` rolls ${this.dice(action.dice)} for the hunt`
      ],
      "hunt-shelobs-lair-roll": (action, front, f) => [
        f.player(front),
        ` rolls a ${action.die} for Shelob's Lair`
      ],
      "hunt-tile-add": (action, front, f) => [
        f.player(front),
        " adds ",
        f.huntTile(action.tile),
        " hunt tile to the Mordor Track"
      ],
      "hunt-tile-draw": (action, front, f) => [
        f.player(front),
        " draws ",
        ...action.tiles.map(tile => f.huntTile(tile)),
        ` hunt tile${action.tiles.length > 1 ? "s" : ""}`
      ],
      "hunt-tile-return": (action, front, f) => [
        f.player(front),
        " returns ",
        f.huntTile(action.tile),
        " hunt tile to the Hunt Pool"
      ]
    };
  }

  private nDice(quantity: number) {
    return `${quantity} ${quantity === 1 ? "die" : "dice"}`;
  }

  private dice(dice: number[]) {
    return dice.join(", ");
  }

  lidlessEyeChange(dice: WotrActionDie[]) {
    for (const die of dice) {
      this.frontStore.removeActionDie(die, "shadow");
    }
    this.huntStore.addHuntDice(dice.length);
  }

  cardHuntDamageReduction(cardId: WotrCardId): number {
    switch (cardToLabel(cardId)) {
      case "Axe and Bow":
      case "Horn of Gondor":
        return 1;
      default:
        return 0;
    }
  }
}
