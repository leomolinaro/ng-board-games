import { Injectable } from "@angular/core";
import { WotrCompanion, WotrCompanionId } from "./nation.models";

@Injectable ({
  providedIn: "root",
})
export class WotrCompanionComponentsService {

  constructor () {
    this.init ();
  }

  private readonly COMPANION_IDS: WotrCompanionId[] = [
    "gandalf-the-grey", "strider", "boromir", "legolas",
    "gimli", "meriadoc", "peregrin", "aragorn", "gandalf-the-white"
  ];
  private readonly COMPANION: Record<WotrCompanionId, WotrCompanion> = {} as any;
  
  toMap<V> (getValue: (companionId: WotrCompanionId) => V): Record<WotrCompanionId, V> {
    const map: Record<WotrCompanionId, V> = { } as any;
    this.COMPANION_IDS.forEach (companionId => (map[companionId] = getValue (companionId)));
    return map;
  }
  get (companionId: WotrCompanionId): WotrCompanion { return this.COMPANION[companionId]; }
  getAllIds () { return this.COMPANION_IDS; }

  private init () {
    this.initCompanion ("gandalf-the-grey", "gandalf-the-grey", 3, 1);
    this.initCompanion ("strider", "strider", 3, 1);
    this.initCompanion ("boromir", "boromir", 2, 1);
    this.initCompanion ("legolas", "legolas", 2, 1);
    this.initCompanion ("gimli", "gimli", 2, 1);
    this.initCompanion ("meriadoc", "meriadoc", 1, 1);
    this.initCompanion ("peregrin", "peregrin", 1, 1);
    this.initCompanion ("aragorn", "aragorn", 3, 2);
    this.initCompanion ("gandalf-the-white", "gandalf-the-white", 3, 1);
  }

  private initCompanion (
    id: WotrCompanionId, name: string,
    level: number, leadership: number
  ) {
    this.COMPANION[id] = { id, name, level, leadership };
  }

}
