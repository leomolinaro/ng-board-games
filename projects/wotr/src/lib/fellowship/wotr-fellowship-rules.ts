import { inject, Injectable } from "@angular/core";
import { WotrCompanionId } from "../character/wotr-character-models";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrFellowshipStore } from "./wotr-fellowship-store";
import { WotrCharacterRules } from "../character/wotr-character-rules";

@Injectable({ providedIn: "root" })
export class WotrFellowshipRules {
  private fellowshipStore = inject(WotrFellowshipStore);
  private characterStore = inject(WotrCharacterStore);
  private characterRules = inject(WotrCharacterRules);
  private regionStore = inject(WotrRegionStore);

  canDeclareFellowship(): boolean {
    if (this.fellowshipStore.isRevealed()) return false;
    if (this.fellowshipStore.isOnMordorTrack()) return false;
    return true;
  }

  canChangeGuide(): boolean {
    const companions = this.fellowshipStore.companions();
    const maxLevel = this.characterStore.maxLevel(companions);
    const maxLevelCompanions = companions.filter(
      c => this.characterStore.character(c).level === maxLevel
    );
    return maxLevelCompanions.length > 1;
  }

  validRegionsForDeclaration() {
    const startingRegion = this.regionStore.fellowshipRegion();
    const progress = this.fellowshipStore.progress();
    const reachableRegions = this.regionStore.reachableRegions(startingRegion, progress);
    return reachableRegions;
  }

  companionSeparationTargetRegions(companions: WotrCompanionId[]) {
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
    return targetRegions;
  }
}
