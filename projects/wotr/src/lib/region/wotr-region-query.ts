import { WotrFrontId } from "../front/wotr-front-models";
import { WotrRegionId } from "./wotr-region-models";
import { WotrRegionStore } from "./wotr-region-store";

export class WotrRegionQuery {
  constructor(
    public readonly regionId: WotrRegionId,
    private regionStore: WotrRegionStore
  ) {}

  isFreeForRecruitment(frontId: WotrFrontId): boolean {
    return this.regionStore.isFreeForRecruitment(this.regionId, frontId);
  }
}
