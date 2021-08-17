import { Injectable } from "@angular/core";
import { forkJoin, Observable, ReplaySubject } from "rxjs";
import { mapTo, tap } from "rxjs/operators";
import { AgotCard, AgotFaction, AgotPack, AgotType } from "../agot.models";
import { AgotHttpService } from "./agot-http.service";

@Injectable ({
  providedIn: "root"
})
export class AgotDraftService {
  
  constructor (private http: AgotHttpService) { }
  
  private cards: AgotCard[] | null = null;

  private factions = new ReplaySubject<AgotFaction[]> ();
  private packs = new ReplaySubject<AgotPack[]> ();
  private types = new ReplaySubject<AgotType[]> ();

  factions$ = this.factions.asObservable ();
  packs$ = this.packs.asObservable ();
  types$ = this.types.asObservable ();

  load$ (): Observable<void> {
    return forkJoin ([
      this.http.getPacks ().pipe (
        tap (packs => this.packs.next (packs))
      ),
      this.http.getCards ().pipe (
        tap (cards => {
          this.cards = cards;
          const factions: AgotFaction[] = [];
          const factionIds: { [code: string]: boolean} = { };
          const types: AgotType[] = [];
          const typeIds: { [code: string]: boolean } = { };
          this.cards.forEach (card => {
            const factionCode = card.faction_code;
            if (!factionIds[factionCode]) {
              factionIds[factionCode] = true;
              factions.push ({ code: factionCode, name: card.faction_name });
            } // if
            const typeCode = card.type_code;
            if (!typeIds[typeCode]) {
              typeIds[typeCode] = true;
              types.push ({ code: typeCode, name: card.type_name });
            } // if
          });
          this.factions.next (factions);
          this.types.next (types);
        })
      )
    ]).pipe (mapTo (void 0));
  } // load

  private getTypeSort (type: string) {
    switch (type) {
      case "agenda": return 1;
      case "plot": return 2;
      case "character": return 3;
      case "attachment": return 4;
      case "location": return 5;
      case "event": return 6;
      default: return 0;
    } // switch
  } // getTypeSort

  generateDraft (nCards: number, types: string[], factions: string[], packs: string[], duplicates: boolean) {
    const poolCards = this.getPool (types, factions, packs);
    const draftCards = this.getRandom (poolCards, nCards, duplicates);
    draftCards?.sort ((a, b) => {
      const typeA = this.getTypeSort (a.type_code);
      const typeB = this.getTypeSort (b.type_code);
      let comparison = typeA - typeB;
      if (comparison !== 0) { return comparison; }
      const goldA = a.type_code === "plot" ? a.income : a.cost;
      const goldB = b.type_code === "plot" ? b.income : b.cost;
      comparison = goldA - goldB;
      if (comparison !== 0) { return comparison; }
      comparison = a.initiative - b.initiative;
      if (comparison !== 0) { return comparison; }
      return comparison;
    });
    return draftCards;
  }

  private getPool (types: string[], factions: string[], packs: string[]) {
    const typeIds: { [id: string]: boolean } = { };
    const factionIds: { [id: string]: boolean } = { };
    const packIds: { [id: string]: boolean } = { };
    types.forEach (id => typeIds[id] = true);
    factions.forEach (id => factionIds[id] = true);
    packs.forEach (id => packIds[id] = true);
    const poolCards: AgotCard[] = [];
    if (this.cards) {
      for (const card of this.cards) {
        if (typeIds[card.type_code] && packIds[card.pack_code] && factionIds[card.faction_code]) {
          poolCards.push (card);
        } // if
      } // for
    } // if
    return poolCards;
  } // getPool

  public getRandom<T> (array: T[], num: number, duplicates: boolean): T[] | null {
    if (num > array.length) { return null; }
    const copy = array.slice ();
    const result = [];
    if (duplicates) {
      while (num--) {
        const i = Math.floor (Math.random () * copy.length);
        const x = copy[i];
        result.push (x);
      } // while
    } else {
      while (num--) {
        const i = Math.floor (Math.random () * copy.length);
        const x = copy.splice (i, 1);
        result.push (x[0]);
      } // while
    } // if - else
    return result;
  } // getRandom

} // AgotDraftService
