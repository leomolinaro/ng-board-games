import { ChangeDetectionStrategy, Component, inject, resource } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService } from "../../../../commons/src";
import { WotrGameConfig } from "../game/wotr-game-config";
import { WotrGamePage } from "../game/wotr-game-page";
import { WotrRemoteService } from "../remote/wotr-remote";
import { WotrSetupBuilder } from "../setup/wotr-setup-builder";
import { WotrSetupRules } from "../setup/wotr-setup-rules";
import { BgAuthServiceMock } from "./mocks/bg-auth.service.mock";
import { WotrRemoteMock } from "./mocks/wotr-remote-mock";
import { WotrSetupRulesMock } from "./mocks/wotr-setup-rules.mock";
import { WotrScenarios } from "./wotr-scenarios";
import { DEFAULT_OPTIONS } from "../game/options/wotr-game-options";

@Component({
  selector: "wotr-scenario-page",
  imports: [WotrGamePage],
  template: `
    @if (gameConfig()) {
      <wotr-game-page [gameConfig]="gameConfig()" />,
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: BgAuthService, useClass: BgAuthServiceMock },
    { provide: WotrRemoteService, useClass: WotrRemoteMock },
    { provide: WotrSetupRules, useClass: WotrSetupRulesMock }
  ]
})
export class WotrScenarioPage {
  private route = inject(ActivatedRoute);
  private scenarios = inject(WotrScenarios);

  private gameId: string = this.route.snapshot.paramMap.get("gameId")!;
  protected gameConfig = resource<WotrGameConfig, void>({
    loader: async () => {
      const scenario = this.scenarios.getScenario(this.gameId);
      const gameConfig: WotrGameConfig = {};
      const scenarioDef = scenario.loadDefinition();
      const options = scenarioDef.options;
      if (options) gameConfig.options = options;
      const setup = scenarioDef.setup;
      if (setup)
        gameConfig.setup = rules => setup(new WotrSetupBuilder(options || DEFAULT_OPTIONS, rules));
      return gameConfig;
    }
  }).value;
}
