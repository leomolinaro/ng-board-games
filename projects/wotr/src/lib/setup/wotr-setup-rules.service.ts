import { Injectable, inject } from "@angular/core";
import { arrayUtil } from "@leobg/commons/utils";
import { WotrActionToken } from "../action-token/wotr-action-token.models";
import { WotrCharacterCardId, WotrStrategyCardId } from "../card/wotr-card.models";
import { WotrCardService } from "../card/wotr-card.service";
import { WotrCompanionId } from "../companion/wotr-character.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrNationId } from "../nation/wotr-nation.models";
import { WotrRegionId } from "../region/wotr-region.models";

export interface WotrSetup {
  regions: WotrRegionSetup[];
  fellowship: WotrFellowshipSetup;
  decks: WotrFrontDecksSetup[];
  freePeopleTokens: WotrActionToken[];
  shadowTokens: WotrActionToken[];
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

export interface WotrFellowshipSetup {
  region: WotrRegionId;
  companions: WotrCompanionId[];
  guide: WotrCompanionId;
}

@Injectable ({
  providedIn: "root",
})
export class WotrSetupRulesService {
  
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
      fellowship: {
        region: "rivendell",
        companions: ["gandalf-the-grey", "strider", "boromir", "legolas", "gimli", "meriadoc", "peregrin"],
        guide: "gandalf-the-grey"
      },
      freePeopleTokens: ["draw-card", "political-advance"],
      shadowTokens: []
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

  private fpRegionSetup (region: WotrRegionId, nation: WotrNationId, nRegulars: number, nElites: number, nLeaders: number): WotrRegionSetup {
    return { region, nation, nRegulars, nElites, nLeaders, nNazgul: 0 };
  }

  private sRegionSetup (region: WotrRegionId, nation: WotrNationId, nRegulars: number, nElites: number, nNazgul: number): WotrRegionSetup {
    return { region, nation, nRegulars, nElites, nLeaders: 0, nNazgul };
  }

}
