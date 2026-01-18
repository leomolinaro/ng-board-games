import { of } from "rxjs";

export class WotrMapServiceMock {
  loadMapPaths$() {
    return of(true);
  }
  loadRegionSlots$() {
    return of(true);
  }
  getViewBox() {
    return "0 0 0 0";
  }
  getWidth() {
    return "0";
  }
  getRegionPath() {
    return "";
  }
}
