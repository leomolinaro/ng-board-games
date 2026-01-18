import { Inject } from "@angular/core";
import { WotrSetup, WotrSetupRules } from "../../setup/wotr-setup-rules";

@Inject({
  provideIn: "root"
})
export class WotrSetupRulesMock extends WotrSetupRules {
  override getGameSetup(): WotrSetup {
    return {
      decks: super.decks(),
      regions: [],
      fellowship: {
        region: "rivendell",
        companions: ["gandalf-the-grey"],
        guide: "gandalf-the-grey"
      },
      freePeopleTokens: [],
      shadowTokens: []
    };
  }
}
