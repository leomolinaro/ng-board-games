import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrFrontId } from "../front/wotr-front.models";
import {
  WotrAragornChoice,
  WotrGandalfTheWhite,
  WotrMouthOfSauronChoice,
  WotrSarumanChoice,
  WotrWitchKingChoice
} from "./wotr-characters";

@Injectable({ providedIn: "root" })
export class WotrCharactersService {
  private gandalfTheWhite = inject(WotrGandalfTheWhite);
  private aragornChoice = inject(WotrAragornChoice);
  private sarumanChoice = inject(WotrSarumanChoice);
  private witchKingChoice = inject(WotrWitchKingChoice);
  private mouthOfSauronChoice = inject(WotrMouthOfSauronChoice);

  someCharacterCanBeBroughtIntoPlay(die: WotrActionDie, frontId: WotrFrontId): boolean {
    if (frontId === "free-peoples") {
      if (this.gandalfTheWhite.canBeBroughtIntoPlay(die)) {
        return true;
      }
      if (this.aragornChoice.canBeBroughtIntoPlay(die)) {
        return true;
      }
    } else {
      if (die === "muster") {
        if (this.sarumanChoice.canBeBroughtIntoPlay(die)) {
          return true;
        }
        if (this.witchKingChoice.canBeBroughtIntoPlay(die)) {
          return true;
        }
        if (this.mouthOfSauronChoice.canBeBroughtIntoPlay(die)) {
          return true;
        }
      }
    }
    return false;
  }
}
