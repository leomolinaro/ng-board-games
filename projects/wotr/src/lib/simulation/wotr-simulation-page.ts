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
import { WotrSimulations } from "./wotr-simulations";

@Component({
  selector: "wotr-simulation-page",
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
export class WotrSimulationPage {
  private route = inject(ActivatedRoute);
  private simulations = inject(WotrSimulations);

  private gameId: string = this.route.snapshot.paramMap.get("gameId")!;
  protected gameConfig = resource<WotrGameConfig, void>({
    loader: async () => {
      const simulation = this.simulations.getSimulation(this.gameId);
      const gameConfig: WotrGameConfig = {};
      const setup = (await simulation.loadDefinition()).setup;
      if (setup) gameConfig.setup = setup;
      return gameConfig;
    }
  }).value;
}
