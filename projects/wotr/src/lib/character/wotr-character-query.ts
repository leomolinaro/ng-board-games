import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegion, WotrRegionId } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import {
  KomeSovereign,
  KomeSovereignId,
  WotrCharacter,
  WotrCharacterId
} from "./wotr-character-models";
import { WotrCharacterStore } from "./wotr-character-store";

export class WotrCharacterQuery<ID extends WotrCharacterId = WotrCharacterId> {
  constructor(
    public readonly id: ID,
    protected characterStore: WotrCharacterStore,
    protected regionStore: WotrRegionStore,
    protected fellowshipStore: WotrFellowshipStore
  ) {}

  protected data(): WotrCharacter {
    return this.characterStore.character(this.id);
  }

  get name(): string {
    return this.data().name;
  }

  get level(): number {
    return this.data().level;
  }

  get frontId() {
    return this.data().front;
  }

  get flying(): boolean {
    return this.data().flying;
  }

  get leadership(): number {
    return this.data().leadership;
  }

  get activationNation(): WotrNationId | "all" | undefined {
    return this.data().activationNation;
  }

  region(): WotrRegion | null {
    return this.regionStore.characterRegion(this.id);
  }

  isInPlay(): boolean {
    return this.data().status === "inPlay";
  }

  isEliminated(): boolean {
    return this.data().status === "eliminated";
  }

  isMinionForGandalfTheWhite(): boolean {
    return this.data().isMinionForGandalfTheWhite;
  }

  isAvailable(): boolean {
    return this.data().status === "available";
  }

  isInFellowship(): boolean {
    return this.data().status === "inFellowship";
  }

  isGuide(): boolean {
    return this.fellowshipStore.guide() === this.id;
  }

  isIn(regionId: WotrRegionId): boolean {
    return this.regionStore.isCharacterInRegion(this.id, regionId);
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

  canMove(): unknown {
    const character = this.data();
    if (character.status !== "inPlay") return false;
    if (character.level === 0) return false;
    if (character.flying) {
      if (this.isUnderSiege()) return false;
    }
    return true;
  }

  isUnderSiege(): boolean {
    return this.regionStore.regions().some(region => {
      return !region.underSiegeArmy?.characters?.includes(this.id);
    });
  }

  setInFellowship(): void {
    this.characterStore.setInFellowship(this.id);
  }
}

export class KomeSovereignQuery extends WotrCharacterQuery<KomeSovereignId> {
  constructor(
    id: KomeSovereignId,
    characterStore: WotrCharacterStore,
    regionStore: WotrRegionStore,
    fellowshipStore: WotrFellowshipStore
  ) {
    super(id, characterStore, regionStore, fellowshipStore);
  }

  protected override data(): KomeSovereign {
    return this.characterStore.sovereign(this.id);
  }

  get rulerStatus() {
    return this.data().sovereignStatus;
  }

  isAwakened(): boolean {
    return this.rulerStatus === "awakened";
  }

  isCorrupted(): boolean {
    return this.rulerStatus === "corrupted";
  }
}
