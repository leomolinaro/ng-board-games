import { Injectable } from "@angular/core";
import { baseCharacters } from "../../character/wotr-character-models";
import { WotrSetup, WotrSetupRules } from "../../setup/wotr-setup-rules";

@Injectable()
export class WotrSetupRulesMock extends WotrSetupRules {
  override getGameSetup(): WotrSetup {
    return {
      decks: super.shuffledDecks(),
      regions: [],
      fellowship: {
        progress: 0,
        region: "rivendell",
        companions: ["gandalf-the-grey"],
        guide: "gandalf-the-grey"
      },
      freePeopleTokens: [],
      shadowTokens: [],
      huntPool: [],
      characters: [...baseCharacters()]
    };
  }
}
