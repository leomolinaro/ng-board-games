import { Injectable } from "@angular/core";
import { immutableUtil, randomUtil } from "@leobg/commons/utils";
import {
  BritAreaId,
  BritLandAreaId,
  BritSeaAreaId,
  isBritLandAreaId,
} from "../brit-components.models";
import { BritComponentsService } from "../brit-components.service";
import { BritAreaSlots, BritMapPoint } from "./brit-map.service";

interface BritLandPoints {
  innerPoints: BritMapLandPoint[];
  outerBorderPoints: BritMapPoint[];
} // BritLandPoints

interface BritMapLandPoint {
  x: number;
  y: number;
  centralEnergy: number;
  landId: BritLandAreaId;
  neighbours: BritMapLandPoint[];
} // BritMapLandPoint

export type BritMapSeaPoint = BritMapPoint;

const BRIT_SEA_GRID: Record<
BritSeaAreaId,
{ startX: number; startY: number; width: number }
> = {
  "atlantic-ocean": { startX: 5, startY: 41, width: 6 },
  "english-channel": { startX: 23, startY: 57, width: 8 },
  "frisian-sea": { startX: 30, startY: 37, width: 6 },
  "icelandic-sea": { startX: 22, startY: 5, width: 5 },
  "irish-sea": { startX: 1, startY: 23, width: 5 },
  "north-sea": { startX: 25, startY: 20, width: 6 },
}; // BRIT_SEA_GRID

@Injectable ({
  providedIn: "root",
})
export class BritMapSlotsGeneratorService {
  constructor (private components: BritComponentsService) {}

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

  generateSlots (
    xMax: number,
    yMax: number,
    coordinatesToAreaId: (x: number, y: number) => BritAreaId | null
  ): BritAreaSlots {
    const areaSlots: Record<
    BritAreaId,
    Record<number, BritMapPoint[]>
    > = {} as any;
    const landPointsById = this.generateLandPoints (
      xMax,
      yMax,
      coordinatesToAreaId
    );

    for (const landId of this.components.LAND_AREA_IDS) {
      const landPoints = landPointsById[landId];
      const landSlots: Record<number, BritMapPoint[]> = {};
      for (let i = 1; i <= 8; i++) {
        const slots = this.generateLandSlots (i, landPoints, landId);
        landSlots[i] = slots;
      } // for
      areaSlots[landId] = landSlots;
    } // for

    for (const seaId of this.components.SEA_AREA_IDS) {
      const seaSlots: Record<number, BritMapPoint[]> = {};
      for (let i = 1; i <= 30; i++) {
        const slots = this.generateSeaSlots (i, seaId);
        seaSlots[i] = slots;
      } // for
      areaSlots[seaId] = seaSlots;
    } // for

    return areaSlots;
  } // generateSlots

  private generateLandPoints (
    xMax: number,
    yMax: number,
    coordinatesToAreaId: (x: number, y: number) => BritAreaId | null
  ) {
    const landPointsById: Record<BritLandAreaId, BritLandPoints> = {} as any;
    const landPointByYByX: Record<
    number,
    Record<number, BritMapLandPoint>
    > = {};

    // Calcolo i punti interni e la mappa dei punti by coordinates.
    for (let x = 0; x < xMax; x++) {
      for (let y = 0; y < yMax; y++) {
        const areaId = coordinatesToAreaId (x, y);
        if (areaId && isBritLandAreaId (areaId)) {
          const landPoint: BritMapLandPoint = {
            centralEnergy: 0,
            landId: areaId,
            neighbours: [],
            x: x,
            y: y,
          };
          let landPointByY = landPointByYByX[x];
          if (!landPointByY) {
            landPointByY = {};
            landPointByYByX[x] = landPointByY;
          }
          landPointByY[y] = landPoint;
          let landPoints = landPointsById[areaId];
          if (!landPoints) {
            landPoints = {
              innerPoints: [],
              outerBorderPoints: [],
            };
            landPointsById[areaId] = landPoints;
          } // if
          landPoints.innerPoints.push (landPoint);
        } // if
      } // for
    } // for

    // Calcolo i punti esterni di confine di ogni area e i vicini di ogni punto interno.
    for (const landId of this.components.LAND_AREA_IDS) {
      const landPoints = landPointsById[landId];
      const points = landPoints.innerPoints;
      const outerPoints: BritMapPoint[] = [];
      const foundOuterPoints: Record<string, boolean> = {};
      for (const point of points) {
        const x = point.x;
        const y = point.y;
        for (const neighbourDirection of this.neighbourDirections) {
          const nX = x + neighbourDirection.x;
          const nY = y + neighbourDirection.y;
          const landPoint = this.getLandPointByCoordinates (
            nX,
            nY,
            landPointByYByX
          );
          let outerPoint: BritMapPoint | null = null;
          if (landPoint) {
            if (landPoint.landId === landId) {
              point.neighbours.push (landPoint);
            } else {
              outerPoint = landPoint;
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
      landPoints.outerBorderPoints = outerPoints;
    } // for

    // Calcolo l'energia "centrale", ovvero l'energia dei punti inversamente proporzionale alla distanza dal confine.
    for (const landId of this.components.LAND_AREA_IDS) {
      const landPoints = landPointsById[landId];
      for (const innerPoint of landPoints.innerPoints) {
        let cenralEnergy = 0;
        for (const outerBorderPoint of landPoints.outerBorderPoints) {
          cenralEnergy += this.centralEnergy (innerPoint, outerBorderPoint);
        } // for
        innerPoint.centralEnergy = cenralEnergy;
      } // for
    } // for

    return landPointsById;
  } // generateLandPoints

  private getLandPointByCoordinates (
    x: number,
    y: number,
    landPointByYByX: Record<number, Record<number, BritMapLandPoint>>
  ): BritMapLandPoint | null {
    const landPointByY = landPointByYByX[x];
    if (!landPointByY) {
      return null;
    }
    const landPoint = landPointByY[y];
    if (!landPoint) {
      return null;
    }
    return landPoint;
  } // getLandPointByCoordinates

  private centralEnergy (innerPoint: BritMapPoint, outerPoint: BritMapPoint) {
    return 1 / this.quadDistance (innerPoint, outerPoint);
  } // centralEnergy

  private manyBodyEnergy (innerPoint1: BritMapPoint, innerPoint2: BritMapPoint) {
    return 2 / this.quadDistance (innerPoint1, innerPoint2);
  } // manyBodyEnergy

  private quadDistance (
    pointA: { x: number; y: number },
    pointB: { x: number; y: number }
  ) {
    return (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;
  } // quadDistance

  private generateSeaSlots (
    n: number,
    seaAreaId: BritSeaAreaId
  ): BritMapPoint[] {
    const seaGrid = BRIT_SEA_GRID[seaAreaId];
    const slots: BritMapPoint[] = [];
    for (let i = 0; i < n; i++) {
      const x = seaGrid.startX + (i % seaGrid.width);
      const y = seaGrid.startY + Math.floor (i / seaGrid.width);
      slots.push ({ x, y });
    } // for
    return slots;
  } // generateSeaSlots

  private generateLandSlots (
    n: number,
    landPoints: BritLandPoints,
    landId: BritLandAreaId
  ): BritMapPoint[] {
    const simulation = new randomUtil.BgSimulatedAnnealing<BritMapLandPoint[]> (
      (state) => this.energy (state),
      (state) => this.randomNeighbor (state, landPoints, landId)
    );
    let slots = randomUtil.getRandomElements (n, n + 1, landPoints.innerPoints);
    slots = simulation.run (slots, 0.1, 100);
    return slots.map ((s) => ({ x: s.x, y: s.y }));
  } // generateLandSlots

  private energy (points: BritMapLandPoint[]) {
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

  private randomNeighbor (
    points: BritMapLandPoint[],
    landPoints: BritLandPoints,
    landId: BritLandAreaId
  ): BritMapLandPoint[] {
    const index = randomUtil.getRandomInteger (0, points.length);
    const oldPoint = points[index];
    let newPoint: BritMapLandPoint;
    if (oldPoint.neighbours.length) {
      let i = 0;
      do {
        newPoint = randomUtil.getRandomElement (oldPoint.neighbours);
        i++;
      } while (points.includes (newPoint) && i < 100);
      if (i >= 100) {
        console.error ("Loop!", landId);
        newPoint = oldPoint;
      } // if
    } else {
      newPoint = randomUtil.getRandomElement (landPoints.innerPoints);
    } // if - else
    return immutableUtil.listReplaceByIndex (index, newPoint, points);
  } // randomNeighbor
} // BritMapSlotsGeneratorService
