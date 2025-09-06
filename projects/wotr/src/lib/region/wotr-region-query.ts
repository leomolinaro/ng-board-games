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

  isFreeForRecruitment(frontId: WotrFrontId): boolean {
    return this.regionStore.isFreeForRecruitment(this.regionId, frontId);
  }

  hasNazgul() {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasNazgul(region.army)) ||
      (region.freeUnits && this.unitUtils.hasNazgul(region.freeUnits))
    );
  }
}
