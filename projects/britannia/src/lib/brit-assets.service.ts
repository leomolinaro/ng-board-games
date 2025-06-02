import { Injectable } from "@angular/core";
import { BritLeaderId, BritNationId, BritUnitType } from "./brit-components.models";
import { BritAreaUnit } from "./brit-game-state.models";

@Injectable({
  providedIn: "root"
})
export class BritAssetsService {
  constructor() {}

  getNationIconImageSource(nationId: BritNationId) {
    return `assets/britannia/population-markers/${nationId}.png`;
  }
  getNationCardImageSource(nationId: BritNationId) {
    return `assets/britannia/nation-cards/${nationId}.png`;
  }
  getNationPopulationMarkerImageSource(nationId: BritNationId) {
    return `assets/britannia/population-markers/${nationId}.png`;
  }

  getUnitImageSource(unit: BritAreaUnit) {
    switch (unit.type) {
      case "infantry":
        return `assets/britannia/infantries/${unit.nationId}.png`;
      case "cavalry":
        return `assets/britannia/cavalries/${unit.nationId}.png`;
      case "roman-fort":
        return "assets/britannia/buildings/roman-fort.png";
      case "saxon-buhr":
        return "assets/britannia/buildings/saxon-buhr.png";
      case "leader":
        return `assets/britannia/leaders/${unit.leaderId}.png`;
    } // switch
  } // getUnitImageSource

  getUnitImageSourceByType(unitType: BritUnitType, nationId: BritNationId, leaderId?: BritLeaderId) {
    switch (unitType) {
      case "infantry":
        return `assets/britannia/infantries/${nationId}.png`;
      case "cavalry":
        return `assets/britannia/cavalries/${nationId}.png`;
      case "roman-fort":
        return "assets/britannia/buildings/roman-fort.png";
      case "saxon-buhr":
        return "assets/britannia/buildings/saxon-buhr.png";
      case "leader":
        return `assets/britannia/leaders/${leaderId}.png`;
    } // switch
  } // getUnitImageSourceByType
} // BritAssetsService
