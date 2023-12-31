import { Injectable } from "@angular/core";
import { BgStore } from "@leobg/commons";

export type TlsmDragonId = "varthrax" | "cadorus" | "grilipus";

export interface IAppState {
  varthrax: IDragon;
  cadorus: IDragon;
  grilipus: IDragon;
  pool: {
    scales: {
      varthrax: number;
      cadorus: number;
      grilipus: number;
    }; // scales
    strikes: number;
    rages: number;
    slumbers: number;
  }; // pool
  players: string[];
  settings: {
    scalesPerCrown: number;
    messagesLimit: number;
  }; // settings
  logs: {
    message: string;
    tokenSource: string;
  }[];
} // IAppState

export interface IDragon {
  id: TlsmDragonId;
  name: string;
  crowned: boolean;
  nScales: number;
  imageSource: string;
  tokenSource: string;
} // IDragon

export interface IAppAction {
  type: string;
  data?: any;
} // IAppAction

export const INITIAL_STATE: IAppState = {
  varthrax: {
    id: "varthrax",
    name: "Varthrax",
    crowned: false,
    nScales: 0,
    imageSource: "../assets/talisman/varthrax-image.jpg",
    tokenSource: "../assets/talisman/varthrax-token.png",
  }, // varthrax
  cadorus: {
    id: "cadorus",
    name: "Cadorus",
    crowned: false,
    nScales: 0,
    imageSource: "../assets/talisman/cadorus-image.jpg",
    tokenSource: "../assets/talisman/cadorus-token.png",
  }, // cadorus
  grilipus: {
    id: "grilipus",
    name: "Grilipus",
    crowned: false,
    nScales: 0,
    imageSource: "../assets/talisman/grilipus-image.jpg",
    tokenSource: "../assets/talisman/grilipus-token.png",
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
  players: ["Leo", "Nico", "Cesco", "Rob"],
  settings: {
    scalesPerCrown: 5,
    messagesLimit: 5,
  }, // settings
  logs: [],
}; // INITIAL_STATE

@Injectable ()
export class TlsmStore extends BgStore<IAppState> {
  constructor () {
    super (INITIAL_STATE, "TlsmStore");
  } // constructor

  getPlayers () {
    return this.get ((s) => s.players);
  }
  getSettings () {
    return this.get ((s) => s.settings);
  }
  getDragon (dragonId: TlsmDragonId) {
    return this.get ((s) => s[dragonId]);
  }
  getPool () {
    return this.get ((s) => s.pool);
  }
  getKing (): IDragon | null {
    return this.get ((s) => {
      if (s.varthrax.crowned) {
        return s.varthrax;
      } else if (s.cadorus.crowned) {
        return s.cadorus;
      } else if (s.grilipus.crowned) {
        return s.grilipus;
      } else {
        return null;
      } // if - else
    });
  } // getKing

  selectPool$ () {
    return this.select$ ((s) => s.pool);
  }
  selectPlayers$ () {
    return this.select$ ((s) => s.players);
  }
  selectCrowned$ (dragonId: TlsmDragonId) {
    return this.select$ ((s) => s[dragonId].crowned);
  }
  selectLogs$ () {
    return this.select$ ((s) => s.logs);
  }
  selectDragon$ (dragonId: TlsmDragonId) {
    return this.select$ ((s) => s[dragonId]);
  }

  discardScale (dragonId: TlsmDragonId) {
    this.update ("Discard scale", (s) => ({
      ...s,
      [dragonId]: {
        ...s[dragonId],
        nScales: s[dragonId].nScales - 1,
      },
    }));
  } // discardScale

  saveOpt (players: string[], scalesPerCrown: number) {
    this.update ("Save opt", (s) => ({
      ...s,
      players: players,
      settings: {
        ...s.settings,
        scalesPerCrown: scalesPerCrown,
      },
    }));
  } // saveOpt

  clearLog () {
    this.update ("Clear log", (s) => ({
      ...s,
      logs: [],
    }));
  } // clearLog

  resetScale (dragonId: string) {
    this.update ("Reset scale", (s) => {
      switch (dragonId) {
        case "varthrax":
          return { ...s, varthrax: { ...s.varthrax, nScales: 0 } };
        case "cadorus":
          return { ...s, cadorus: { ...s.cadorus, nScales: 0 } };
        case "grilipus":
          return { ...s, grilipus: { ...s.grilipus, nScales: 0 } };
        default:
          return s;
      } // switch
    });
  } // resetScale

  crown (dragonId: string, crown: boolean) {
    this.update ("Reset scale", (s) => {
      switch (dragonId) {
        case "varthrax":
          return { ...s, varthrax: { ...s.varthrax, crowned: crown } };
        case "cadorus":
          return { ...s, cadorus: { ...s.cadorus, crowned: crown } };
        case "grilipus":
          return { ...s, grilipus: { ...s.grilipus, crowned: crown } };
        default:
          return s;
      } // switch
    });
  } // crown

  addLog (message: string, tokenSource: string) {
    this.update ("Reset scale", (s) => {
      return {
        ...s,
        logs: [...s.logs, { message: message, tokenSource: tokenSource }],
      }; // return
    });
  } // addLog

  drawStrike () {
    this.update ("Reset scale", (s) => {
      return { ...s, pool: { ...s.pool, strikes: s.pool.strikes - 1 } }; // return
    });
  } // drawStrike

  drawRage () {
    this.update ("Reset scale", (s) => {
      return { ...s, pool: { ...s.pool, rages: s.pool.rages - 1 } }; // return
    });
  } // drawRage

  drawSlumber () {
    this.update ("Reset scale", (s) => {
      return { ...s, pool: { ...s.pool, slumbers: s.pool.slumbers - 1 } }; // return
    });
  } // drawSlumber

  drawScale (dragonId: string, resolved: boolean) {
    this.update ("Reset scale", (s) => {
      switch (dragonId) {
        case "varthrax":
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
            }, // pool
          }; // return
        case "cadorus":
          return {
            ...s,
            cadorus: {
              ...s.cadorus,
              nScales: s.cadorus.nScales + (resolved ? 1 : 0),
            },
            pool: {
              ...s.pool,
              scales: { ...s.pool.scales, cadorus: s.pool.scales.cadorus - 1 },
            }, // pool
          }; // return
        case "grilipus":
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
            }, // pool
          }; // return
      } // switch
      return s;
    });
  } // drawScale
} // TlsmStore
