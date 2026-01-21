import { inject, Injectable } from "@angular/core";
import { WotrCompanionId } from "../character/wotr-character-models";
import { WotrCharacterQuery } from "../character/wotr-character-query";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrGameQuery } from "../game/wotr-game-query";
import { WotrGameUi, WotrUiChoice, WotrUiOption } from "../game/wotr-game-ui";
import {
  changeGuide,
  declareFellowship,
  healFellowship,
  hideFellowship,
  moveFelloswhip,
  separateCompanions,
  WotrFellowshipGuide
} from "./wotr-fellowship-actions";
import { WotrFellowshipHandler } from "./wotr-fellowship-handler";
import { WotrFellowshipRules } from "./wotr-fellowship-rules";
import { WotrFellowshipStore } from "./wotr-fellowship-store";

interface WotrSeparateCompanionsOptions {
  extraMovements?: number;
  asLevel?: number;
  canEndInSiege?: boolean;
}

@Injectable()
export class WotrFellowshipUi {
  private fellowshipStore = inject(WotrFellowshipStore);
  private ui = inject(WotrGameUi);
  private fellowshipHandler = inject(WotrFellowshipHandler);
  private fellowshipRules = inject(WotrFellowshipRules);
  private q = inject(WotrGameQuery);

  async fellowshipPhase(): Promise<WotrAction[]> {
    let continueAsking = true;
    const actions: WotrAction[] = [];
    const validActions: WotrUiOption<"declare" | "guide" | "pass">[] = [
      {
        value: "declare",
        label: "Declare Fellowship",
        disabled: !this.fellowshipRules.canDeclareFellowship()
      },
      {
        value: "guide",
        label: "Change Fellowship guide",
        disabled: !this.fellowshipRules.canChangeGuide()
      },
      { value: "pass", label: "Pass" }
    ];
    while (continueAsking) {
      const a = await this.ui.askOption("Fellowship Phase: choose an action", validActions);
      switch (a) {
        case "declare": {
          validActions.splice(
            validActions.findIndex(x => x.value === "declare"),
            1
          );
          const validRegions = this.fellowshipRules.validRegionsForDeclaration();
          const region = await this.ui.askRegion(
            "Choose a region to declare the fellowship",
            validRegions
          );
          this.fellowshipHandler.declare(region);
          actions.push(declareFellowship(region));
          break;
        }
        case "guide": {
          validActions.splice(
            validActions.findIndex(x => x.value === "guide"),
            1
          );
          const action = await this.changeGuide();
          this.fellowshipHandler.changeGuide(action.companion);
          actions.push(action);
          break;
        }
        case "pass":
          continueAsking = false;
          break;
      }
    }
    return actions;
  }

  async separateCompanions(options?: WotrSeparateCompanionsOptions): Promise<WotrAction[]> {
    const fellowshipCompanions = this.fellowshipStore.companions();
    const companions = await this.ui.askFellowshipCompanions("Select companions to separate", {
      companions: fellowshipCompanions,
      singleSelection: false
    });
    return this.separateThoseCompanions(companions, options);
  }

  async separateThoseCompanions(
    companions: WotrCompanionId[],
    options?: WotrSeparateCompanionsOptions
  ): Promise<WotrAction[]> {
    const targetRegions = this.fellowshipRules.companionSeparationTargetRegions(
      companions,
      options
    );
    const targetRegion = await this.ui.askRegion(
      "Select a region to move the separated companions",
      targetRegions
    );
    const actions: WotrAction[] = [];
    actions.push(separateCompanions(targetRegion, ...companions));
    this.fellowshipHandler.separateCompanions(companions, targetRegion);

    if (companions.some(c => this.fellowshipStore.guide() === c)) {
      const fellowshipCompanions = this.fellowshipStore.companions();
      const leftCompanionIds = fellowshipCompanions.filter(c => !companions.includes(c));
      if (leftCompanionIds.length > 0) {
        const leftCompanions = leftCompanionIds.map(id => this.q.character(id));
        actions.push(await this.changeGuideBetween(leftCompanions));
      }
    }

    return actions;
  }

  async changeGuide(): Promise<WotrFellowshipGuide> {
    const companionIds = this.fellowshipStore.companions();
    const companions = companionIds.map(id => this.q.character(id));
    return this.changeGuideBetween(companions);
  }

  private async changeGuideBetween(companions: WotrCharacterQuery[]): Promise<WotrFellowshipGuide> {
    const guide = this.fellowshipStore.guide();
    const maxLevel = companions.reduce((max, c) => Math.max(max, c.level), 0);
    const targetCompanions = companions.filter(c => c.level === maxLevel && c.id !== guide);
    const newGuide = await this.ui.askFellowshipCompanions("Select a new guide", {
      companions: targetCompanions.map(c => c.id as WotrCompanionId),
      singleSelection: true
    });
    return changeGuide(newGuide[0]);
  }

  async healFellowship(amount: number): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    const actualAmount = Math.min(amount, this.q.fellowship.corruption());
    if (actualAmount) {
      await this.ui.askContinue("Heal the Fellowship");
      actions.push(healFellowship(actualAmount));
    }
    return actions;
  }

  progressChoice: WotrUiChoice = {
    label: () => "Fellowship progress",
    isAvailable: () => !this.fellowshipStore.isRevealed(),
    actions: async () => [moveFelloswhip()]
  };

  hideFellowshipChoice: WotrUiChoice = {
    label: () => "Hide the Fellowship",
    isAvailable: () => this.fellowshipStore.isRevealed(),
    actions: async () => [hideFellowship()]
  };

  separateCompanionsChoice: WotrUiChoice = {
    label: () => "Separate companions",
    isAvailable: () => this.fellowshipStore.numberOfCompanions() > 0,
    actions: async () => this.separateCompanions()
  };
}
