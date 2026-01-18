import { Observable } from "rxjs";
import { WotrLog } from "../log/wotr-log-models";
import { WotrSimulationPageBuilder } from "../simulation/wotr-simulation-page.builder";
import { WotrGamePage } from "./wotr-game-page";

describe("WotrGameComponent", () => {
  let component: WotrGamePage;
  let logs$: Observable<WotrLog[]>;

  beforeEach(async () => {
    component = await new WotrSimulationPageBuilder().setGameId("very-late-minions").build();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  // it("should replay a game", async () => {
  //   component.onReplayLast();

  //   TestBed.runInInjectionContext(() => {
  //     const logStore = (component as any).logStore as WotrLogStore;
  //     logs$ = toObservable(logStore.state);
  //   });

  //   await new Promise(resolve => {
  //     const sub = logs$.subscribe(logs => {
  //       if (logs.length >= 529) {
  //         setTimeout(() => resolve(true), 1000);
  //         sub.unsubscribe();
  //       }
  //     });
  //   });
  // }, 15000);
});
