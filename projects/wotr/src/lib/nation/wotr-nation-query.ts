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

  isAtWar(): boolean {
    return this.nationStore.isAtWar(this.nationId);
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

  strongholds(): WotrRegion[] {
    return this.regionStore
      .regions()
      .filter(r => r.nationId === this.nationId && r.settlement === "stronghold");
  }

  settlements(): WotrRegion[] {
    return this.regionStore.regions().filter(r => r.nationId === this.nationId && r.settlement);
  }
}
