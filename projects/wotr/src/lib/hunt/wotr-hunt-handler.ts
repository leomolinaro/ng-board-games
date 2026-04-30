import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { cardToLabel, WotrCardId } from "../card/wotr-card-models";
import { KomeSovereignId } from "../character/wotr-character-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrActionApplierMap, WotrActionLoggerMap } from "../commons/wotr-action-models";
import { WotrActionRegistry } from "../commons/wotr-action-registry";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";
import { WotrGameStore } from "../game/wotr-game-store";
import { WotrLogWriter } from "../log/wotr-log-writer";
import { KomeCorruptionFlow } from "./kome-corruption-flow";
import { corruptSovereign, KomeCorruptSovereign, WotrHuntAction } from "./wotr-hunt-actions";
import { WotrHuntTileId } from "./wotr-hunt-models";
import { WotrHuntStore } from "./wotr-hunt-store";

@Injectable()
export class WotrHuntHandler {
  private actionRegistry = inject(WotrActionRegistry);
  private huntStore = inject(WotrHuntStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private frontStore = inject(WotrFrontStore);
  private gameStore = inject(WotrGameStore);
  private corruptionFlow = inject(KomeCorruptionFlow);
  private characterStore = inject(WotrCharacterStore);
  private logger = inject(WotrLogWriter);

  init() {
    this.actionRegistry.registerActions(this.getActionAppliers() as any);
    this.actionRegistry.registerActionLoggers(this.getActionLoggers() as any);
    this.actionRegistry.registerEffectLogger<KomeCorruptSovereign>(
      "corrupt-sovereign",
      (effect, f) => [f.character(effect.sovereign), " has been corrupted"]
    );
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
      "hunt-tile-return": (action, front) => this.huntStore.returnDrawnTileToPool(action.tile),
      "corruption-start-attempt": async (action, front) =>
        this.startCorruptionAttempt(action.sovereign, action.tile),
      "corruption-continue-attempt": async (action, front) =>
        this.continueCorruptionAttempt(action.tile),
      "corruption-stop-attempt": async (action, front) => this.stopCorruptionAttempt(action.tile),
      "corrupt-sovereign": (action, front) => {
        throw new Error("This should be handled by the effect logger and not the action applier");
      }
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
      ],
      "corruption-start-attempt": (action, front, f) => {
        const log = [
          f.player(front),
          " starts a corruption attempt on ",
          f.character(action.sovereign),
          ","
        ];
        log.push(
          " drawing ",
          f.huntTile(action.tile, this.huntTileLogOptions(action.tile)),
          " corruption tile"
        );
        return log;
      },
      "corruption-continue-attempt": (action, front, f) => {
        const log = [f.player(front), " continues a corruption attempt,"];
        log.push(
          " drawing ",
          f.huntTile(action.tile, this.huntTileLogOptions(action.tile)),
          " corruption tile"
        );
        return log;
      },
      "corruption-stop-attempt": (action, front, f) => [
        f.player(front),
        " chooses ",
        f.huntTile(action.tile),
        " corruption tile"
      ],
      "corrupt-sovereign": (effect, front, f) => {
        throw new Error("This should be handled by the effect logger and not the action logger");
      }
    };
  }

  private huntTileLogOptions(tileId: WotrHuntTileId): { hideFor?: WotrFrontId } {
    if (this.gameStore.visibleCorruptionTiles()) return {};
    const tile = this.huntStore.huntTile(tileId);
    if (tile.eye || tile.type !== "standard") return {};
    return { hideFor: "free-peoples" };
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

  async startCorruptionAttempt(sovereign: KomeSovereignId, tile: WotrHuntTileId) {
    this.huntStore.drawCorruptionTile(tile);
    this.huntStore.startCorruptionAttempt(sovereign, tile);
    await this.corruptionFlow.corruptionAttempt(sovereign, tile);
  }

  async continueCorruptionAttempt(tile: WotrHuntTileId) {
    this.huntStore.drawCorruptionTile(tile);
    this.huntStore.continueCorruptionAttempt(tile);
  }

  async stopCorruptionAttempt(tile: WotrHuntTileId) {
    const corruptionAttempt = this.huntStore.getCorruptionAttempt();
    if (!corruptionAttempt) throw new Error("No corruption attempt in progress");
    this.characterStore.addSovereignCorruption(corruptionAttempt.sovereign, tile);
    this.huntStore.resetCorruptionAttempt(tile);

    const sovereign = this.characterStore.sovereign(corruptionAttempt.sovereign);
    const corruptionTiles = sovereign.corruptionTiles;
    const currentCorruption = corruptionTiles.reduce(
      (acc, t) => acc + (this.huntStore.huntTile(t).quantity ?? 0),
      0
    );
    if (currentCorruption >= sovereign.shadowResistance) {
      this.characterStore.corruptSovereign(sovereign.id);
      this.huntStore.resetCorruptionTiles(corruptionTiles);
      const action = corruptSovereign(sovereign.id);
      this.logger.logEffect(action);
    }
  }
}
