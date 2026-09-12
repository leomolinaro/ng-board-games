import { Injectable } from '@angular/core';
import { immutableUtil, randomUtil } from '@leobg/commons/utils';
import type {
  WotrRegion,
  WotrRegionId,
} from '../../../region/wotr-region-models';
import type { WotrMapPoint, WotrRegionSlots } from './wotr-map.service';

interface WotrRegionPoints {
  innerPoints: WotrMapRegionPoint[];
  outerBorderPoints: WotrMapPoint[];
}

interface WotrMapRegionPoint {
  x: number;
  y: number;
  centralEnergy: number;
  regionId: WotrRegionId;
  neighbours: WotrMapRegionPoint[];
}

const MAX_SLOTS = 5;

@Injectable()
export class WotrMapSlotsGenerator {
  private neighbourDirections: { x: number; y: number }[] = [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: -1 },
  ];

  generateSlots(
    regions: WotrRegion[],
    xMax: number,
    yMax: number,
    coordinatesToAreaId: (x: number, y: number) => WotrRegionId | null,
  ): WotrRegionSlots {
    const areaSlots: Partial<
      Record<WotrRegionId, Record<number, WotrMapPoint[]>>
    > = {};
    const regionPointsById = this.generateRegionPoints(
      regions,
      xMax,
      yMax,
      coordinatesToAreaId,
    );

    for (const region of regions) {
      const regionPoints = regionPointsById[region.id];
      if (!regionPoints)
        throw new Error(`Region points not found for region ${region.id}`);
      const regionSlots: Record<number, WotrMapPoint[]> = {};
      for (let i = 1; i <= MAX_SLOTS; i++) {
        const slots = this.generateRegionSlots(i, regionPoints, region.id);
        regionSlots[i] = slots;
      }
      areaSlots[region.id] = regionSlots;
    }

    return areaSlots as WotrRegionSlots;
  }

  private generateRegionPoints(
    regions: WotrRegion[],
    xMax: number,
    yMax: number,
    coordinatesToAreaId: (x: number, y: number) => WotrRegionId | null,
  ) {
    const regionPointsById: Partial<Record<WotrRegionId, WotrRegionPoints>> =
      {};
    const regionPointByYByX: Record<
      number,
      Record<number, WotrMapRegionPoint>
    > = {};

    this.collectRegionPoints(
      xMax,
      yMax,
      coordinatesToAreaId,
      regionPointsById,
      regionPointByYByX,
    );
    this.calculateBordersAndNeighbours(
      regions,
      regionPointsById,
      regionPointByYByX,
    );
    this.calculateCentralEnergies(regions, regionPointsById);

    return regionPointsById;
  }

  private collectRegionPoints(
    xMax: number,
    yMax: number,
    coordinatesToAreaId: (x: number, y: number) => WotrRegionId | null,
    regionPointsById: Partial<Record<WotrRegionId, WotrRegionPoints>>,
    regionPointByYByX: Record<number, Record<number, WotrMapRegionPoint>>,
  ) {
    for (let x = 0; x < xMax; x++) {
      for (let y = 0; y < yMax; y++) {
        const areaId = coordinatesToAreaId(x, y);
        if (!areaId) continue;
        const regionPoint: WotrMapRegionPoint = {
          centralEnergy: 0,
          regionId: areaId,
          neighbours: [],
          x,
          y,
        };
        const regionPointByY = (regionPointByYByX[x] ??= {});
        regionPointByY[y] = regionPoint;
        const regionPoints = (regionPointsById[areaId] ??= {
          innerPoints: [],
          outerBorderPoints: [],
        });
        regionPoints.innerPoints.push(regionPoint);
      }
    }
  }

  private calculateBordersAndNeighbours(
    regions: WotrRegion[],
    regionPointsById: Partial<Record<WotrRegionId, WotrRegionPoints>>,
    regionPointByYByX: Record<number, Record<number, WotrMapRegionPoint>>,
  ) {
    for (const region of regions) {
      const regionPoints = regionPointsById[region.id];
      if (!regionPoints)
        throw new Error(`Region points not found for region ${region.id}`);
      if (regionPoints.innerPoints.length < MAX_SLOTS)
        console.log(region, regionPoints);
      const points = regionPoints.innerPoints;
      const outerPoints: WotrMapPoint[] = [];
      const foundOuterPoints: Record<string, boolean> = {};
      for (const point of points) {
        const x = point.x;
        const y = point.y;
        for (const neighbourDirection of this.neighbourDirections) {
          const nX = x + neighbourDirection.x;
          const nY = y + neighbourDirection.y;
          const regionPoint = this.getRegionPointByCoordinates(
            nX,
            nY,
            regionPointByYByX,
          );
          let outerPoint: WotrMapPoint | null = null;
          if (regionPoint) {
            if (regionPoint.regionId === region.id) {
              point.neighbours.push(regionPoint);
            } else {
              outerPoint = regionPoint;
            }
          } else {
            outerPoint = { x: nX, y: nY };
          }
          if (outerPoint) {
            const key = outerPoint.x + '-' + outerPoint.y;
            if (!foundOuterPoints[key]) {
              outerPoints.push(outerPoint);
              foundOuterPoints[key] = true;
            }
          }
        }
      }
      regionPoints.outerBorderPoints = outerPoints;
    }
  }

  private calculateCentralEnergies(
    regions: WotrRegion[],
    regionPointsById: Partial<Record<WotrRegionId, WotrRegionPoints>>,
  ) {
    for (const region of regions) {
      const regionPoints = regionPointsById[region.id];
      if (!regionPoints)
        throw new Error(`Region points not found for region ${region.id}`);
      for (const innerPoint of regionPoints.innerPoints) {
        let cenralEnergy = 0;
        for (const outerBorderPoint of regionPoints.outerBorderPoints) {
          cenralEnergy += this.centralEnergy(innerPoint, outerBorderPoint);
        }
        innerPoint.centralEnergy = cenralEnergy;
      }
    }
  }

  private getRegionPointByCoordinates(
    x: number,
    y: number,
    regionPointByYByX: Record<number, Record<number, WotrMapRegionPoint>>,
  ): WotrMapRegionPoint | null {
    const regionPointByY = regionPointByYByX[x];
    if (!regionPointByY) {
      return null;
    }
    const regionPoint = regionPointByY[y];
    if (!regionPoint) {
      return null;
    }
    return regionPoint;
  }

  private centralEnergy(innerPoint: WotrMapPoint, outerPoint: WotrMapPoint) {
    return 1 / this.quadDistance(innerPoint, outerPoint);
  }

  private manyBodyEnergy(innerPoint1: WotrMapPoint, innerPoint2: WotrMapPoint) {
    return 2 / this.quadDistance(innerPoint1, innerPoint2);
  }

  private quadDistance(
    pointA: { x: number; y: number },
    pointB: { x: number; y: number },
  ) {
    return (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;
  }

  private generateRegionSlots(
    n: number,
    regionPoints: WotrRegionPoints,
    regionId: WotrRegionId,
  ): WotrMapPoint[] {
    const scenario = new randomUtil.BgSimulatedAnnealing<WotrMapRegionPoint[]>(
      (state) => this.energy(state),
      (state) => this.randomNeighbor(state, regionPoints, regionId),
    );
    let slots = randomUtil.getRandomElements(
      n,
      n + 1,
      regionPoints.innerPoints,
    );
    slots = scenario.run(slots, 0.1, 100);
    return slots.map((s) => ({ x: s.x, y: s.y }));
  }

  private energy(points: WotrMapRegionPoint[]) {
    let totEnergy = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      totEnergy += p1.centralEnergy;
      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j];
        totEnergy += this.manyBodyEnergy(p1, p2);
      }
    }
    return totEnergy;
  }

  private randomNeighbor(
    points: WotrMapRegionPoint[],
    regionPoints: WotrRegionPoints,
    regionId: WotrRegionId,
  ): WotrMapRegionPoint[] {
    const index = randomUtil.getRandomInteger(0, points.length);
    const oldPoint = points[index];
    let newPoint: WotrMapRegionPoint;
    const limit = 1000;
    if (oldPoint.neighbours.length > 0) {
      let i = 0;
      do {
        newPoint = randomUtil.getRandomElement(oldPoint.neighbours);
        i++;
      } while (points.includes(newPoint) && i < limit);
      if (i >= limit) {
        console.error('Loop!', regionId);
        newPoint = oldPoint;
      }
    } else {
      newPoint = randomUtil.getRandomElement(regionPoints.innerPoints);
    }
    return immutableUtil.listReplaceByIndex(index, newPoint, points);
  }
}
