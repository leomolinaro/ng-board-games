import { Injectable, inject } from "@angular/core";
import { BritRulesBattlesRetreatsService } from "./brit-rules-battles-retreats.service";
import { BritRulesMovementService } from "./brit-rules-movement.service";
import { BritRulesPopulationIncreaseService } from "./brit-rules-population-increase.service";
import { BritRulesSetupService } from "./brit-rules-setup.service";

@Injectable ({
  providedIn: "root",
})
export class BritRulesService {
  
  readonly setup = inject (BritRulesSetupService);
  readonly populationIncrease = inject (BritRulesPopulationIncreaseService);
  readonly movement = inject (BritRulesMovementService);
  readonly battlesRetreats = inject (BritRulesBattlesRetreatsService);

} // BritRulesService
