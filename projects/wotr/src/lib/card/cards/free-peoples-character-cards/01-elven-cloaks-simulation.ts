import { WotrSimulationDefinition } from "../../../simulation/wotr-simulation";
import { WotrStoriesBuilder } from "../../../simulation/wotr-story-builder";

const b = new WotrStoriesBuilder();

export const simulation01: WotrSimulationDefinition = {
  setup: rules => {
    return {
      decks: rules.decks(),
      regions: [],
      fellowship: {
        region: "rivendell",
        companions: ["gandalf-the-grey"],
        guide: "gandalf-the-grey"
      },
      freePeopleTokens: [],
      shadowTokens: []
    };
  },
  stories: [b.fpT().firstPhaseDraw("Elven Cloaks"), b.s().firstPhaseDraw()]
};
