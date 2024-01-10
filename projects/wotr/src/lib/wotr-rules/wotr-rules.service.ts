import { Injectable, inject } from "@angular/core";
import { WotrRulesSetupService } from "./wotr-rules-setup.service";

@Injectable ({
  providedIn: "root",
})
export class WotrRulesService {

  public setup = inject (WotrRulesSetupService);

} // WotrRulesService
