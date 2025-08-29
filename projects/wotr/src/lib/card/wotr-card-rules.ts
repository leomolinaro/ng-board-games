import { inject, Injectable } from "@angular/core";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrFrontStore } from "../front/wotr-front-store";

@Injectable({ providedIn: "root" })
export class WotrCardRules {
  private frontStore = inject(WotrFrontStore);

  canDrawCard(frontId: WotrFrontId): boolean {
    const front = this.frontStore.front(frontId);
    return front.characterDeck.length > 0 || front.strategyDeck.length > 0;
  }
}
