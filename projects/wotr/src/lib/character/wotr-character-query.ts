import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterStore } from "./wotr-character-store";

export class WotrCharacterQuery {
  constructor(
    private characterId: WotrCharacterId,
    private characterStore: WotrCharacterStore,
    private regionStore: WotrRegionStore,
    private fellowshipStore: WotrFellowshipStore
  ) {}

  region(): WotrRegion | null {
    return this.regionStore.characterRegion(this.characterId);
  }

  isInFellowship(): boolean {
    return this.characterStore.isInFellowship(this.characterId);
  }

  isGuide(): boolean {
    return this.fellowshipStore.guide() === this.characterId;
  }

  isInPlay(): boolean {
    return this.characterStore.isInPlay(this.characterId);
  }

  isIn(regionId: WotrRegionId): boolean {
    return this.region()?.id === regionId;
  }

  isWithFreePeoplesArmy(): boolean {
    if (!this.isInPlay()) return false;
    const region = this.region();
    return (
      region?.army?.front === "free-peoples" || region?.underSiegeArmy?.front === "free-peoples"
    );
  }

  isInNation(nationId: WotrNationId): boolean {
    if (!this.characterStore.isInPlay(this.characterId)) return false;
    const region = this.region()!;
    return region && region.nationId === nationId;
  }
}
