import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { tap } from "rxjs/operators";
import { BritAreaId } from "../brit-models";

@Injectable ({
  providedIn: "root"
})
export class BritMapService {

  constructor (
    private http: HttpClient
  ) { }

  private areaPaths!: { [id in BritAreaId]: string };
  private viewBox!: string;

  getPath (areaId: BritAreaId) {
    return this.areaPaths[areaId];
  } // getPath

  getViewBox () { return this.viewBox; }

  loadAreaPaths$ () {
    if (this.areaPaths) {
      return of (this.areaPaths);
    } else {
      return this.http.get ("assets/britannia/britannia-map.svg", { responseType: "text" }).pipe (
        tap (response => {
          const parser = new DOMParser ();
          const dom = parser.parseFromString (response, "application/xml");
          const svg = dom.getElementsByTagName ("svg").item (0)!;
          this.viewBox = svg.getAttribute ("viewBox")!;
          const britAreas = dom.getElementById ("brit-areas");
          this.areaPaths = { } as any;
          britAreas?.childNodes.forEach (childNode => {
            if (childNode.nodeName === "path") {
              const areaPath = childNode as SVGPathElement;
              const id = areaPath.getAttribute ("id")!;
              const areaId = id.replace (/_/g, "-") as BritAreaId;
              const areaD = areaPath.getAttribute ("d")!;
              this.areaPaths[areaId] = areaD;
            } // if
          });
        })
      );
    } // if - else
  } // loadAreaPaths$

} // BritMapService
