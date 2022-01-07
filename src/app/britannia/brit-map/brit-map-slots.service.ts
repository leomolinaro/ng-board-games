import { Injectable } from '@angular/core';
import { immutableUtil, randomUtil } from "@bg-utils";
import { BgSimulatedAnnealing } from "src/app/bg-utils/random.util";
import { BRIT_LAND_AREAS } from "../brit-constants";
import { BritAreaId, BritLandAreaId, BritPopulation, BritSeaAreaId, isBritLandAreaId } from "../brit-models";

interface BritLandAreaProp {
  id: BritLandAreaId;
  innerPoints: BritMapLandPoint[];
  outerBorderPoints: BritMapPoint[];
  slotsByN: Record<number, BritMapLandPoint[]>;
} // BritLandAreaProp

interface BritSeaAreaProp {
  slotsByN: Record<number, BritMapSeaPoint[]>;
} // BritSeaAreaProp

export interface BritMapPoint {
  x: number;
  y: number;
} // BritMapPoint

interface BritMapLandPoint extends BritMapPoint {
  x: number;
  y: number;
  centralEnergy: number;
  landId: BritLandAreaId;
  neighbours: BritMapLandPoint[];
} // BritMapLandPoint

export type BritMapSeaPoint = BritMapPoint;

const BRIT_SEA_GRID: Record<BritSeaAreaId, { startX: number; startY: number; width: number }> = {
  "atlantic-ocean": { startX: 5, startY: 41, width: 6 },
  "english-channel": { startX: 23, startY: 57, width: 8 },
  "frisian-sea": { startX: 30, startY: 37, width: 6 },
  "icelandic-sea": { startX: 22, startY: 5, width: 5 },
  "irish-sea": { startX: 1, startY: 23, width: 5 },
  "north-sea": { startX: 25, startY: 20, width: 6 }
} // BRIT_SEA_GRID

const BRIT_POPULATION_START_Y = 61;
const BRIT_POPULATION_START_WIDTH = 3;
const BRIT_POPULATION_START_X: Record<BritPopulation, number> = {
  0: 11.8, 1: 15.04, 2: 18.28, 3: 21.52, 4: 24.79, 5: 28
};

@Injectable({
  providedIn: 'root'
})
export class BritMapSlotsService {

  constructor() { }

  private landPropById: Record<BritLandAreaId, BritLandAreaProp> = { } as any;
  private seaPropById: Record<BritSeaAreaId, BritSeaAreaProp> = {
    "atlantic-ocean": { slotsByN: { } as any },
    "english-channel": { slotsByN: { } as any },
    "frisian-sea": { slotsByN: { } as any },
    "icelandic-sea": { slotsByN: { } as any },
    "irish-sea": { slotsByN: { } as any },
    "north-sea": { slotsByN: { } as any },
  };
  private landPointByYByX: Record<number, Record<number, BritMapLandPoint>> = { };

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

  generateSlots (xMax: number, yMax: number, coordinatesToAreaId: (x: number, y: number) => BritAreaId | null) {
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
            y: y
          };
          let landPointByY = this.landPointByYByX[x];
          if (!landPointByY) { landPointByY = { }; this.landPointByYByX[x] = landPointByY; }
          landPointByY[y] = landPoint;
          let landProp = this.landPropById[areaId];
          if (!landProp) {
            landProp = {
              id: areaId,
              innerPoints: [],
              outerBorderPoints: [],
              slotsByN: { } as any
            };
            this.landPropById[areaId] = landProp;
          } // if
          landProp.innerPoints.push (landPoint);
        } // if
      } // for
    } // for

    // Calcolo i punti esterni di confine di ogni area e i vicini di ogni punto interno.
    for (const landId of BRIT_LAND_AREAS) {
      const landProp = this.landPropById[landId];
      const points = landProp.innerPoints;
      const outerPoints: BritMapPoint[] = [];
      const foundOuterPoints: Record<string, boolean> = { };
      for (const point of points) {
        const x = point.x;
        const y = point.y;
        for (const neighbourDirection of this.neighbourDirections) {
          const nX = x + neighbourDirection.x;
          const nY = y + neighbourDirection.y;
          const landPoint = this.getLandPointByCoordinates (nX, nY);
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
      landProp.outerBorderPoints = outerPoints;
    } // for

    // Calcolo l'energia "centrale", ovvero l'energia dei punti inversamente proporzionale alla distanza dal confine.
    for (const landId of BRIT_LAND_AREAS) {
      const landProp = this.landPropById[landId];
      for (const innerPoint of landProp.innerPoints) {
        let cenralEnergy = 0;
        for (const outerBorderPoint of landProp.outerBorderPoints) {
          cenralEnergy += this.centralEnergy (innerPoint, outerBorderPoint);
        } // for
        innerPoint.centralEnergy = cenralEnergy;
      } // for
    } // for

  } // generateSlots

  private getLandPointByCoordinates (x: number, y: number): BritMapLandPoint | null {
    const landPointByY = this.landPointByYByX[x];
    if (!landPointByY) { return null; }
    const landPoint = landPointByY[y];
    if (!landPoint) { return null; }
    return landPoint;
  } // getLandPointByCoordinates

  private centralEnergy (innerPoint: BritMapPoint, outerPoint: BritMapPoint) {
    return 1 / this.quadDistance (innerPoint, outerPoint);
  } // centralEnergy

  private manyBodyEnergy (innerPoint1: BritMapPoint, innerPoint2: BritMapPoint) {
    return 2 / this.quadDistance (innerPoint1, innerPoint2);
  } // manyBodyEnergy

  private quadDistance (pointA: { x: number; y: number }, pointB: { x: number; y: number }) {
    return (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;
  } // quadDistance

  getLandInnerPoints (landId: BritLandAreaId): BritMapLandPoint[] {
    return this.landPropById[landId].innerPoints;
  } // getLandInnerPoints

  getLandBorderPoints (landId: BritLandAreaId): BritMapPoint[] {
    return this.landPropById[landId].outerBorderPoints;
  } // getLandBorderPoints

  getAreaSlots (n: number, areaId: BritAreaId) {
    if (isBritLandAreaId (areaId)) {
      const landProp = this.landPropById[areaId];
      let slots = landProp.slotsByN[n];
      if (!slots) {
        const simulation = new BgSimulatedAnnealing<BritMapLandPoint[]> (
          state => this.energy (state),
          state => this.randomNeighbor (state, landProp)
        );
        slots = randomUtil.getRandomElements (n, n + 1, landProp.innerPoints);
        slots = simulation.run (slots, 0.1, 100);
        landProp.slotsByN[n] = slots;
      } // if
      return slots;
    } else {
      const seaProp = this.seaPropById[areaId];
      let slots = seaProp.slotsByN[n];
      if (!slots) {
        const seaGrid = BRIT_SEA_GRID[areaId];
        slots = [];
        for (let i = 0; i < n; i++) {
          const x = seaGrid.startX + (i % seaGrid.width);
          const y = seaGrid.startY + Math.floor (i / seaGrid.width);
          slots.push ({ x, y })
        } // for
        seaProp.slotsByN[n] = slots;
      } // if
      return slots;
    } // if - else
  } // getAreaSlots

  getPopulationX (population: BritPopulation, index: number): number {
    const startX = BRIT_POPULATION_START_X[population];
    return startX + (index % BRIT_POPULATION_START_WIDTH);
  } // getPopulationX

  getPopulationY (population: BritPopulation, index: number): number {
    return BRIT_POPULATION_START_Y + Math.floor (index / BRIT_POPULATION_START_WIDTH);
  } // getPopulationY

  private energy (points: BritMapLandPoint[]) {
    let totEnergy = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      totEnergy += p1.centralEnergy;
      for (let j = (i + 1); j < points.length; j++) {
        const p2 = points[j];
        totEnergy += this.manyBodyEnergy (p1, p2);
      } // for
    } // for
    return totEnergy;
  } // energy

  private randomNeighbor (
    points: BritMapLandPoint[],
    landProp: BritLandAreaProp,
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
        console.error ("Loop!");
        newPoint = oldPoint;
      } // if
    } else {
      newPoint = randomUtil.getRandomElement (landProp.innerPoints);
    } // if - else
    return immutableUtil.listReplaceByIndex (index, newPoint, points);
  } // randomNeighbor

} // BritMapSlotsService
