import { toObservable } from "@angular/core/rxjs-interop";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService } from "@leobg/commons";
import { Observable, of } from "rxjs";
import { WotrLog } from "../log/wotr-log-models";
import { WotrLogStore } from "../log/wotr-log-store";
import { WotrMapService } from "./board/map/wotr-map.service";
import { WotrGamePage } from "./wotr-game-page";

class WotrMapServiceMock {
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

class BgAuthServiceMock {
  getUser() {
    return { id: "test" };
  }
}

const activatedRouteMock = { snapshot: { paramMap: new Map([["gameId", "very-late-minions"]]) } };

describe("WotrGameComponent", () => {
  let component: WotrGamePage;
  let fixture: ComponentFixture<WotrGamePage>;
  let logs$: Observable<WotrLog[]>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WotrGamePage, NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: BgAuthService, useClass: BgAuthServiceMock },
        { provide: WotrMapService, useClass: WotrMapServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WotrGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should replay a game", async () => {
    component.onReplayLast();

    TestBed.runInInjectionContext(() => {
      const logStore = (component as any).logStore as WotrLogStore;
      logs$ = toObservable(logStore.state);
    });

    await new Promise(resolve => {
      const sub = logs$.subscribe(logs => {
        if (logs.length >= 529) {
          setTimeout(() => resolve(true), 1000);
          sub.unsubscribe();
        }
      });
    });
  }, 15000);
});
