import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import { BRIT_ROUND_IDS } from "../brit-constants";
import { BritAreaId, BritNationId, BritPopulation, BritRoundId } from "../brit-models";

@Injectable ({
  providedIn: "root"
})
export class BritMapService {

  constructor (
    private http: HttpClient
  ) { }

  private svgLoaded = false;
  private areaPaths!: { [id in BritAreaId]: string };
  private populationTrackPaths!: { [id in BritPopulation]: string };
  private nationTurnPaths!: { [id in BritNationId]: string };
  private roundPaths!: { [id in BritRoundId]: string };
  private eventPaths!: { [id in BritRoundId]: { [id in BritNationId]: string } };
  private scoringRoundPaths!: { [id in BritRoundId]: string };
  private viewBox!: string;
  private width!: number;

  getAreaPath (areaId: BritAreaId) { return this.areaPaths[areaId]; }
  getPopulationTrackPath (populationId: BritPopulation) { return this.populationTrackPaths[populationId]; }
  getNationTurnPath (nationId: BritNationId) { return this.nationTurnPaths[nationId]; }
  getRoundPath (roundId: BritRoundId) { return this.roundPaths[roundId]; }
  getEventPath (roundId: BritRoundId, nationId: BritNationId) { return this.eventPaths[roundId][nationId]; }
  getScoringRoundPath (roundId: BritRoundId) { return this.scoringRoundPaths[roundId]; }

  getViewBox () { return this.viewBox; }

  getWidth () { return this.width; }

  loadAreaPaths$ () {
    if (this.svgLoaded) {
      return of (true);
    } else {
      return this.http.get ("assets/britannia/britannia-map.svg", { responseType: "text" }).pipe (
        map (response => {
          const parser = new DOMParser ();
          const dom = parser.parseFromString (response, "application/xml");
          const svg = dom.getElementsByTagName ("svg").item (0)!;
          this.viewBox = svg.getAttribute ("viewBox")!;
          this.width = +this.viewBox.split (" ")[2];
          this.areaPaths = this.getGroupPaths<BritAreaId> ("brit-areas", dom, pId => pId as BritAreaId);
          this.nationTurnPaths = this.getGroupPaths<BritNationId> ("brit-turns", dom, pId => pId.substring ("turn-".length) as BritNationId);
          this.populationTrackPaths = this.getGroupPaths<BritPopulation> ("brit-population-track", dom, pId => +pId.substring ("population-track-".length) as BritPopulation);
          this.roundPaths = this.getGroupPaths<BritRoundId> ("brit-rounds", dom, pId => +pId.substring ("round-".length) as BritRoundId);
          this.scoringRoundPaths = this.getGroupPaths<BritRoundId> ("brit-scoring-rounds", dom, pId => +(pId.substring ("round-".length).replace ("-scoring", "")) as BritRoundId);
          this.eventPaths = { } as any;
          for (const roundId of BRIT_ROUND_IDS) {
            const roundEventPaths = this.getGroupPaths<BritNationId> (`brit-round-${roundId}`, dom, pId => pId.substring (`round-${roundId}-`.length) as BritNationId);
            this.eventPaths[roundId] = roundEventPaths;
          } // for
          this.svgLoaded = true;
          return true;
        })
      );
    } // if - else
  } // loadAreaPaths$

  private getGroupPaths<K extends string | number> (groupId: string, dom: Document, pathIdToId: (pathId: string) => K) {
    const britGroup = dom.getElementById (groupId);
    const paths: Record<K, string> = { } as any;
    britGroup?.childNodes.forEach (childNode => {
      if (childNode.nodeName === "path") {
        const pathElement = childNode as SVGPathElement;
        const pathId = pathElement.getAttribute ("id")!;
        const id = pathIdToId (pathId);
        const pathD = pathElement.getAttribute ("d")!;
        paths[id] = pathD;
      } // if
    });
    return paths;
  } // getGroupPaths

} // BritMapService
