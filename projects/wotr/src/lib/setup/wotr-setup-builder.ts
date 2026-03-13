import { WotrCompanionId } from "../character/wotr-character-models";
import { WotrNationId } from "../nation/wotr-nation-models";
import { WotrRegionId } from "../region/wotr-region-models";
import {
  WotrFrontDecksSetup,
  WotrRegionSetup,
  WotrSetup,
  WotrSetupRules
} from "./wotr-setup-rules";

export class WotrSetupBuilder {
  constructor(private rules: WotrSetupRules) {}

  static of(rules: WotrSetupRules): WotrSetupBuilder {
    return new WotrSetupBuilder(rules);
  }

  private deckSetups: WotrFrontDecksSetup[] = [];
  shuffledDecks(): WotrSetupBuilder {
    this.deckSetups = this.rules.shuffledDecks();
    return this;
  }

  private fwRegion: WotrRegionId = "rivendell";
  fellowshipRegion(region: WotrRegionId): WotrSetupBuilder {
    this.fwRegion = region;
    return this;
  }

  private fwProgress = 0;
  fellowshipProgress(progress: number): WotrSetupBuilder {
    this.fwProgress = progress;
    return this;
  }

  private fwGuide: WotrCompanionId = "gandalf-the-grey";
  fellowshipGuide(companionId: WotrCompanionId): WotrSetupBuilder {
    this.fwGuide = companionId;
    return this;
  }

  private fwCompanions: WotrCompanionId[] = [
    "gandalf-the-grey",
    "strider",
    "boromir",
    "legolas",
    "gimli",
    "meriadoc",
    "peregrin"
  ];
  fellowshipCompanions(...companionIds: WotrCompanionId[]): WotrSetupBuilder {
    this.fwCompanions = companionIds;
    return this;
  }

  private regions: WotrRegionSetup[] = [];
  region(
    region: WotrRegionId,
    nation: WotrNationId,
    units: { nRegulars?: number; nElites?: number; nLeaders?: number; nNazgul?: number }
  ): WotrSetupBuilder {
    this.regions.push({
      region,
      nation,
      nRegulars: units.nRegulars ?? 0,
      nElites: units.nElites ?? 0,
      nLeaders: units.nLeaders ?? 0,
      nNazgul: units.nNazgul ?? 0,
      ruler: null
    });
    return this;
  }

  build(): WotrSetup {
    return {
      decks: this.deckSetups,
      regions: this.regions,
      fellowship: {
        progress: this.fwProgress,
        region: this.fwRegion,
        companions: this.fwCompanions,
        guide: this.fwGuide
      },
      freePeopleTokens: [],
      shadowTokens: [],
      huntPool: [],
      characters: []
    };
  }
}
