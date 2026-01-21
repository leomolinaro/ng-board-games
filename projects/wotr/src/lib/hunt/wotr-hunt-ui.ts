import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { WotrCombatDie } from "../battle/wotr-combat-die-models";
import { WotrCardDiscardFromTable } from "../card/wotr-card-actions";
import { WotrCardHandler } from "../card/wotr-card-handler";
import { eliminateCharacter, WotrCharacterElimination } from "../character/wotr-character-actions";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrCompanionId } from "../character/wotr-character-models";
import { findAction, WotrAction } from "../commons/wotr-action-models";
import {
  chooseRandomCompanion,
  corruptFellowship,
  revealFellowship,
  revealFellowshipInMordor,
  WotrCompanionRandom,
  WotrFellowshipCorruption,
  WotrFellowshipReveal,
  WotrFellowshipRevealInMordor
} from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipHandler } from "../fellowship/wotr-fellowship-handler";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameUi, WotrUiChoice } from "../game/wotr-game-ui";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  allocateHuntDice,
  drawHuntTile,
  reRollHuntDice,
  rollHuntDice,
  rollShelobsLairDie,
  WotrHuntTileDraw
} from "./wotr-hunt-actions";
import { WotrHuntEffectParams } from "./wotr-hunt-models";
import { WotrHuntModifiers } from "./wotr-hunt-modifiers";
import { WotrHuntStore } from "./wotr-hunt-store";

@Injectable()
export class WotrHuntUi {
  private huntStore = inject(WotrHuntStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);
  private ui = inject(WotrGameUi);
  private q = inject(WotrGameQuery);
  private characterHandler = inject(WotrCharacterHandler);
  private fellowshipUi = inject(WotrFellowshipUi);
  private huntModifiers = inject(WotrHuntModifiers);
  private cardHandler = inject(WotrCardHandler);
  private fellowshipHandler = inject(WotrFellowshipHandler);

  private eliminateGuideChoice: WotrUiChoice<WotrHuntEffectParams> = {
    label: () => "Eliminate the guide",
    isAvailable: () => this.fellowshipStore.guide() !== "gollum",
    actions: async () => {
      const actions: WotrAction[] = [];
      const guide = this.fellowshipStore.guide();
      actions.push(eliminateCharacter(guide));
      await this.characterHandler.eliminateCharacters([guide]);
      if (this.fellowshipStore.guide() !== "gollum") {
        actions.push(await this.fellowshipUi.changeGuide());
      }
      return actions;
    }
  };

  private gollumRevealingChoice: WotrUiChoice<WotrHuntEffectParams> = {
    label: () => "Reveal with Gollum",
    isAvailable: () => this.fellowshipStore.isHidden() && this.fellowshipStore.guide() === "gollum",
    actions: async () => {
      const actions: WotrAction[] = [];
      if (this.fellowshipStore.isOnMordorTrack()) {
        actions.push(revealFellowshipInMordor());
        this.fellowshipHandler.revealInMordor();
      } else {
        const a = await this.revealFellowship();
        actions.push(...a);
        this.fellowshipHandler.reveal(a[0].region);
      }
      return actions;
    }
  };

  private randomCompanionChoice: WotrUiChoice<WotrHuntEffectParams> = {
    label: () => "Eliminate a random companion",
    isAvailable: () => this.fellowshipStore.companions().length > 0,
    actions: async () => {
      const companions = this.fellowshipStore.companions();
      const randomCompanion = randomUtil.getRandomElement(companions);
      return [chooseRandomCompanion(randomCompanion)];
    }
  };

  private useRingChoice: (damage: number) => WotrUiChoice<WotrHuntEffectParams> = damage => ({
    label: () => "Use the Ring",
    actions: async params => {
      return [corruptFellowship(damage)];
    }
  });

  async huntAllocationPhase(): Promise<WotrAction[]> {
    const min = this.huntStore.minimumNumberOfHuntDice();
    const max = this.huntStore.maximumNumberOfHuntDice();
    const quantity = await this.ui.askQuantity("How many hunt dice do you want to allocate?", {
      min,
      max,
      default: min
    });
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

  async rollShelobsLairDie(): Promise<WotrAction> {
    await this.ui.askContinue("Roll die for Shelob's Lair");
    const huntTileDie = randomUtil.getRandomInteger(1, 7) as WotrCombatDie;
    return rollShelobsLairDie(huntTileDie);
  }

  async revealFellowship(): Promise<[WotrFellowshipReveal]> {
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

  async drawHuntTile(n = 1): Promise<WotrHuntTileDraw> {
    if (n === 1) {
      await this.ui.askContinue("Draw hunt tile");
      const huntTile = randomUtil.getRandomElement(this.huntStore.huntPool());
      return drawHuntTile(huntTile);
    } else {
      n = Math.min(n, this.huntStore.huntPool().length);
      await this.ui.askContinue(`Draw ${n} hunt tiles`);
      const huntTiles = randomUtil.getRandomElements(n, n, this.huntStore.huntPool());
      return drawHuntTile(...huntTiles);
    }
  }

  async huntEffect(params: WotrHuntEffectParams): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    let damage = params.damage;
    let casualtyTaken = params.casualtyTaken;

    const randomCompanionIds = params.randomCompanions;
    if (randomCompanionIds) {
      const guide = this.fellowshipStore.guide();
      const wasGuide = randomCompanionIds.includes(guide);
      const randomCompanions = randomCompanionIds.map(id => this.q.character(id));
      await this.ui.askContinue(`Eliminate ${randomCompanions.map(c => c.name).join(", ")}`);
      actions.push(eliminateCharacter(...randomCompanionIds));
      damage -= randomCompanions.reduce((sum, c) => sum + c.level, 0);
      casualtyTaken = true;
      this.characterHandler.eliminateCharacters(randomCompanionIds);
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
      const choices: WotrUiChoice<WotrHuntEffectParams>[] = [];
      if (!casualtyTaken && !params.onlyRingAbsorbtion) {
        if (this.fellowshipStore.isHidden() && this.fellowshipStore.guide() === "gollum") {
          choices.push(this.gollumRevealingChoice);
        }
        if (!params.mustEliminateRandomCompanion) choices.push(this.eliminateGuideChoice);
        choices.push(this.randomCompanionChoice);
      }
      const hasCompanion = this.fellowshipStore.companions().length > 0;
      if (casualtyTaken || !params.mustEliminateRandomCompanion || !hasCompanion)
        choices.push(this.useRingChoice(damage));
      // Can use card with Foul Thing from the Deep
      // https://boardgamegeek.com/thread/969048/confirmation-can-you-use-horn-of-gondor-against-fo
      if (!casualtyTaken && !params.onlyRingAbsorbtion)
        choices.push(...this.huntModifiers.getHuntEffectChoices(params));
      const chosenActions = await this.ui.askChoice(
        `Absorb ${damage}/${params.damage} hunt damage points`,
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
      const discardTableCard = findAction<WotrCardDiscardFromTable>(
        chosenActions,
        "card-discard-from-table"
      );
      const gollumRevealing = findAction<WotrFellowshipReveal>(chosenActions, "fellowship-reveal");
      const gollumRevealingInMordor = findAction<WotrFellowshipRevealInMordor>(
        chosenActions,
        "fellowship-reveal-in-mordor"
      );
      if (randomCompanion) {
        continuee = false;
      } else {
        if (characterElimination) {
          damage -= characterElimination.characters.reduce(
            (sum, c) => sum + this.q.character(c).level,
            0
          );
          casualtyTaken = true;
        }
        if (useRing) {
          damage -= useRing.quantity;
        }
        if (discardTableCard) {
          damage -= 1; // assume table card absorb 1 damage point
          this.cardHandler.discardCardFromTable(discardTableCard.card);
        }
        if (gollumRevealing || gollumRevealingInMordor) {
          damage -= 1;
        }
      }
    }
    return actions;
  }

  async lureOfTheRingEffect(character: WotrCompanionId): Promise<WotrAction[]> {
    const companion = this.q.character(character);
    const option = await this.ui.askOption<"corrupt" | "eliminate">("Choose", [
      { label: `Add ${companion.level} corruption points`, value: "corrupt" },
      { label: `Eliminate ${companion.name}`, value: "eliminate" }
    ]);
    if (option === "corrupt") {
      return [corruptFellowship(companion.level)];
    } else {
      return [eliminateCharacter(character)];
    }
  }
}
