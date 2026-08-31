import { computed, Injectable, signal } from '@angular/core';

export type TlsmDragonId = 'varthrax' | 'cadorus' | 'grilipus';

const DRAGON_IDS: TlsmDragonId[] = ['varthrax', 'cadorus', 'grilipus'];

export interface Pool {
  scales: {
    varthrax: number;
    cadorus: number;
    grilipus: number;
  };
  strikes: number;
  rages: number;
  slumbers: number;
}

export interface IAppState {
  varthrax: Dragon;
  cadorus: Dragon;
  grilipus: Dragon;
  pool: Pool;
  players: string[];
  settings: {
    scalesPerCrown: number;
    messagesLimit: number;
  };
  logs: {
    message: string;
    tokenSource: string;
  }[];
}

export interface Dragon {
  id: TlsmDragonId;
  name: string;
  crowned: boolean;
  nScales: number;
  imageSource: string;
  tokenSource: string;
}

export const INITIAL_STATE: IAppState = {
  varthrax: {
    id: 'varthrax',
    name: 'Varthrax',
    crowned: false,
    nScales: 0,
    imageSource: '../assets/talisman/varthrax-image.jpg',
    tokenSource: '../assets/talisman/varthrax-token.png',
  }, // varthrax
  cadorus: {
    id: 'cadorus',
    name: 'Cadorus',
    crowned: false,
    nScales: 0,
    imageSource: '../assets/talisman/cadorus-image.jpg',
    tokenSource: '../assets/talisman/cadorus-token.png',
  }, // cadorus
  grilipus: {
    id: 'grilipus',
    name: 'Grilipus',
    crowned: false,
    nScales: 0,
    imageSource: '../assets/talisman/grilipus-image.jpg',
    tokenSource: '../assets/talisman/grilipus-token.png',
  }, // grilipus
  pool: {
    scales: {
      varthrax: 40,
      cadorus: 40,
      grilipus: 40,
    }, // dragonTokens
    strikes: 6,
    rages: 6,
    slumbers: 8,
  }, // pool
  players: ['Leo', 'Nico', 'Cesco', 'Rob'],
  settings: {
    scalesPerCrown: 5,
    messagesLimit: 5,
  }, // settings
  logs: [],
};

@Injectable()
export class TlsmStore {
  private store = signal<IAppState>(INITIAL_STATE);

  public readonly players = computed(() => this.store().players);
  public readonly settings = computed(() => this.store().settings);
  public readonly dragons = computed(() =>
    DRAGON_IDS.map((id) => this.store()[id]),
  );
  public readonly pool = computed(() => this.store().pool);
  public readonly logs = computed(() => this.store().logs);
  public readonly king = computed(
    () => this.dragons().find((d) => d.crowned) ?? null,
  );

  dragon(dragonId: TlsmDragonId) {
    return this.store()[dragonId];
  }

  private update(_action: string, updater: (state: IAppState) => IAppState) {
    this.store.update(updater);
  }

  discardScale(dragonId: TlsmDragonId) {
    this.update('Discard scale', (s) => ({
      ...s,
      [dragonId]: {
        ...s[dragonId],
        nScales: s[dragonId].nScales - 1,
      },
    }));
  }

  saveOpt(players: string[], scalesPerCrown: number) {
    this.update('Save opt', (s) => ({
      ...s,
      players: players,
      settings: {
        ...s.settings,
        scalesPerCrown: scalesPerCrown,
      },
    }));
  }

  clearLog() {
    this.update('Clear log', (s) => ({
      ...s,
      logs: [],
    }));
  }

  resetScale(dragonId: string) {
    this.update('Reset scale', (s) => {
      switch (dragonId) {
        case 'varthrax':
          return { ...s, varthrax: { ...s.varthrax, nScales: 0 } };
        case 'cadorus':
          return { ...s, cadorus: { ...s.cadorus, nScales: 0 } };
        case 'grilipus':
          return { ...s, grilipus: { ...s.grilipus, nScales: 0 } };
        default:
          return s;
      }
    });
  }

  crown(dragonId: string, crown: boolean) {
    this.update('Reset scale', (s) => {
      switch (dragonId) {
        case 'varthrax':
          return { ...s, varthrax: { ...s.varthrax, crowned: crown } };
        case 'cadorus':
          return { ...s, cadorus: { ...s.cadorus, crowned: crown } };
        case 'grilipus':
          return { ...s, grilipus: { ...s.grilipus, crowned: crown } };
        default:
          return s;
      }
    });
  }

  addLog(message: string, tokenSource: string) {
    this.update('Reset scale', (s) => {
      return {
        ...s,
        logs: [...s.logs, { message: message, tokenSource: tokenSource }],
      };
    });
  }

  drawStrike() {
    this.update('Reset scale', (s) => {
      return { ...s, pool: { ...s.pool, strikes: s.pool.strikes - 1 } };
    });
  }

  drawRage() {
    this.update('Reset scale', (s) => {
      return { ...s, pool: { ...s.pool, rages: s.pool.rages - 1 } };
    });
  }

  drawSlumber() {
    this.update('Reset scale', (s) => {
      return { ...s, pool: { ...s.pool, slumbers: s.pool.slumbers - 1 } };
    });
  }

  drawScale(dragonId: string, resolved: boolean) {
    this.update('Reset scale', (s) => {
      switch (dragonId) {
        case 'varthrax':
          return {
            ...s,
            varthrax: {
              ...s.varthrax,
              nScales: s.varthrax.nScales + (resolved ? 1 : 0),
            },
            pool: {
              ...s.pool,
              scales: {
                ...s.pool.scales,
                varthrax: s.pool.scales.varthrax - 1,
              },
            },
          };
        case 'cadorus':
          return {
            ...s,
            cadorus: {
              ...s.cadorus,
              nScales: s.cadorus.nScales + (resolved ? 1 : 0),
            },
            pool: {
              ...s.pool,
              scales: { ...s.pool.scales, cadorus: s.pool.scales.cadorus - 1 },
            },
          };
        case 'grilipus':
          return {
            ...s,
            grilipus: {
              ...s.grilipus,
              nScales: s.grilipus.nScales + (resolved ? 1 : 0),
            },
            pool: {
              ...s.pool,
              scales: {
                ...s.pool.scales,
                grilipus: s.pool.scales.grilipus - 1,
              },
            },
          };
      }
      return s;
    });
  }
}
