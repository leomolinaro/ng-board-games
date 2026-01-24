import { TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ActivatedRoute } from "@angular/router";
import { WotrSimulationPage } from "./wotr-simulation-page";

export class WotrSimulationPageBuilder {
  private simulationId: string | undefined;

  setSimulationId(simulationId: string): WotrSimulationPageBuilder {
    this.simulationId = simulationId;
    return this;
  }

  async build(): Promise<WotrSimulationPage> {
    await TestBed.configureTestingModule({
      imports: [WotrSimulationPage, NoopAnimationsModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: new Map([["simulationId", this.simulationId || "empty"]]) }
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(WotrSimulationPage);
    const component = fixture.componentInstance;
    // fixture.detectChanges();
    return component;
  }
}
