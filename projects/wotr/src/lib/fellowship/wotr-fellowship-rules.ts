import { inject, Injectable } from "@angular/core";
import { WotrCharacterStore } from "../character/wotr-character-store";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrFellowshipStore } from "./wotr-fellowship-store";

@Injectable({ providedIn: "root" })
export class WotrFellowshipRules {
  private fellowshipStore = inject(WotrFellowshipStore);
  private characterStore = inject(WotrCharacterStore);
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
}
