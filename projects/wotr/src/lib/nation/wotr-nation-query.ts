import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrRegion, WotrRegionId } from '../region/wotr-region-models';
import type { WotrRegionStore } from '../region/wotr-region-store';
import type { WotrNation, WotrNationId } from './wotr-nation-models';
import type { WotrNationStore } from './wotr-nation-store';

export class WotrNationQuery {
  constructor(
    private nationId: WotrNationId,
    private nationStore: WotrNationStore,
    private regionStore: WotrRegionStore,
  ) {}

  id(): WotrNationId {
    return this.nationId;
  }

  nation(): WotrNation {
    return this.nationStore.nation(this.nationId);
  }

  frontId(): WotrFrontId {
    return this.nation().front;
  }

  isAtWar(): boolean {
    return this.nationStore.isAtWar(this.nationId);
  }

  isActive(): boolean {
    return this.nation().active;
  }

  nRegularReinforcements(): number {
    return this.nationStore.nation(this.nationId).reinforcements.regular;
  }

  nEliteReinforcements(): number {
    return this.nationStore.nation(this.nationId).reinforcements.elite;
  }

  nRegularCasualties(): number {
    return this.nationStore.nation(this.nationId).casualties.regular;
  }

  nEliteCasualties(): number {
    return this.nationStore.nation(this.nationId).casualties.elite;
  }

  hasRegularReinforcements(): boolean {
    return this.nationStore.hasRegularReinforcements(this.nationId);
  }

  hasEliteReinforcements(): boolean {
    return this.nationStore.hasEliteReinforcements(this.nationId);
  }

  hasNazgulReinforcements(): boolean {
    return this.nation().reinforcements.nazgul > 0;
  }

  hasLeaderReinforcements(): boolean {
    return this.nation().reinforcements.leader > 0;
  }

  strongholds(): WotrRegion[] {
    return this.regionStore
      .regions()
      .filter(
        (r) => r.nationId === this.nationId && r.settlement === 'stronghold',
      );
  }

  settlements(): WotrRegion[] {
    return this.regionStore
      .regions()
      .filter((r) => r.nationId === this.nationId && r.settlement);
  }

  recruitmentRegions(): WotrRegion[] {
    return this.regionStore.recruitmentRegions(this.nation());
  }

  canRecruit(regionId: WotrRegionId): boolean {
    return this.regionStore.isRecruitmentRegion(
      this.regionStore.region(regionId),
      this.nation(),
    );
  }
}
