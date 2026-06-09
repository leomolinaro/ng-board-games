import { Injectable } from "@angular/core";
import { baseCharacters } from "../../character/wotr-character-models";
import { DEFAULT_OPTIONS } from "../../game/options/wotr-game-options";
import { WotrSetup, WotrSetupRules } from "../../setup/wotr-setup-rules";

@Injectable()
export class WotrSetupRulesMock extends WotrSetupRules {
  override getGameSetup(): WotrSetup {
    return {
      decks: super.shuffledDecks(DEFAULT_OPTIONS),
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
      characters: [...baseCharacters()],
      nations: []
    };
  }
}
