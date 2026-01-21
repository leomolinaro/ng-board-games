import { inject, Injectable } from "@angular/core";
import { WotrArmyAttack } from "../battle/wotr-battle-actions";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrNation } from "./wotr-nation-models";
import { WotrNationModifiers } from "./wotr-nation-modifiers";
import { WotrNationStore } from "./wotr-nation-store";

export type WotrNationAdvanceSource =
  | "muster-die-result"
  | "muster-army-die-result"
  | "will-of-the-west-die-result"
  | "token"
  | "character-ability"
  | "card-ability"
  | "auto-advance";

export type WotrNationActivationSource =
  | "region-entered"
  | "settlement-capture"
  | WotrArmyAttack
  | "fellowship-declaration"
  | "companion-ability"
  | "minion-ability"
  | "card-ability";

@Injectable()
export class WotrNationRules {
  private nationStore = inject(WotrNationStore);
  private nationModifiers = inject(WotrNationModifiers);

  canFrontAdvancePoliticalTrack(frontId: WotrFrontId, source: WotrNationAdvanceSource): boolean {
    const nations =
      frontId === "free-peoples"
        ? this.nationStore.freePeoplesNations()
        : this.nationStore.shadowNations();
    return nations.some(nation => this.canAdvancePoliticalTrack(nation, source));
  }

  canAdvancePoliticalTrack(nation: WotrNation, source: WotrNationAdvanceSource): boolean {
    if (!this.nationModifiers.canAdvanceNation(nation.id, source)) return false;
    return (
      nation.politicalStep === 3 ||
      nation.politicalStep === 2 ||
      (nation.politicalStep === 1 && nation.active)
    );
  }
}
