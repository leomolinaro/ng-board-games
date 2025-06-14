import { Injectable } from "@angular/core";
import { WotrActionPlayerChoice } from "../action-die/wotr-action-die-choices";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";

@Injectable({ providedIn: "root" })
export class WotrFellowshipProgressChoice implements WotrActionPlayerChoice {
  label(): string {
    return "Fellowship progress";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrHideFellowshipChoice implements WotrActionPlayerChoice {
  label(): string {
    return "Hide fellowship";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    throw new Error("Method not implemented.");
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}
