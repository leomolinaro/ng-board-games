import type {
  WotrCharacterId,
  WotrCompanionId,
} from '../character/wotr-character-models';
import type { WotrFrontId } from '../front/wotr-front-models';
import type { WotrNationId } from '../nation/wotr-nation-models';
import type { WotrArmy } from '../unit/wotr-unit-models';
import type { WotrUnitUtils } from '../unit/wotr-unit-utils';
import type { WotrRegion, WotrRegionId } from './wotr-region-models';
import type { WotrRegionStore } from './wotr-region-store';

export class WotrRegionQuery {
  constructor(
    private regionId: WotrRegionId,
    private regionStore: WotrRegionStore,
    private unitUtils: WotrUnitUtils,
  ) {}

  private query(regionId: WotrRegionId): WotrRegionQuery {
    return new WotrRegionQuery(regionId, this.regionStore, this.unitUtils);
  }

  id(): WotrRegionId {
    return this.regionId;
  }

  region(): WotrRegion {
    return this.regionStore.region(this.regionId);
  }

  isCoastal(): boolean {
    return this.region().seaside;
  }

  isNation(nationId: WotrNationId): boolean {
    return this.region().nationId === nationId;
  }

  isFront(frontId: WotrFrontId): boolean {
    return this.region().frontId === frontId;
  }

  isControlledBy(frontId: WotrFrontId): boolean {
    return this.region().controlledBy === frontId;
  }

  isAdjacentTo(otherRegionId: WotrRegionId): boolean {
    const region = this.regionStore.region(this.regionId);
    return region.neighbors.some(
      (n) => n.id === otherRegionId && !n.impassable,
    );
  }

  isWithinNRegionsOf(regionId: WotrRegionId, maxDistance: number): boolean {
    const reachable = this.regionStore.reachableRegions(
      this.regionId,
      maxDistance,
    );
    return reachable.includes(regionId);
  }

  adjacentRegions(): WotrRegionQuery[] {
    const region = this.regionStore.region(this.regionId);
    return region.neighbors
      .filter((n) => !n.impassable)
      .map((n) => this.query(n.id));
  }

  reachableRegions(
    progress: number,
    canEnter?: (region: WotrRegionQuery, distance: number) => boolean,
    canLeave?: (region: WotrRegionQuery, distance: number) => boolean,
  ): WotrRegionQuery[] {
    return this.regionStore
      .reachableRegions(
        this.regionId,
        progress,
        canEnter ? (r) => canEnter(this.query(r.id), progress) : undefined,
        canLeave ? (r) => canLeave(this.query(r.id), progress) : undefined,
      )
      .map((r) => this.query(r));
  }

  isStronghold(): boolean {
    return this.region().settlement === 'stronghold';
  }

  isCity(): boolean {
    return this.region().settlement === 'city';
  }

  isFreePeoplesRegion(): boolean {
    return this.region().frontId === 'free-peoples';
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

  hasArmy(frontId: WotrFrontId): boolean {
    return this.army(frontId) != undefined;
  }

  army(frontId: WotrFrontId): WotrArmy | undefined {
    const region = this.regionStore.region(this.regionId);
    const a = region.army;
    if (a?.front === frontId && !this.unitUtils.isEmptyArmy(a)) return a;
    const u = region.underSiegeArmy;
    if (u?.front === frontId && !this.unitUtils.isEmptyArmy(u)) return u;
    return undefined;
  }

  hasArmyNotUnderSiege(frontId: WotrFrontId): boolean {
    return this.armyNotUnderSiege(frontId) != undefined;
  }

  armyNotUnderSiege(frontId: WotrFrontId): WotrArmy | undefined {
    const region = this.regionStore.region(this.regionId);
    const a = region.army;
    if (a?.front === frontId && !this.unitUtils.isEmptyArmy(a)) return a;
    return undefined;
  }

  isBesiegedBy(frontId: WotrFrontId): boolean {
    const region = this.regionStore.region(this.regionId);
    if (!region.underSiegeArmy) return false;
    return region.underSiegeArmy.front !== frontId;
  }

  private regionArmies(): WotrArmy[] {
    const region = this.regionStore.region(this.regionId);
    const armies: WotrArmy[] = [];
    if (region.army) armies.push(region.army);
    if (region.underSiegeArmy) armies.push(region.underSiegeArmy);
    return armies;
  }

  hasRegularUnitsOfNation(nationId: WotrNationId): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army !== undefined &&
        this.unitUtils.hasRegularUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy !== undefined &&
        this.unitUtils.hasRegularUnitsOfNation(nationId, region.underSiegeArmy))
    );
  }

  hasEliteUnitsOfNation(nationId: WotrNationId): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army !== undefined &&
        this.unitUtils.hasEliteUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy !== undefined &&
        this.unitUtils.hasEliteUnitsOfNation(nationId, region.underSiegeArmy))
    );
  }

  hasArmyUnitsOfNation(nationId: WotrNationId): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army !== undefined &&
        this.unitUtils.hasArmyUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy !== undefined &&
        this.unitUtils.hasArmyUnitsOfNation(nationId, region.underSiegeArmy))
    );
  }

  hasLeadersOfNation(nationId: WotrNationId): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army !== undefined &&
        this.unitUtils.hasUnitsOfNation(nationId, region.army)) ||
      (region.underSiegeArmy !== undefined &&
        this.unitUtils.hasUnitsOfNation(nationId, region.underSiegeArmy))
    );
  }

  hasNazgul(): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army !== undefined && this.unitUtils.hasNazgul(region.army)) ||
      (region.underSiegeArmy !== undefined &&
        this.unitUtils.hasNazgul(region.underSiegeArmy)) ||
      (region.freeUnits !== undefined &&
        this.unitUtils.hasNazgul(region.freeUnits))
    );
  }

  hasCompanions(): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army !== undefined &&
        this.unitUtils.hasCompanions(region.army)) ||
      (region.underSiegeArmy !== undefined &&
        this.unitUtils.hasCompanions(region.underSiegeArmy)) ||
      (region.freeUnits !== undefined &&
        this.unitUtils.hasCompanions(region.freeUnits))
    );
  }

  companions(): WotrCompanionId[] {
    const region = this.regionStore.region(this.regionId);
    if (region.army && this.unitUtils.hasCompanions(region.army))
      return this.unitUtils.getCompanions(region.army);
    if (
      region.underSiegeArmy &&
      this.unitUtils.hasCompanions(region.underSiegeArmy)
    )
      return this.unitUtils.getCompanions(region.underSiegeArmy);
    if (region.freeUnits && this.unitUtils.hasCompanions(region.freeUnits))
      return this.unitUtils.getCompanions(region.freeUnits);
    return [];
  }

  hasMinions(): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      (region.army !== undefined && this.unitUtils.hasMinions(region.army)) ||
      (region.underSiegeArmy !== undefined &&
        this.unitUtils.hasMinions(region.underSiegeArmy)) ||
      (region.freeUnits !== undefined &&
        this.unitUtils.hasMinions(region.freeUnits))
    );
  }

  hasCharacter(characterId: WotrCharacterId): boolean {
    const region = this.regionStore.region(this.regionId);
    return (
      region.army?.characters?.includes(characterId) === true ||
      region.underSiegeArmy?.characters?.includes(characterId) === true ||
      region.freeUnits?.characters?.includes(characterId) === true
    );
  }

  hasFellowship(): boolean {
    const region = this.regionStore.region(this.regionId);
    return region.fellowship;
  }

  isUnconquered(): boolean {
    return this.regionStore.isUnconquered(this.regionId);
  }

  isUnderSiege(frontId: WotrFrontId): boolean {
    const region = this.region();
    return region.underSiegeArmy?.front === frontId;
  }
}
