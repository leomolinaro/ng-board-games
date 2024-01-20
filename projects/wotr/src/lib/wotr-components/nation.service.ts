import { Injectable } from "@angular/core";
import { WotrNation, WotrNationId } from "./nation.models";

@Injectable ({
  providedIn: "root",
})
export class WotrNationComponentsService {

  constructor () {
    this.init ();
  }

  private readonly NATION_IDS: WotrNationId[] = [
    "dwarves", "elves", "gondor", "north", "rohan",
    "isengard", "sauron", "southrons"
  ];

  private readonly NATION: Record<WotrNationId, WotrNation> = {} as any;

  toMap<V> (getValue: (nationId: WotrNationId) => V): Record<WotrNationId, V> {
    const map: Record<WotrNationId, V> = { } as any;
    this.NATION_IDS.forEach (nationId => (map[nationId] = getValue (nationId)));
    return map;
  }
  get (nationId: WotrNationId): WotrNation { return this.NATION[nationId]; }
  
  private init () {
    this.initFreePeopleNation ("dwarves", "Dwarves", 5, 5, 4);
    this.initFreePeopleNation ("elves", "Elves", 5, 10, 4);
    this.initFreePeopleNation ("gondor", "Gondor", 15, 5, 4);
    this.initFreePeopleNation ("rohan", "Rohan", 10, 5, 4);
    this.initFreePeopleNation ("north", "The North", 10, 5, 4);
    this.initShadowNation ("isengard", "Isengard", 12, 6, 0);
    this.initShadowNation ("sauron", "Sauron", 36, 6, 8);
    this.initShadowNation ("southrons", "Southrons & Esterlings", 24, 6, 0);
  }

  private initFreePeopleNation (nationId: WotrNationId, name: string, nRegulars: number, nElites: number, nLeaders: number) {
    this.NATION[nationId] = {
      id: nationId, name, front: "free-peoples",
      nRegulars, nElites, nLeaders, nNazgul: 0
    };
  }

  private initShadowNation (nationId: WotrNationId, name: string, nRegulars: number, nElites: number, nNazgul: number) {
    this.NATION[nationId] = {
      id: nationId, name, front: "shadow",
      nRegulars, nElites, nLeaders: 0, nNazgul
    };
  }

}
