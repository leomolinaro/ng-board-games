import { Injectable } from '@angular/core';
import type { BritSetup } from '../brit-game-state.models';

@Injectable({
  providedIn: 'root',
})
export class BritRulesSetupService {
  getGameSetup(): BritSetup {
    return {
      areas: {
        avalon: 'welsh',
        downlands: 'belgae',
        wessex: 'belgae',
        sussex: 'belgae',
        kent: 'belgae',
        essex: 'belgae',
        lindsey: 'belgae',
        suffolk: 'belgae',
        norfolk: 'belgae',
        'south-mercia': 'belgae',
        'north-mercia': 'belgae',
        hwicce: 'welsh',
        devon: 'welsh',
        cornwall: 'welsh',
        gwent: 'welsh',
        dyfed: 'welsh',
        powys: 'welsh',
        gwynedd: 'welsh',
        clwyd: 'welsh',
        march: 'brigantes',
        cheshire: 'brigantes',
        york: 'brigantes',
        bernicia: 'brigantes',
        pennines: 'brigantes',
        cumbria: 'brigantes',
        lothian: 'brigantes',
        galloway: 'brigantes',
        dunedin: 'picts',
        strathclyde: 'brigantes',
        dalriada: 'picts',
        alban: 'picts',
        mar: 'picts',
        moray: 'picts',
        skye: 'picts',
        caithness: 'caledonians',
        orkneys: 'caledonians',
        hebrides: 'caledonians',
        'icelandic-sea': undefined,
        'north-sea': undefined,
        'frisian-sea': undefined,
        'english-channel': ['romans', 16],
        'irish-sea': undefined,
        'atlantic-ocean': undefined,
      },
      populationMarkers: [
        'welsh',
        'belgae',
        'brigantes',
        'picts',
        'caledonians',
      ],
      activeNations: [
        'romans',
        'welsh',
        'belgae',
        'brigantes',
        'picts',
        'caledonians',
      ],
    };
  }
}
