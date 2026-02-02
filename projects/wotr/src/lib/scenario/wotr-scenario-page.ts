import { ChangeDetectionStrategy, Component, inject, resource } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BgAuthService } from "../../../../commons/src";
import { WotrGameConfig } from "../game/wotr-game-config";
import { WotrGamePage } from "../game/wotr-game-page";
import { WotrRemoteService } from "../remote/wotr-remote";
import { WotrSetupRules } from "../setup/wotr-setup-rules";
import { BgAuthServiceMock } from "./mocks/bg-auth.service.mock";
import { WotrRemoteMock } from "./mocks/wotr-remote-mock";
import { WotrSetupRulesMock } from "./mocks/wotr-setup-rules.mock";
import { WotrScenarios } from "./wotr-scenarios";

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
      const setup = (await scenario.loadDefinition()).setup;
      if (setup) gameConfig.setup = setup;
      return gameConfig;
    }
  }).value;
}
