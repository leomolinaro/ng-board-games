import { Injectable } from '@angular/core';
import { BritArea, BritAreaId, BritColor, BritLandArea, BritLandAreaId, BritNationId, BritNeighbor, BritRegionId, BritSeaArea, BritSeaAreaId } from "./brit-models";

@Injectable ({
  providedIn: 'root'
})
export class BritConstantsService {

  constructor () { }

  private britColors: BritColor[] | null = null;
  private britAreaIds: BritAreaId[] | null = null;
  private britAreaMap: Record<BritAreaId, BritArea> | null = null;
  private britNationIds: BritNationId[] | null = null;

  getBritColors () {
    if (!this.britColors) {
      this.britColors = ["red", "blue", "yellow", "green"];
    } // if
    return this.britColors;
  } // getBritColors

  getBritAreaIds () {
    if (!this.britAreaIds) {
      this.britAreaIds = ["avalon", "downlands", "wessex", "sussex", "kent", "essex", "lindsey", "suffolk", "norfolk",
      "south-mercia", "north-mercia", "hwicce", "devon", "cornwall", "gwent", "dyfed", "powys",
      "gwynedd", "clwyd", "march", "cheshire", "york", "bernicia", "pennines", "cumbria", "lothian", "galloway",
      "dunedin", "strathclyde", "dalriada", "alban", "mar", "moray", "skye", "caithness", "orkneys", "hebrides",
      "icelandic-sea", "north-sea", "frisian-sea", "english-channel", "irish-sea", "atlantic-ocean"];
    } // if
    return this.britAreaIds;
  } // getBritAreaIds

  getBritNationIds () {
    if (!this.britNationIds) {
      this.britNationIds = ["romans", "romano-british", "belgae", "welsh", "brigantes",
      "caledonians", "picts", "irish", "scots", "norsemen", "dubliners", "danes", "norwegians",
      "saxons", "jutes", "angles", "normans"];
    } // if
    return this.britNationIds;
  } // getBritNationIds

  getBritArea (britAreaId: BritAreaId): BritArea {
    if (!this.britAreaMap) {
      this.britAreaMap = this.createBritAreaMap ();
    } // if
    return this.britAreaMap[britAreaId];
  } // getBritArea

  private createBritAreaMap (): Record<BritAreaId, BritArea> {
    return {
      "avalon": this.createLandArea ("avalon", "Avalon", "england", false, ["devon", "wessex", "downlands", "hwicce", "atlantic-ocean"]),
      "downlands": this.createLandArea ("downlands", "Downlands", "england", false, ["avalon", "wessex", "sussex", "essex", "south-mercia", "hwicce"]),
      "wessex": this.createLandArea ("wessex", "Wessex", "england", false, ["devon", "english-channel", "sussex", "downlands", "avalon"]),
      "sussex": this.createLandArea ("sussex", "Sussex", "england", false, ["wessex", "english-channel", "kent", "essex", "downlands"]),
      "kent": this.createLandArea ("kent", "Kent", "england", false, ["sussex", "english-channel", "frisian-sea", "essex"]),
      "essex": this.createLandArea ("essex", "Essex", "england", false, ["downlands", "sussex", "kent", "frisian-sea", "suffolk", "south-mercia"]),
      "lindsey": this.createLandArea ("lindsey", "Lindsey", "england", false, ["north-mercia", "suffolk", "norfolk", "frisian-sea", "york"]),
      "suffolk": this.createLandArea ("suffolk", "Suffolk", "england", false, ["south-mercia", "essex", "frisian-sea", "norfolk", "lindsey", "north-mercia"]),
      "norfolk": this.createLandArea ("norfolk", "Norfolk", "england", false, ["suffolk", "frisian-sea", "lindsey"]),
      "south-mercia": this.createLandArea ("south-mercia", "South Mercia", "england", false, ["hwicce", "downlands", "essex", "suffolk", "north-mercia"]),
      "north-mercia": this.createLandArea ("north-mercia", "North Mercia", "england", false, ["march", "hwicce", "south-mercia", "suffolk", "lindsey", "york"]),
      "hwicce": this.createLandArea ("hwicce", "Hwicce", "england", false, ["powys", "gwent", "atlantic-ocean", "avalon", "downlands", "south-mercia", "north-mercia", "march"]),
      "devon": this.createLandArea ("devon", "Devon", "england", false, ["cornwall", "english-channel", "wessex", "avalon", "atlantic-ocean", { id: "dyfed", strait: true }, { id: "gwent", strait: true }]),
      "cornwall": this.createLandArea ("cornwall", "Cornwall", "england", false, ["atlantic-ocean", "english-channel", "devon"]),
      "gwent": this.createLandArea ("gwent", "Gwent", "wales", false, ["dyfed", "atlantic-ocean", "hwicce", "powys", { id: "devon", strait: true }]),
      "dyfed": this.createLandArea ("dyfed", "Dyfed", "wales", false, ["atlantic-ocean", "gwent", "powys", { id: "devon", strait: true }]),
      "powys": this.createLandArea ("powys", "Powys", "wales", false, ["atlantic-ocean", "dyfed", "gwent", "hwicce", "march", "clwyd", "gwynedd"]),
      "gwynedd": this.createLandArea ("gwynedd", "Gwynedd", "wales", false, ["atlantic-ocean", "powys", "clwyd"]),
      "clwyd": this.createLandArea ("clwyd", "Clwyd", "wales", false, ["gwynedd", "powys", "march", "cheshire", "atlantic-ocean"]),
      "march": this.createLandArea ("march", "March", "england", false, ["powys", "hwicce", "north-mercia", "york", "cheshire", "clwyd"]),
      "cheshire": this.createLandArea ("cheshire", "Cheshire", "england", false, ["clwyd", "march", "york", "pennines", "cumbria", "irish-sea", "atlantic-ocean"]),
      "york": this.createLandArea ("york", "York", "england", false, ["pennines", "cheshire", "march", "north-mercia", "lindsey", "frisian-sea", "north-sea", "bernicia"]),
      "bernicia": this.createLandArea ("bernicia", "Bernicia", "england", false, ["pennines", "york", "north-sea", "lothian"]),
      "pennines": this.createLandArea ("pennines", "Pennines", "england", false, ["cumbria", "cheshire", "york", "bernicia", "lothian"]),
      "cumbria": this.createLandArea ("cumbria", "Cumbria", "england", false, ["irish-sea", "cheshire", "pennines", "lothian", "galloway"]),
      "lothian": this.createLandArea ("lothian", "Lothian", "england", false, ["galloway", "cumbria", "pennines", "bernicia", "north-sea", "dunedin", "strathclyde"]),
      "galloway": this.createLandArea ("galloway", "Galloway", "england", false, ["irish-sea", "cumbria", "lothian", "strathclyde"]),
      "dunedin": this.createLandArea ("dunedin", "Dunedin", "scotland", false, ["dalriada", "strathclyde", "lothian", "north-sea", "mar", "alban"]),
      "strathclyde": this.createLandArea ("strathclyde", "Strathclyde", "scotland", false, ["irish-sea", "galloway", "lothian", "dunedin", "dalriada"]),
      "dalriada": this.createLandArea ("dalriada", "Dalriada", "scotland", false, ["irish-sea", "strathclyde", "dunedin", "alban", "skye"]),
      "alban": this.createLandArea ("alban", "Alban", "scotland", false, ["skye", "dalriada", "dunedin", "mar", "moray"]),
      "mar": this.createLandArea ("mar", "Mar", "scotland", false, ["alban", "dunedin", "north-sea", "icelandic-sea", "moray"]),
      "moray": this.createLandArea ("moray", "Moray", "scotland", false, ["skye", "alban", "mar", "icelandic-sea", "caithness"]),
      "skye": this.createLandArea ("skye", "Skye", "scotland", false, [{ id: "hebrides", strait: true }, "icelandic-sea", "irish-sea", "dalriada", "alban", "moray", "caithness"]),
      "caithness": this.createLandArea ("caithness", "Caithness", "scotland", false, ["skye", "moray", "icelandic-sea", { id: "orkneys", strait: true }]),
      "orkneys": this.createLandArea ("orkneys", "Orkneys", "scotland", false, ["icelandic-sea", { id: "caithness", strait: true }]),
      "hebrides": this.createLandArea ("hebrides", "Hebrides", "scotland", false, ["icelandic-sea", { id: "skye", strait: true }]),
      "icelandic-sea": this.createSeaArea ("icelandic-sea", "Icelandic Sea", ["orkneys", "hebrides", "caithness", "skye", "moray", "mar", "irish-sea", "north-sea"]),
      "north-sea": this.createSeaArea ("north-sea", "North Sea", ["icelandic-sea", "mar", "dunedin", "lothian", "bernicia", "york", "frisian-sea"]),
      "frisian-sea": this.createSeaArea ("frisian-sea", "Frisian Sea", ["north-sea", "york", "lindsey", "norfolk", "suffolk", "essex", "kent", "english-channel"]),
      "english-channel": this.createSeaArea ("english-channel", "English Channel", ["atlantic-ocean", "north-sea", "kent", "sussex", "wessex", "devon", "cornwall"]),
      "irish-sea": this.createSeaArea ("irish-sea", "Irish Sea", ["icelandic-sea", "atlantic-ocean", "cheshire", "cumbria", "galloway", "strathclyde", "dalriada", "skye"]),
      "atlantic-ocean": this.createSeaArea ("atlantic-ocean", "Atlantic Ocean", ["irish-sea", "cheshire", "clwyd", "gwynedd", "powys", "dyfed", "gwent", "hwicce", "avalon", "devon", "cornwall", "english-channel"]),
    };
  } // createBritAreaMap

  private createLandArea (id: BritLandAreaId, name: string, region: BritRegionId, difficultTerrain: boolean, neighbors: BritNeighbor[]): BritLandArea {
    return {
      id: id,
      name: name,
      region: region,
      type: "land",
      difficultTerrain: difficultTerrain,
      units: [],
      neighbors: neighbors
    };
  } // createLandArea

  private createSeaArea (id: BritSeaAreaId, name: string, neighbors: BritAreaId[]): BritSeaArea {
    return {
      id: id,
      name: name,
      type: "sea",
      neighbors: neighbors,
      units: []
    };
  } // createLandArea

} // BritConstantsService
