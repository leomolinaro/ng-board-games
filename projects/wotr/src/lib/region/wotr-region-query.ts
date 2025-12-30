import { WotrCharacterId } from "../character/wotr-character-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrArmy } from "../unit/wotr-unit-models";
import { WotrUnitUtils } from "../unit/wotr-unit-utils";
import { WotrRegionId } from "./wotr-region-models";
import { WotrRegionStore } from "./wotr-region-store";

export class WotrRegionQuery {
  constructor(
    private regionId: WotrRegionId,
    private regionStore: WotrRegionStore,
    private unitUtils: WotrUnitUtils
  ) {}

  private query(regionId: WotrRegionId) {
    return new WotrRegionQuery(regionId, this.regionStore, this.unitUtils);
  }

  id() {
    return this.regionId;
  }

  region() {
    return this.regionStore.region(this.regionId);
  }

  isCoastal() {
    return this.region().seaside;
  }

  isNation(nationId: WotrNationId): boolean {
    return this.region().nationId === nationId;
  }

  isControlledBy(frontId: WotrFrontId): boolean {
    return this.region().controlledBy === frontId;
  }

  isAdjacentTo(otherRegionId: WotrRegionId): boolean {
    const region = this.regionStore.region(this.regionId);
    return region.neighbors.some(n => n.id === otherRegionId && !n.impassable);
  }

  isWithinNRegionsOf(regionId: WotrRegionId, maxDistance: number): boolean {
    const reachable = this.regionStore.reachableRegions(this.regionId, maxDistance);
    console.log(reachable);
    return reachable.includes(regionId);
  }

  reachableRegions(
    progress: number,
    canEnter?: (region: WotrRegionQuery, distance: number) => boolean,
    canLeave?: (region: WotrRegionQuery, distance: number) => boolean
  ): WotrRegionQuery[] {
    return this.regionStore
      .reachableRegions(
        this.regionId,
        progress,
        canEnter ? r => canEnter(this.query(r.id), progress) : undefined,
        canLeave ? r => canLeave(this.query(r.id), progress) : undefined
      )
      .map(r => this.query(r));
  }

  isStronghold() {
    return this.region().settlement === "stronghold";
  }

  isCity() {
    return this.region().settlement === "city";
  }

  isFreePeoplesRegion() {
    return this.region().frontId === "free-peoples";
  }

  isFreeForRecruitment(frontId: WotrFrontId): boolean {
    return this.regionStore.isFreeForRecruitment(this.regionId, frontId);
  }

  isFreeForRecruitmentByCard(frontId: WotrFrontId): boolean {
    return this.regionStore.isFreeForRecruitmentByCard(this.regionId, frontId);
  }

  isFreeForArmyMovement(frontId: WotrFrontId): boolean {
    return this.regionStore.isFreeForArmyMovement(this.regionId, frontId);
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

  hasArmyNotUnderSiege(frontId: WotrFrontId) {
    return this.armyNotUnderSiege(frontId) != null;
  }

  armyNotUnderSiege(frontId: WotrFrontId): WotrArmy | null {
    const region = this.regionStore.region(this.regionId);
    const a = region.army;
    if (a && a.front === frontId && !this.unitUtils.isEmptyArmy(a)) return a;
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

  companions() {
    const region = this.regionStore.region(this.regionId);
    if (region.army && this.unitUtils.hasCompanions(region.army))
      return this.unitUtils.getCompanions(region.army);
    if (region.underSiegeArmy && this.unitUtils.hasCompanions(region.underSiegeArmy))
      return this.unitUtils.getCompanions(region.underSiegeArmy);
    if (region.freeUnits && this.unitUtils.hasCompanions(region.freeUnits))
      return this.unitUtils.getCompanions(region.freeUnits);
    return [];
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

  hasCharacter(characterId: WotrCharacterId) {
    const region = this.regionStore.region(this.regionId);
    return (
      region.army?.characters?.includes(characterId) ||
      region.underSiegeArmy?.characters?.includes(characterId) ||
      region.freeUnits?.characters?.includes(characterId) ||
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
