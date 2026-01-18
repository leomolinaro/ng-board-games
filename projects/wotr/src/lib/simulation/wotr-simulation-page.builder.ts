import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { WotrGamePage } from "../game/wotr-game-page";

export class WotrSimulationPageBuilder {
  private gameId: string | undefined;

  setGameId(gameId: string): WotrSimulationPageBuilder {
    this.gameId = gameId;
    return this;
  }

  async build(): Promise<WotrGamePage> {
    await TestBed.configureTestingModule({
      imports: [WotrGamePage, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([["gameId", this.gameId || "empty"]]) } }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(WotrGamePage);
    const component = fixture.componentInstance;
    // fixture.detectChanges();
    return component;
  }
}
