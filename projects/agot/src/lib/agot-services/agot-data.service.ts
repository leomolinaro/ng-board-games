import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable } from "rxjs";
import { map, mapTo, tap } from "rxjs/operators";
import {
  AgotCard,
  AgotFaction,
  AgotPack,
  AgotPackCode,
  AgotType,
} from "../agot.models";
import { AgotHttpService } from "./agot-http.service";

@Injectable ({
  providedIn: "root",
})
export class AgotDataService {
  
  private http = inject (AgotHttpService);

  private cards: AgotCard[] | null = null;
  private cardMap: Record<string, AgotCard> = {};

  private officialPackCodes: Record<AgotPackCode, boolean> = {
    Core: true,
    WotN: true,
    LoCR: true,
    WotW: true,
    HoT: true,
    SoD: true,
    KotI: true,
    FotS: true,
    DotE: true,
    TtB: true,
    TRtW: true,
    TKP: true,
    NMG: true,
    CoW: true,
    TS: true,
    AtSK: true,
    CtA: true,
    FFH: true,
    TIMC: true,
    GoH: true,
    TC: true,
    AMAF: true,
    GtR: true,
    TFoA: true,
    TRW: true,
    OR: true,
    TBWB: true,
    TAK: true,
    JtO: true,
    Km: true,
    FotOG: true,
    TFM: true,
    SAT: true,
    TSC: true,
    TMoW: true,
    SoKL: true,
    MoD: true,
    IDP: true,
    DitD: true,
    AtG: true,
    CoS: true,
    PoS: true,
    BtRK: true,
    TB: true,
    LMHR: true,
  }; // officialPackCodes

  private $factions = new BehaviorSubject<AgotFaction[]> ([]);
  private $packs = new BehaviorSubject<AgotPack[]> ([]);
  private $types = new BehaviorSubject<AgotType[]> ([]);

  getFactions$ () {
    return this.$factions.asObservable ();
  }
  getPacks$ (options?: { onlyOfficial: boolean }) {
    return this.$packs
      .asObservable ()
      .pipe (map ((p) => this.filterPacks (p, options)));
  }
  getTypes$ () {
    return this.$types.asObservable ();
  }

  getCards (options?: { onlyOfficial: boolean }) {
    return this.filterCards (this.cards!, options);
  }
  getPacks (options?: { onlyOfficial: boolean }) {
    return this.filterPacks (this.$packs.getValue (), options);
  }
  getCard (cardCode: string) {
    return this.cardMap[cardCode];
  }
  getFactions () {
    return this.$factions.getValue ();
  }

  // getPacks (options?: { onlyOfficial: boolean }) { this.$packs.._getNow () }

  private filterCards (cards: AgotCard[], options?: { onlyOfficial: boolean }) {
    if (options) {
      if (options.onlyOfficial) {
        return cards.filter ((c) => this.officialPackCodes[c.pack_code]);
      } // if
    } // if
    return cards;
  } // filterPacks

  private filterPacks (packs: AgotPack[], options?: { onlyOfficial: boolean }) {
    if (options) {
      if (options.onlyOfficial) {
        return packs.filter ((p) => this.officialPackCodes[p.code]);
      } // if
    } // if
    return packs;
  } // filterPacks

  load$ (): Observable<void> {
    return forkJoin ([
      this.http.getPacks ().pipe (tap ((packs) => this.$packs.next (packs))),
      this.http.getCards ().pipe (
        tap ((cards) => {
          const factions: AgotFaction[] = [];
          const factionIds: { [code: string]: boolean } = {};
          const types: AgotType[] = [];
          const typeIds: { [code: string]: boolean } = {};
          cards.forEach ((card) => {
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
            this.cardMap[card.code] = card;
          });
          this.$factions.next (factions);
          this.$types.next (types);
          this.cards = cards;
        })
      ),
    ]).pipe (mapTo (void 0));
  } // load
} // AgotDataService
