import { WotrFrontId } from "../front/wotr-front-models";
import { WotrNationId } from "../nation/wotr-nation-models";
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

  isCoastal() {
    return this.region().seaside;
  }

  isAdjacentTo(otherRegionId: WotrRegionId): boolean {
    const region = this.regionStore.region(this.regionId);
    return region.neighbors.some(n => n.id === otherRegionId && !n.impassable);
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

  isBesiegedBy(frontId: WotrFrontId) {
    const region = this.regionStore.region(this.regionId);
    if (!region.underSiegeArmy) return false;
    return region.underSiegeArmy.front !== frontId;
  }

  hasRegularUnitsOfNation(nationId: WotrNationId) {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasRegularUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy &&
        this.unitUtils.hasRegularUnitsOfNation(nationId, region.underSiegeArmy)) ||
      false
    );
  }

  hasEliteUnitsOfNation(nationId: WotrNationId) {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasEliteUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy &&
        this.unitUtils.hasEliteUnitsOfNation(nationId, region.underSiegeArmy)) ||
      false
    );
  }

  hasArmyUnitsOfNation(nationId: WotrNationId) {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasArmyUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy &&
        this.unitUtils.hasArmyUnitsOfNation(nationId, region.underSiegeArmy)) ||
      false
    );
  }

  hasLeadersOfNation(nationId: WotrNationId) {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy && this.unitUtils.hasUnitsOfNation(nationId, region.underSiegeArmy)) ||
      false
    );
  }

  hasNazgul() {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasNazgul(region.army)) ||
      (region.underSiegeArmy && this.unitUtils.hasNazgul(region.underSiegeArmy)) ||
      (region.freeUnits && this.unitUtils.hasNazgul(region.freeUnits)) ||
      false
    );
  }

  hasCompanions() {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasCompanions(region.army)) ||
      (region.underSiegeArmy && this.unitUtils.hasCompanions(region.underSiegeArmy)) ||
      (region.freeUnits && this.unitUtils.hasCompanions(region.freeUnits)) ||
      false
    );
  }

  hasMinions() {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army && this.unitUtils.hasMinions(region.army)) ||
      (region.underSiegeArmy && this.unitUtils.hasMinions(region.underSiegeArmy)) ||
      (region.freeUnits && this.unitUtils.hasMinions(region.freeUnits)) ||
      false
    );
  }

  hasFellowship() {
    const region = this.regionStore.region(this.regionId);
    return region.fellowship;
  }

  isUnconquered() {
    return this.regionStore.isUnconquered(this.regionId);
  }

  isUnderSiege(frontId: WotrFrontId) {
    const region = this.region();
    return region.underSiegeArmy?.front === frontId;
  }
}
