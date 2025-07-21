import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { WotrAssetsStore } from "../../../assets/wotr-assets-store";
import { WotrRegionId } from "../../../region/wotr-region-models";

export type WotrRegionSlots = Record<WotrRegionId, Record<number, WotrMapPoint[]>>;

export interface WotrMapPoint {
  x: number;
  y: number;
}

@Injectable({
  providedIn: "root"
})
export class WotrMapService {
  private http = inject(HttpClient);
  private assets = inject(WotrAssetsStore);

  private svgLoaded = false;
  private regionPaths!: { [id in WotrRegionId]: string };
  private strongholdPaths!: Partial<{ [id in WotrRegionId]: string }>;
  private viewBox!: string;
  private width!: number;
  private regionSlots!: WotrRegionSlots;

  getRegionPath(regionId: WotrRegionId) {
    return this.regionPaths[regionId];
  }
  getStrongholdPath(regionId: WotrRegionId) {
    return this.strongholdPaths[regionId];
  }

  getViewBox() {
    return this.viewBox;
  }

  getWidth() {
    return this.width;
  }

  loadMapPaths$() {
    if (this.svgLoaded) {
      return of(true);
    }
    return this.http.get(this.assets.mapSvgSource(), { responseType: "text" }).pipe(
      map(response => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(response, "application/xml");
        const svg = dom.getElementsByTagName("svg").item(0)!;
        this.viewBox = svg.getAttribute("viewBox")!;
        this.width = +this.viewBox.split(" ")[2];
        this.regionPaths = this.getGroupPaths<WotrRegionId>(
          "wotr-regions",
          dom,
          pId => pId as WotrRegionId
        );
        this.strongholdPaths = this.getGroupPaths<WotrRegionId>(
          "wotr-strongholds",
          dom,
          pId => pId.replace("stronghold-", "") as WotrRegionId
        );
        this.svgLoaded = true;
        return true;
      })
    );
  }

  private getGroupPaths<K extends string | number>(
    groupId: string,
    dom: Document,
    pathIdToId: (pathId: string) => K
  ) {
    const wotrGroup = dom.getElementById(groupId);
    const paths: Record<K, string> = {} as any;
    wotrGroup?.childNodes.forEach(childNode => {
      if (childNode.nodeName === "path") {
        const pathElement = childNode as SVGPathElement;
        const pathId = pathElement.getAttribute("id")!;
        const id = pathIdToId(pathId);
        const pathD = pathElement.getAttribute("d")!;
        paths[id] = pathD;
      }
    });
    return paths;
  }

  loadRegionSlots$(): Observable<boolean> {
    return this.http.get(this.assets.mapSlotsPath(), { responseType: "text" }).pipe(
      map(response => {
        this.regionSlots = JSON.parse(response);
        return true;
      })
    );
  }

  getRegionSlots(n: number, regionId: WotrRegionId): WotrMapPoint[] {
    return this.regionSlots[regionId][n];
  }
}
