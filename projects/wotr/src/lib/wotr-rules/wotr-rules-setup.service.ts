import { Injectable } from "@angular/core";

@Injectable ({
  providedIn: "root",
})
export class WotrRulesSetupService {
  
  constructor () {}

  getGameSetup (): BritSetup {
    return {
      areas: {
        avalon: "welsh",
        downlands: "belgae",
        wessex: "belgae",
        sussex: "belgae",
        kent: "belgae",
        essex: "belgae",
        lindsey: "belgae",
        suffolk: "belgae",
        norfolk: "belgae",
        "south-mercia": "belgae",
        "north-mercia": "belgae",
        hwicce: "welsh",
        devon: "welsh",
        cornwall: "welsh",
        gwent: "welsh",
        dyfed: "welsh",
        powys: "welsh",
        gwynedd: "welsh",
        clwyd: "welsh",
        march: "brigantes",
        cheshire: "brigantes",
        york: "brigantes",
        bernicia: "brigantes",
        pennines: "brigantes",
        cumbria: "brigantes",
        lothian: "brigantes",
        galloway: "brigantes",
        dunedin: "picts",
        strathclyde: "brigantes",
        dalriada: "picts",
        alban: "picts",
        mar: "picts",
        moray: "picts",
        skye: "picts",
        caithness: "caledonians",
        orkneys: "caledonians",
        hebrides: "caledonians",
        "icelandic-sea": null,
        "north-sea": null,
        "frisian-sea": null,
        "english-channel": ["romans", 16],
        "irish-sea": null,
        "atlantic-ocean": null,
      },
      populationMarkers: [
        "welsh",
        "belgae",
        "brigantes",
        "picts",
        "caledonians",
      ],
      activeNations: [
        "romans",
        "welsh",
        "belgae",
        "brigantes",
        "picts",
        "caledonians",
      ],
    };
  } // getGameSetup

} // WotrRulesSetupService
