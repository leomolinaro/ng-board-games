import { WotrFrontId } from "../front/wotr-front-models";
import { WotrArmy } from "../unit/wotr-unit-models";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import { WotrRegionId } from "./wotr-region-models";
import { WotrRegionStore } from "./wotr-region-store";

export class WotrRegionQuery {
  constructor(
    public readonly regionId: WotrRegionId,
    private regionStore: WotrRegionStore,
    private unitUtils: WotrUnitUtils
  ) {}

  region() {
    return this.regionStore.region(this.regionId);
  }

  isFreeForRecruitment(frontId: WotrFrontId): boolean {
    return this.regionStore.isFreeForRecruitment(this.regionId, frontId);
  }
  isFreeForRecruitmentByCard(frontId: WotrFrontId): boolean {
    return this.regionStore.isFreeForRecruitmentByCard(this.regionId, frontId);
  }

  hasArmy(frontId: WotrFrontId) {
    return this.army(frontId) != null;
  }

  army(frontId: WotrFrontId): WotrArmy | null {
    const region = this.regionStore.region(this.regionId);
    const a = region.army;
    const u = region.underSiegeArmy;
    if (a && a.front === frontId && !this.unitUtils.isEmptyArmy(a)) return a;
    if (u && u.front === frontId && !this.unitUtils.isEmptyArmy(u)) return u;
    return null;
  }

  hasNazgul() {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasNazgul(region.army)) ||
      (region.freeUnits && this.unitUtils.hasNazgul(region.freeUnits))
    );
  }

  hasCompanions() {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasCompanions(region.army)) ||
      (region.freeUnits && this.unitUtils.hasCompanions(region.freeUnits))
    );
  }

  isUnconquered() {
    return this.regionStore.isUnconquered(this.regionId);
  }

  isUnderSiege(frontId: WotrFrontId) {
    const region = this.region();
    return region.underSiegeArmy?.front === frontId;
  }
}
