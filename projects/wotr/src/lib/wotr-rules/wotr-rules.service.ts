import { Injectable, inject } from "@angular/core";
import { WotrHuntRulesService } from "./wotr-hunt-rules.service";
import { WotrSetupRulesService } from "./wotr-setup-rules.service";

@Injectable ({
  providedIn: "root",
})
export class WotrRulesService {

  public setup = inject (WotrSetupRulesService);
  public hunt = inject (WotrHuntRulesService);

}
