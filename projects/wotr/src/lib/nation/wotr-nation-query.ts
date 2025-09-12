import { WotrRegion } from "../region/wotr-region-models";
import { WotrRegionStore } from "../region/wotr-region-store";
import { WotrNationId } from "./wotr-nation-models";
import { WotrNationStore } from "./wotr-nation-store";

export class WotrNationQuery {
  constructor(
    private nationId: WotrNationId,
    private nationStore: WotrNationStore,
    private regionStore: WotrRegionStore
  ) {}

  id() {
    return this.nationId;
  }

  isAtWar(): boolean {
    return this.nationStore.isAtWar(this.nationId);
  }

  isActive(): boolean {
    return this.nation().active;
  }

  private nation() {
    return this.nationStore.nation(this.nationId);
  }

  nRegularReinforcements(): number {
    return this.nationStore.nation(this.nationId).reinforcements.regular;
  }
  nEliteReinforcements(): number {
    return this.nationStore.nation(this.nationId).reinforcements.elite;
  }

  hasRegularReinforcements(): boolean {
    return this.nationStore.hasRegularReinforcements(this.nationId);
  }

  hasEliteReinforcements(): boolean {
    return this.nationStore.hasEliteReinforcements(this.nationId);
  }

  hasLeaderReinforcements(): boolean {
    return this.nation().reinforcements.leader > 0;
  }

  strongholds(): WotrRegion[] {
    return this.regionStore
      .regions()
      .filter(r => r.nationId === this.nationId && r.settlement === "stronghold");
  }

  settlements(): WotrRegion[] {
    return this.regionStore.regions().filter(r => r.nationId === this.nationId && r.settlement);
  }

  recruitmentRegions(): WotrRegion[] {
    return this.regionStore.recruitmentRegions(this.nation());
  }
}
