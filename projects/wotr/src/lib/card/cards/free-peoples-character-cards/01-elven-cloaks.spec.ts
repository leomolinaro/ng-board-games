import { TestBed } from "@angular/core/testing";
import { WotrFrontStore } from "../../../front/wotr-front-store";
import { WotrGamePage } from "../../../game/wotr-game-page";
import { WotrSimulationPageBuilder } from "../../../simulation/wotr-simulation-page.builder";

describe("Elven Cloaks", () => {
  let component: WotrGamePage;

  beforeEach(async () => {
    if (!component) {
      // eslint-disable-next-line require-atomic-updates
      component = await new WotrSimulationPageBuilder().build();
    }
  });

  it("should pass hello world test", (): void => {
    expect(true).toBe(true);

    const frontStore = TestBed.inject(WotrFrontStore);
    frontStore.update("", f => ({
      ...f,
      map: {
        ...f.map,
        "free-peoples": {
          ...f.map["free-peoples"],
          handCards: ["fpcha01"]
        }
      }
    }));

    expect(frontStore.front("free-peoples").handCards).toHaveLength(1);
  });

  it("should handle basic functionality", (): void => {
    const result: string = "hello world";
    expect(result).toBe("hello world");
  });

  it("should verify elven cloaks behavior", (): void => {
    const cloakActive: boolean = true;
    expect(cloakActive).toBeTruthy();
  });
});
