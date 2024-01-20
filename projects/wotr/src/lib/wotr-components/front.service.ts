import { Injectable } from "@angular/core";
import { WotrFront } from "./front.models";

@Injectable ({
  providedIn: "root",
})
export class WotrFrontComponentsService {

  private readonly FRONTS: WotrFront[] = ["free-peoples", "shadow"];
  getAll () { return this.FRONTS; }

  toMap<V> (getValue: (front: WotrFront) => V): Record<WotrFront, V> {
    const map: Record<WotrFront, V> = { } as any;
    this.FRONTS.forEach (f => (map[f] = getValue (f)));
    return map;
  }

}
