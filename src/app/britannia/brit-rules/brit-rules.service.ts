import { Injectable } from '@angular/core';
import { BritRulesPopulationIncreaseService } from "./brit-rules-population-increase.service";
import { BritRulesSetupService } from "./brit-rules-setup.service";

@Injectable({
  providedIn: 'root'
})
export class BritRulesService {

  constructor (
    public readonly setup: BritRulesSetupService,
    public readonly populationIncrease: BritRulesPopulationIncreaseService
  ) { }

} // BritRulesService