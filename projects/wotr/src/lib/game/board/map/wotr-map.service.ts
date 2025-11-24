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

const controlMarkerPoints: Partial<Record<WotrRegionId, WotrMapPoint>> = {
  "ered-luin": { x: 133, y: 60 },
  "grey-havens": { x: 123, y: 88 },
  "bree": { x: 221, y: 58 },
  "the-shire": { x: 171, y: 80 },
  "angmar": { x: 221, y: 4 },
  "mount-gundabad": { x: 285, y: 8 },
  "rivendell": { x: 288, y: 47 },
  "moria": { x: 310, y: 103 },
  "north-dunland": { x: 266, y: 150 },
  "south-dunland": { x: 261, y: 176 },
  "orthanc": { x: 273, y: 202 },
  "lorien": { x: 317, y: 132 },
  "helms-deep": { x: 285, y: 238 },
  "westemnet": { x: 327, y: 219 },
  "edoras": { x: 331, y: 243 },
  "folde": { x: 354, y: 233 },
  "dol-amroth": { x: 308, y: 302 },
  "lamedon": { x: 339, y: 282 },
  "pelargir": { x: 353, y: 321 },
  "lossarnach": { x: 369, y: 294 },
  "minas-tirith": { x: 381, y: 270 },
  "carrock": { x: 352, y: 50 },
  "dol-guldur": { x: 385, y: 137 },
  "woodland-realm": { x: 393, y: 60 },
  "dale": { x: 427, y: 70 },
  "erebor": { x: 428, y: 26 },
  "iron-hills": { x: 468, y: 30 },
  "north-rhun": { x: 498, y: 102 },
  "south-rhun": { x: 513, y: 189 },
  "morannon": { x: 461, y: 238 },
  "minas-morgul": { x: 456, y: 272 },
  "nurn": { x: 470, y: 321 },
  "barad-dur": { x: 507, y: 236 },
  "umbar": { x: 338, y: 381 },
  "near-harad": { x: 405, y: 389 },
  "far-harad": { x: 478, y: 360 }
};

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

  getControlMarkerPoint(regionId: WotrRegionId): WotrMapPoint | undefined {
    return controlMarkerPoints[regionId];
  }
}
