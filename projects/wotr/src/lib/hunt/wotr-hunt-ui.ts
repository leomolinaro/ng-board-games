import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { WotrAction } from "../commons/wotr-action-models";
import { revealFellowship } from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrGameUi, WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrRegionStore } from "../region/wotr-region-store";
import { allocateHuntDice, drawHuntTile, rollHuntDice } from "./wotr-hunt-actions";
import {
  WotrFellowshipCorruptionChoice,
  WotrHuntEffectChoiceParams
} from "./wotr-hunt-effect-choices";
import { WotrHuntStore } from "./wotr-hunt-store";

@Injectable({ providedIn: "root" })
export class WotrHuntUi {
  private huntStore = inject(WotrHuntStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private ui = inject(WotrGameUi);

  private fellowshipCorruptionChoice = inject(WotrFellowshipCorruptionChoice);

  async huntAllocationPhase(): Promise<WotrAction[]> {
    const min = this.huntStore.minimumNumberOfHuntDice();
    const max = this.huntStore.maximumNumberOfHuntDice();
    const quantity = await this.ui.askQuantity(
      "How many hunt dice do you want to allocate?",
      min,
      max
    );
    return [allocateHuntDice(quantity)];
  }

  async rollHuntDice(): Promise<WotrAction> {
    await this.ui.askContinue("Roll hunt dice");
    const huntDice: WotrCombatDie[] = [];
    for (let i = 0; i < this.huntStore.nHuntDice(); i++) {
      huntDice.push(randomUtil.getRandomInteger(1, 7) as WotrCombatDie);
    }
    return rollHuntDice(...huntDice);
  }

  async revealFellowship(): Promise<WotrAction[]> {
    const progress = this.fellowshipStore.progress();
    const fellowshipRegion = this.regionStore.regions().find(r => r.fellowship)!;
    const reachableRegions = this.regionStore.reachableRegions(fellowshipRegion.id, progress);
    const validRegions = reachableRegions.filter(r => {
      const region = this.regionStore.region(r);
      if (region.settlement !== "city" && region.settlement !== "stronghold") return true;
      if (region.controlledBy !== "free-peoples") return true;
      return false;
    });
    const chosenRegion = await this.ui.askRegion(
      "Choose a region where to reveal the fellowship",
      validRegions
    );
    return [revealFellowship(chosenRegion)];
  }

  async drawHuntTile(): Promise<WotrAction> {
    await this.ui.askContinue("Draw hunt tile");
    const huntTile = randomUtil.getRandomElement(this.huntStore.huntPool());
    return drawHuntTile(huntTile);
  }

  async reRollHuntDice(): Promise<WotrAction> {
    throw new Error("Method not implemented.");
  }

  async huntEffect(damage: number): Promise<WotrAction[]> {
    // TODO
    const choices: WotrPlayerChoice<WotrHuntEffectChoiceParams>[] = [
      this.fellowshipCorruptionChoice
    ];
    const actions = await this.ui.askChoice(`Absorbe ${damage} hunt damage points`, choices, {
      damage
    });
    return actions;
  }
}
