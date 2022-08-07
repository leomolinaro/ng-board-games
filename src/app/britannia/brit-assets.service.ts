import { Injectable } from '@angular/core';
import { BritNationId, BritUnit } from "./brit-models";

@Injectable ({
  providedIn: 'root'
})
export class BritAssetsService {

  constructor () { }

  getNationIconImageSource (nationId: BritNationId) { return `assets/britannia/population-markers/${nationId}.png`; }
  getNationCardImageSource (nationId: BritNationId) { return `assets/britannia/nation-cards/${nationId}.png`; }
  getNationPopulationMarkerImageSource (nationId: BritNationId) { return `assets/britannia/population-markers/${nationId}.png`; }

  getUnitImageSource (unit: BritUnit) {
    switch (unit.type) {
      case "infantry": return `assets/britannia/infantries/${unit.nation}.png`;
      case "cavalry": return `assets/britannia/cavalries/${unit.nation}.png`;
      case "roman-fort": return `assets/britannia/buildings/roman-fort.png`;
      case "saxon-buhr": return `assets/britannia/buildings/saxon-buhr.png`;
      case "leader": return `assets/britannia/leaders/${unit.id}.png`;
    } // switch
  } // getUnitImageSource

} // BritAssetsService
