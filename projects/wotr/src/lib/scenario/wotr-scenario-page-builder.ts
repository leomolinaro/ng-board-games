import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { WotrScenarioPage } from './wotr-scenario-page';

export class WotrScenarioPageBuilder {
  private scenarioId: string | undefined;

  setScenarioId(scenarioId: string): WotrScenarioPageBuilder {
    this.scenarioId = scenarioId;
    return this;
  }

  async build(): Promise<WotrScenarioPage> {
    await TestBed.configureTestingModule({
      imports: [WotrScenarioPage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: new Map([['scenarioId', this.scenarioId ?? 'empty']]),
            },
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(WotrScenarioPage);
    const component = fixture.componentInstance;
    // fixture.detectChanges();
    return component;
  }
}
