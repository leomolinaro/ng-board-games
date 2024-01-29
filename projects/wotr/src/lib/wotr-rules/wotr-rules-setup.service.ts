import { Injectable, inject } from "@angular/core";
import { arrayUtil } from "@leobg/commons/utils";
import { WotrCharacterCardId, WotrStrategyCardId } from "../wotr-elements/wotr-card.models";
import { WotrCardService } from "../wotr-elements/wotr-card.service";
import { WotrCompanionId } from "../wotr-elements/wotr-companion.models";
import { WotrFrontId } from "../wotr-elements/wotr-front.models";
import { WotrNationId, WotrPoliticalStep } from "../wotr-elements/wotr-nation.models";
import { WotrRegionId } from "../wotr-elements/wotr-region.models";

export interface WotrSetup {
  regions: WotrRegionSetup[];
  fellowship: WotrFellowshipSetup;
  nations: WotrNationSetup[];
  decks: WotrFrontDecksSetup[];
}

export interface WotrFrontDecksSetup {
  front: WotrFrontId;
  characterDeck: WotrCharacterCardId[];
  strategyDeck: WotrStrategyCardId[];
}

export interface WotrRegionSetup {
  region: WotrRegionId;
  nation: WotrNationId;
  nRegulars: number;
  nElites: number;
  nLeaders: number;
  nNazgul: number;
}

export interface WotrNationSetup {
  nation: WotrNationId;
  active: boolean;
  politicalStep: WotrPoliticalStep;
}

export interface WotrFellowshipSetup {
  region: WotrRegionId;
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
}

@Injectable ({
  providedIn: "root",
})
export class WotrRulesSetupService {
  
  private cards = inject (WotrCardService);

  getGameSetup (): WotrSetup {
    return {
      decks: this.decks (),
      regions: [
        this.fpRegionSetup ("erebor", "dwarves", 1, 2, 1),
        this.fpRegionSetup ("ered-luin", "dwarves", 1, 0, 0),
        this.fpRegionSetup ("iron-hills", "dwarves", 1, 0, 0),
        this.fpRegionSetup ("grey-havens", "elves", 1, 1, 1),
        this.fpRegionSetup ("rivendell", "elves", 0, 2, 1),
        this.fpRegionSetup ("woodland-realm", "elves", 1, 1, 1),
        this.fpRegionSetup ("lorien", "elves", 1, 2, 1),
        this.fpRegionSetup ("minas-tirith", "gondor", 3, 1, 1),
        this.fpRegionSetup ("dol-amroth", "gondor", 3, 0, 0),
        this.fpRegionSetup ("osgiliath", "gondor", 2, 0, 0),
        this.fpRegionSetup ("pelargir", "gondor", 1, 0, 0),
        this.fpRegionSetup ("bree", "north", 1, 0, 0),
        this.fpRegionSetup ("carrock", "north", 1, 0, 0),
        this.fpRegionSetup ("dale", "north", 1, 0, 1),
        this.fpRegionSetup ("north-downs", "north", 0, 1, 0),
        this.fpRegionSetup ("the-shire", "north", 1, 0, 1),
        this.fpRegionSetup ("edoras", "rohan", 1, 1, 0),
        this.fpRegionSetup ("fords-of-isen", "rohan", 2, 0, 1),
        this.fpRegionSetup ("helms-deep", "rohan", 1, 0, 0),
        this.sRegionSetup ("orthanc", "isengard", 4, 1, 0),
        this.sRegionSetup ("north-dunland", "isengard", 1, 0, 0),
        this.sRegionSetup ("south-dunland", "isengard", 1, 0, 0),
        this.sRegionSetup ("barad-dur", "sauron", 4, 1, 1),
        this.sRegionSetup ("dol-guldur", "sauron", 5, 1, 1),
        this.sRegionSetup ("gorgoroth", "sauron", 3, 0, 0),
        this.sRegionSetup ("minas-morgul", "sauron", 5, 0, 1),
        this.sRegionSetup ("moria", "sauron", 2, 0, 0),
        this.sRegionSetup ("mount-gundabad", "sauron", 2, 0, 0),
        this.sRegionSetup ("nurn", "sauron", 2, 0, 0),
        this.sRegionSetup ("morannon", "sauron", 5, 0, 1),
        this.sRegionSetup ("far-harad", "southrons", 3, 1, 0),
        this.sRegionSetup ("near-harad", "southrons", 3, 1, 0),
        this.sRegionSetup ("north-rhun", "southrons", 2, 0, 0),
        this.sRegionSetup ("south-rhun", "southrons", 3, 1, 0),
        this.sRegionSetup ("umbar", "southrons", 3, 0, 0),
      ],
      nations: [
        this.nationSetup ("dwarves", 3, false),
        this.nationSetup ("north", 3, false),
        this.nationSetup ("rohan", 3, false),
        this.nationSetup ("elves", 3, true),
        this.nationSetup ("gondor", 2, false),
        this.nationSetup ("southrons", 2, true),
        this.nationSetup ("isengard", 1, true),
        this.nationSetup ("sauron", 1, true),
      ],
      fellowship: {
        region: "rivendell",
        companions: ["gandalf-the-grey", "strider", "boromir", "legolas", "gimli", "meriadoc", "peregrin"],
        guide: "gandalf-the-grey"
      }
    };
  }
  
  decks (): WotrFrontDecksSetup[] {
    return [
      {
        front: "free-peoples",
        characterDeck: arrayUtil.shuffle (this.cards.getAllFreePeoplesCharacterCardIds ()),
        strategyDeck: arrayUtil.shuffle (this.cards.getAllFreePeoplesStrategyCardIds ()),
      },
      {
        front: "shadow",
        characterDeck: arrayUtil.shuffle (this.cards.getAllShadowCharacterCardIds ()),
        strategyDeck: arrayUtil.shuffle (this.cards.getAllShadowStrategyCardIds ()),
      }
    ];
  }

  private nationSetup (nation: WotrNationId, politicalStep: WotrPoliticalStep, active: boolean): WotrNationSetup {
    return { nation, active, politicalStep };
  }

  private fpRegionSetup (region: WotrRegionId, nation: WotrNationId, nRegulars: number, nElites: number, nLeaders: number): WotrRegionSetup {
    return { region, nation, nRegulars, nElites, nLeaders, nNazgul: 0 };
  }

  private sRegionSetup (region: WotrRegionId, nation: WotrNationId, nRegulars: number, nElites: number, nNazgul: number): WotrRegionSetup {
    return { region, nation, nRegulars, nElites, nLeaders: 0, nNazgul };
  }

}
