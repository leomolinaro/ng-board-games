import { Injectable, inject } from "@angular/core";
import { immutableUtil, randomUtil } from "@leobg/commons/utils";
import { WotrRegionId } from "../../wotr-components/region.models";
import { WotrRegionComponentsService } from "../../wotr-components/region.service";
import { WotrMapPoint, WotrRegionSlots } from "./wotr-map.service";

interface WotrRegionPoints {
  innerPoints: WotrMapRegionPoint[];
  outerBorderPoints: WotrMapPoint[];
} // WotrRegionPoints

interface WotrMapRegionPoint {
  x: number;
  y: number;
  centralEnergy: number;
  regionId: WotrRegionId;
  neighbours: WotrMapRegionPoint[];
} // WotrMapRegionPoint

const MAX_SLOTS = 5;

@Injectable ({
  providedIn: "root",
})
export class WotrMapSlotsGeneratorService {
  
  private regions = inject (WotrRegionComponentsService);

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

  generateSlots (xMax: number, yMax: number, coordinatesToAreaId: (x: number, y: number) => WotrRegionId | null): WotrRegionSlots {
    const areaSlots: Record<WotrRegionId, Record<number, WotrMapPoint[]>> = {} as any;
    const regionPointsById = this.generateRegionPoints (xMax, yMax, coordinatesToAreaId);

    for (const regionId of this.regions.getAllIds ()) {
      const regionPoints = regionPointsById[regionId];
      const regionSlots: Record<number, WotrMapPoint[]> = {};
      for (let i = 1; i <= MAX_SLOTS; i++) {
        const slots = this.generateRegionSlots (i, regionPoints, regionId);
        regionSlots[i] = slots;
      } // for
      areaSlots[regionId] = regionSlots;
    } // for

    return areaSlots;
  } // generateSlots

  private generateRegionPoints (xMax: number, yMax: number, coordinatesToAreaId: (x: number, y: number) => WotrRegionId | null) {
    const regionPointsById: Record<WotrRegionId, WotrRegionPoints> = {} as any;
    const regionPointByYByX: Record<number, Record<number, WotrMapRegionPoint>> = {};

    // Calcolo i punti interni e la mappa dei punti by coordinates.
    for (let x = 0; x < xMax; x++) {
      for (let y = 0; y < yMax; y++) {
        const areaId = coordinatesToAreaId (x, y);
        if (areaId) {
          const regionPoint: WotrMapRegionPoint = {
            centralEnergy: 0,
            regionId: areaId,
            neighbours: [],
            x: x,
            y: y,
          };
          let regionPointByY = regionPointByYByX[x];
          if (!regionPointByY) {
            regionPointByY = {};
            regionPointByYByX[x] = regionPointByY;
          } // if
          regionPointByY[y] = regionPoint;
          let regionPoints = regionPointsById[areaId];
          if (!regionPoints) {
            regionPoints = {
              innerPoints: [],
              outerBorderPoints: [],
            };
            regionPointsById[areaId] = regionPoints;
          } // if
          regionPoints.innerPoints.push (regionPoint);
        } // if
      } // for
    } // for

    // Calcolo i punti esterni di confine di ogni area e i vicini di ogni punto interno.
    for (const regionId of this.regions.getAllIds ()) {
      const regionPoints = regionPointsById[regionId];
      if (regionPoints.innerPoints.length < MAX_SLOTS) {
        console.log (regionId, regionPoints)
      }
      const points = regionPoints.innerPoints;
      const outerPoints: WotrMapPoint[] = [];
      const foundOuterPoints: Record<string, boolean> = {};
      for (const point of points) {
        const x = point.x;
        const y = point.y;
        for (const neighbourDirection of this.neighbourDirections) {
          const nX = x + neighbourDirection.x;
          const nY = y + neighbourDirection.y;
          const regionPoint = this.getRegionPointByCoordinates (nX, nY, regionPointByYByX);
          let outerPoint: WotrMapPoint | null = null;
          if (regionPoint) {
            if (regionPoint.regionId === regionId) {
              point.neighbours.push (regionPoint);
            } else {
              outerPoint = regionPoint;
            } // if - else
          } else {
            outerPoint = { x: nX, y: nY };
          } // if - else
          if (outerPoint) {
            const key = outerPoint.x + "-" + outerPoint.y;
            if (!foundOuterPoints[key]) {
              outerPoints.push (outerPoint);
              foundOuterPoints[key] = true;
            } // if
          } // if
        } // for
      } // for
      regionPoints.outerBorderPoints = outerPoints;
    } // for

    // Calcolo l'energia "centrale", ovvero l'energia dei punti inversamente proporzionale alla distanza dal confine.
    for (const regionId of this.regions.getAllIds ()) {
      const regionPoints = regionPointsById[regionId];
      for (const innerPoint of regionPoints.innerPoints) {
        let cenralEnergy = 0;
        for (const outerBorderPoint of regionPoints.outerBorderPoints) {
          cenralEnergy += this.centralEnergy (innerPoint, outerBorderPoint);
        } // for
        innerPoint.centralEnergy = cenralEnergy;
      } // for
    } // for

    return regionPointsById;
  } // generateRegionPoints

  private getRegionPointByCoordinates (x: number, y: number, regionPointByYByX: Record<number, Record<number, WotrMapRegionPoint>>): WotrMapRegionPoint | null {
    const regionPointByY = regionPointByYByX[x];
    if (!regionPointByY) { return null; }
    const regionPoint = regionPointByY[y];
    if (!regionPoint) { return null; }
    return regionPoint;
  } // getRegionPointByCoordinates

  private centralEnergy (innerPoint: WotrMapPoint, outerPoint: WotrMapPoint) {
    return 1 / this.quadDistance (innerPoint, outerPoint);
  } // centralEnergy

  private manyBodyEnergy (innerPoint1: WotrMapPoint, innerPoint2: WotrMapPoint) {
    return 2 / this.quadDistance (innerPoint1, innerPoint2);
  } // manyBodyEnergy

  private quadDistance (pointA: { x: number; y: number }, pointB: { x: number; y: number }) {
    return (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;
  } // quadDistance

  private generateRegionSlots (n: number, regionPoints: WotrRegionPoints, regionId: WotrRegionId): WotrMapPoint[] {
    const simulation = new randomUtil.BgSimulatedAnnealing<WotrMapRegionPoint[]> (
      (state) => this.energy (state),
      (state) => this.randomNeighbor (state, regionPoints, regionId)
    );
    let slots = randomUtil.getRandomElements (n, n + 1, regionPoints.innerPoints);
    slots = simulation.run (slots, 0.1, 100);
    return slots.map ((s) => ({ x: s.x, y: s.y }));
  } // generateRegionSlots

  private energy (points: WotrMapRegionPoint[]) {
    let totEnergy = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      totEnergy += p1.centralEnergy;
      for (let j = i + 1; j < points.length; j++) {
        const p2 = points[j];
        totEnergy += this.manyBodyEnergy (p1, p2);
      } // for
    } // for
    return totEnergy;
  } // energy

  private randomNeighbor (points: WotrMapRegionPoint[], regionPoints: WotrRegionPoints, regionId: WotrRegionId): WotrMapRegionPoint[] {
    const index = randomUtil.getRandomInteger (0, points.length);
    const oldPoint = points[index];
    let newPoint: WotrMapRegionPoint;
    const limit = 1000;
    if (oldPoint.neighbours.length) {
      let i = 0;
      do {
        newPoint = randomUtil.getRandomElement (oldPoint.neighbours);
        i++;
      } while (points.includes (newPoint) && i < limit);
      if (i >= limit) {
        console.error ("Loop!", regionId);
        newPoint = oldPoint;
      } // if
    } else {
      newPoint = randomUtil.getRandomElement (regionPoints.innerPoints);
    } // if - else
    return immutableUtil.listReplaceByIndex (index, newPoint, points);
  } // randomNeighbor

} // WotrMapSlotsGeneratorService
