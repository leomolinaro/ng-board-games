import { inject, Injectable } from "@angular/core";
import { WotrCharacterRules } from "../character/wotr-character-rules";
import { WotrCompanionId } from "../character/wotr-character.models";
import { WotrCharacterStore } from "../character/wotr-character.store";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrGameUi } from "../game/wotr-game-ui.store";
import { WotrRegionStore } from "../region/wotr-region.store";
import { changeGuide, separateCompanions } from "./wotr-fellowship-actions";
import { WotrFellowshipHandler } from "./wotr-fellowship-handler";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

@Injectable({ providedIn: "root" })
export class WotrFellowshipUi {
  private fellowshipStore = inject(WotrFellowshipStore);
  private ui = inject(WotrGameUi);
  private characterRules = inject(WotrCharacterRules);
  private regionStore = inject(WotrRegionStore);
  private fellowshipHandler = inject(WotrFellowshipHandler);
  private characterStore = inject(WotrCharacterStore);

  async separateCompanions(): Promise<WotrAction[]> {
    const fellowshipCompanions = this.fellowshipStore.companions();
    const companions = await this.ui.askFellowshipCompanions("Select companions to separate", {
      companions: fellowshipCompanions,
      singleSelection: false
    });
    const groupLevel = this.characterRules.characterGroupLevel(companions);
    const fellowshipProgress = this.fellowshipStore.progress();
    const totalMovement = fellowshipProgress + groupLevel;
    const fellowshipRegion = this.regionStore.fellowshipRegion();
    const targetRegions = this.regionStore.reachableRegions(
      fellowshipRegion,
      totalMovement,
      (region, distance) => this.characterRules.companionCanEnterRegion(region, distance),
      (region, distance) => this.characterRules.companionCanLeaveRegion(region, distance)
    );
    const targetRegion = await this.ui.askRegion(
      "Select a region to move the separated companions",
      targetRegions
    );
    const actions: WotrAction[] = [];
    const action = separateCompanions(targetRegion, ...companions);
    actions.push(action);
    this.fellowshipHandler.separateCompanion(action);

    if (companions.some(c => this.fellowshipStore.guide() === c)) {
      const leftCompanionIds = fellowshipCompanions.filter(c => !companions.includes(c));
      if (leftCompanionIds.length > 0) {
        const leftCompanions = leftCompanionIds.map(id => this.characterStore.character(id));
        const maxLevel = leftCompanions.reduce((max, c) => Math.max(max, c.level), 0);
        const targetCompanions = leftCompanions.filter(c => c.level === maxLevel);
        const newGuide = await this.ui.askFellowshipCompanions("Select a new guide", {
          companions: targetCompanions.map(c => c.id as WotrCompanionId),
          singleSelection: true
        });
        actions.push(changeGuide(newGuide[0]));
      }
    }

    return actions;
  }
}
