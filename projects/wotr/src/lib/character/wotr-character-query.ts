import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrCharacter, WotrCharacterId } from "./wotr-character-models";
import { WotrCharacterStore } from "./wotr-character-store";

export class WotrCharacterQuery {
  constructor(
    private characterId: WotrCharacterId,
    private characterStore: WotrCharacterStore,
    private regionStore: WotrRegionStore,
    private fellowshipStore: WotrFellowshipStore
  ) {}

  id() {
    return this.characterId;
  }

  character(): WotrCharacter {
    return this.characterStore.character(this.characterId);
  }

  name(): string {
    return this.character().name;
  }

  frontId() {
    return this.character().front;
  }

  region(): WotrRegion | null {
    return this.regionStore.characterRegion(this.characterId);
  }

  isInPlay(): boolean {
    return this.character().status === "inPlay";
  }

  isEliminated(): boolean {
    return this.character().status === "eliminated";
  }

  isAvailable(): boolean {
    return this.character().status === "available";
  }

  isInFellowship(): boolean {
    return this.character().status === "inFellowship";
  }

  isGuide(): boolean {
    return this.fellowshipStore.guide() === this.characterId;
  }

  isIn(regionId: WotrRegionId): boolean {
    return this.regionStore.isCharacterInRegion(this.characterId, regionId);
  }

  isWithFreePeoplesArmy(): boolean {
    if (!this.isInPlay()) return false;
    const region = this.region();
    return (
      region?.army?.front === "free-peoples" || region?.underSiegeArmy?.front === "free-peoples"
    );
  }

  isInNation(nationId: WotrNationId): boolean {
    if (!this.isInPlay()) return false;
    const region = this.region()!;
    return region && region.nationId === nationId;
  }
}
