import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { eliminateCharacter, WotrCharacterElimination } from "../character/wotr-character-actions";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { findAction, WotrAction } from "../commons/wotr-action-models";
import {
  revealFellowship,
  WotrCompanionRandom,
  WotrFellowshipCorruption
} from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrGameUi, WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrRegionStore } from "../region/wotr-region-store";
import { allocateHuntDice, drawHuntTile, reRollHuntDice, rollHuntDice } from "./wotr-hunt-actions";
import {
  WotrEliminateGuideChoice,
  WotrRandomCompanionChoice,
  WotrUseRingChoice
} from "./wotr-hunt-effect-choices";
import { WotrHuntEffectParams } from "./wotr-hunt-models";
import { WotrHuntStore } from "./wotr-hunt-store";

@Injectable({ providedIn: "root" })
export class WotrHuntUi {
  private huntStore = inject(WotrHuntStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private ui = inject(WotrGameUi);
  private characterStore = inject(WotrCharacterStore);
  private characterHandler = inject(WotrCharacterHandler);
  private fellowshipUi = inject(WotrFellowshipUi);

  private eliminateGuideChoice = inject(WotrEliminateGuideChoice);
  private randomCompanionChoice = inject(WotrRandomCompanionChoice);
  private useRingChoice = inject(WotrUseRingChoice);

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

  async reRollHuntDice(nReRolls: number): Promise<WotrAction> {
    await this.ui.askContinue(`Re-roll ${nReRolls} hunt dice`);
    const huntDice: WotrCombatDie[] = [];
    for (let i = 0; i < nReRolls; i++) {
      huntDice.push(randomUtil.getRandomInteger(1, 7) as WotrCombatDie);
    }
    return reRollHuntDice(...huntDice);
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

  async huntEffect(params: WotrHuntEffectParams): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    let damage = params.damage;
    let casualtyTaken = params.casualtyTaken;

    const randomCompanionIds = params.randomCompanions;
    if (randomCompanionIds) {
      const guide = this.fellowshipStore.guide();
      const wasGuide = randomCompanionIds.includes(guide);
      const randomCompanions = randomCompanionIds.map(id => this.characterStore.character(id));
      await this.ui.askContinue(`Eliminate ${randomCompanions.map(c => c.name).join(", ")}`);
      actions.push(eliminateCharacter(...randomCompanionIds));
      damage -= randomCompanions.reduce((sum, c) => sum + c.level, 0);
      casualtyTaken = true;
      this.characterHandler.eliminateCharacter(randomCompanionIds);
      if (wasGuide) {
        actions.push(await this.fellowshipUi.changeGuide());
      }
    }

    let continuee = true;
    while (continuee && damage > 0) {
      // play table cards
      // guide special ability
      // guide elimination
      // random companion elimination
      // use ring
      const choices: WotrPlayerChoice<WotrHuntEffectParams>[] = [];
      if (!casualtyTaken) {
        choices.push(this.eliminateGuideChoice);
        choices.push(this.randomCompanionChoice);
      }
      choices.push(this.useRingChoice);
      const chosenActions = await this.ui.askChoice(
        `Absorb ${params.damage} hunt damage points`,
        choices,
        params
      );
      actions.push(...chosenActions);
      const characterElimination = findAction<WotrCharacterElimination>(
        chosenActions,
        "character-elimination"
      );
      const randomCompanion = findAction<WotrCompanionRandom>(chosenActions, "companion-random");
      const useRing = findAction<WotrFellowshipCorruption>(chosenActions, "fellowship-corruption");
      if (randomCompanion) {
        continuee = false;
      } else {
        if (characterElimination) {
          damage -= characterElimination.characters.reduce(
            (sum, c) => sum + this.characterStore.character(c).level,
            0
          );
          casualtyTaken = true;
        }
        if (useRing) {
          damage -= useRing.quantity;
        }
      }
    }
    return actions;
  }
}
