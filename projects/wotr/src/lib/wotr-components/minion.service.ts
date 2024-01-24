import { Injectable } from "@angular/core";
import { WotrMinion, WotrMinionId } from "./nation.models";

@Injectable ({
  providedIn: "root",
})
export class WotrMinionComponentsService {

  constructor () {
    this.init ();
  }

  readonly MINION_IDS: WotrMinionId[] = ["saruman", "the-mouth-of-sauron", "the-witch-king"];
  readonly MINION: Record<WotrMinionId, WotrMinion> = {} as any;
  
  toMap<V> (getValue: (minionId: WotrMinionId) => V): Record<WotrMinionId, V> {
    const map: Record<WotrMinionId, V> = { } as any;
    this.MINION_IDS.forEach (minionId => (map[minionId] = getValue (minionId)));
    return map;
  }
  get (minionId: WotrMinionId): WotrMinion { return this.MINION[minionId]; }
  getAllIds () { return this.MINION_IDS; }

  private init () {
    this.initMinion ("saruman", "Saruman", 0, 1);
    this.initMinion ("the-mouth-of-sauron", "The Mouth of Sauron", 3, 2);
    this.initMinion ("the-witch-king", "The Witch King", -1, 2);
  }

  private initMinion (
    id: WotrMinionId, name: string,
    level: number, leadership: number
  ) {
    this.MINION[id] = { id, name, level, leadership };
  }

}
