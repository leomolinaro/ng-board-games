import { Injectable, inject } from "@angular/core";
import { WotrSetupRulesService } from "./wotr-setup-rules.service";

@Injectable ({
  providedIn: "root",
})
export class WotrRulesService {

  public setup = inject (WotrSetupRulesService);

}
