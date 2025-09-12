import { WotrFrontId } from "../front/wotr-front-models";
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
    const region = this.regionStore.region(this.regionId);
    const army = region.army;
    const underSiegeArmy = region.underSiegeArmy;
    return (
      (army && !this.unitUtils.isEmptyArmy(army) && army.front === frontId) ||
      (underSiegeArmy &&
        !this.unitUtils.isEmptyArmy(underSiegeArmy) &&
        underSiegeArmy.front === frontId)
    );
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

  isUnderSiege() {
    return this.regionStore.isUnderSiege(this.regionId);
  }
}
