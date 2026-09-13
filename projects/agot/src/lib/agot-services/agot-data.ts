import { inject, Injectable, signal } from '@angular/core';
import type {
  AgotCard,
  AgotFaction,
  AgotPack,
  AgotPackCode,
  AgotType,
} from '../agot.models';
import { AgotHttp } from './agot-http';

@Injectable({
  providedIn: 'root',
})
export class AgotData {
  private http = inject(AgotHttp);

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
  };

  readonly factions = signal<AgotFaction[]>([]);
  readonly packs = signal<AgotPack[]>([]);
  readonly types = signal<AgotType[]>([]);

  getCards(options?: { onlyOfficial: boolean }): AgotCard[] {
    return this.filterCards(this.cards!, options);
  }
  getPacks(options?: { onlyOfficial: boolean }): AgotPack[] {
    return this.filterPacks(this.packs(), options);
  }
  getCard(cardCode: string): AgotCard | undefined {
    return this.cardMap[cardCode];
  }
  getFactions(): AgotFaction[] {
    return this.factions();
  }

  private filterCards(
    cards: AgotCard[],
    options?: { onlyOfficial: boolean },
  ): AgotCard[] {
    if (options?.onlyOfficial) {
      return cards.filter((c) => this.officialPackCodes[c.pack_code]);
    }
    return cards;
  }

  private filterPacks(
    packs: AgotPack[],
    options?: { onlyOfficial: boolean },
  ): AgotPack[] {
    if (options?.onlyOfficial) {
      return packs.filter((p) => this.officialPackCodes[p.code]);
    }
    return packs;
  }

  async load(): Promise<boolean> {
    const [packs, cards] = await Promise.all([
      this.http.getPacks(),
      this.http.getCards(),
    ]);
    this.packs.set(packs);

    const factions: AgotFaction[] = [];
    const factionIds: Record<string, boolean> = {};
    const types: AgotType[] = [];
    const typeIds: Record<string, boolean> = {};
    for (const card of cards) {
      const factionCode = card.faction_code;
      if (!factionIds[factionCode]) {
        factionIds[factionCode] = true;
        factions.push({ code: factionCode, name: card.faction_name });
      }
      const typeCode = card.type_code;
      if (!typeIds[typeCode]) {
        typeIds[typeCode] = true;
        types.push({ code: typeCode, name: card.type_name });
      }
      this.cardMap[card.code] = card;
    }
    this.factions.set(factions);
    this.types.set(types);
    this.cards = cards;
    return true;
  }
}
