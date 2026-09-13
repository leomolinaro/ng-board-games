import { type Observable, of } from 'rxjs';

export class WotrMapServiceMock {
  loadMapPaths$(): Observable<boolean> {
    return of(true);
  }
  loadRegionSlots$(): Observable<boolean> {
    return of(true);
  }
  getViewBox(): string {
    return '0 0 0 0';
  }
  getWidth(): string {
    return '0';
  }
  getRegionPath(): string {
    return '';
  }
}
