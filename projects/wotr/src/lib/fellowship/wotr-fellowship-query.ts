import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrNationStore } from "../nation/wotr-nation-store";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrFellowshipStore } from "./wotr-fellowship-store";

export class WotrFellowshipQuery {
  constructor(
    private fellowshipStore: WotrFellowshipStore,
    private regionStore: WotrRegionStore,
    private nationStore: WotrNationStore
  ) {}

  corruption(): number {
    return this.fellowshipStore.corruption();
  }

  progress(): number {
    return this.fellowshipStore.progress();
  }

  hasCompanions(): boolean {
    return this.fellowshipStore.companions().length > 0;
  }

  regionId(): WotrRegionId {
    return this.regionStore.fellowshipRegion();
  }

  region(): WotrRegion {
    return this.regionStore.region(this.regionId());
  }

  guideIs(characterId: WotrCharacterId): boolean {
    return this.fellowshipStore.guide() === characterId;
  }

  isInFreePeoplesSettlement() {
    const region = this.regionStore.region(this.regionId());
    if (!region.settlement) return false;
    const nation = this.nationStore.nation(region.nationId!);
    return nation.front === "free-peoples";
  }

  isInFreePeoplesCityOrStronghold() {
    const region = this.regionStore.region(this.regionId());
    if (region.settlement === "city" || region.settlement === "stronghold") {
      const nation = this.nationStore.nation(region.nationId!);
      return nation.front === "free-peoples";
    } else {
      return false;
    }
  }

  isOnMordorTrack(): boolean {
    return this.fellowshipStore.isOnMordorTrack();
  }

  isHidden(): boolean {
    return this.fellowshipStore.isHidden();
  }
}
