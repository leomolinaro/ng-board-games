import { Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrPlayerChoice } from "../game/wotr-game-ui";

@Injectable({ providedIn: "root" })
export class WotrActionDieEffects {
  private _freePeoplesMusterChoices: WotrPlayerChoice[] = [];
  freePeoplesMusterChoices(): WotrPlayerChoice[] {
    return this._freePeoplesMusterChoices;
  }

  private _shadowMusterChoices: WotrPlayerChoice[] = [];
  shadowMusterChoices(): WotrPlayerChoice[] {
    return this._shadowMusterChoices;
  }

  registerMusterChoice(choice: WotrPlayerChoice, frontId: WotrFrontId): void {
    if (frontId === "shadow") {
      this._shadowMusterChoices.push(choice);
    } else {
      this._freePeoplesMusterChoices.push(choice);
    }
  }

  unregisterMusterChoice(choice: WotrPlayerChoice, frontId: WotrFrontId): void {
    if (frontId === "shadow") {
      this._shadowMusterChoices = this._shadowMusterChoices.filter(c => c !== choice);
    } else {
      this._freePeoplesMusterChoices = this._freePeoplesMusterChoices.filter(c => c !== choice);
    }
  }

  clear() {
    this._shadowMusterChoices = [];
    this._freePeoplesMusterChoices = [];
  }
}
