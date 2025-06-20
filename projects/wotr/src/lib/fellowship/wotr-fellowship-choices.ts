import { inject, Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { hideFellowship, moveFelloswhip } from "./wotr-fellowship-actions";
import { WotrFellowshipStore } from "./wotr-fellowship.store";

@Injectable({ providedIn: "root" })
export class WotrFellowshipProgressChoice implements WotrPlayerChoice {
  private fellowshipStore = inject(WotrFellowshipStore);
  label(): string {
    return "Fellowship progress";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    if (this.fellowshipStore.isRevealed()) return false;
    return true;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return [moveFelloswhip()];
  }
}

@Injectable({ providedIn: "root" })
export class WotrHideFellowshipChoice implements WotrPlayerChoice {
  private fellowshipStore = inject(WotrFellowshipStore);

  label(): string {
    return "Hide fellowship";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.fellowshipStore.isRevealed();
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return [hideFellowship()];
  }
}

@Injectable({ providedIn: "root" })
export class WotrSeparateCompanionsChoice implements WotrPlayerChoice {
  private fellowshipStore = inject(WotrFellowshipStore);
  label(): string {
    return "Separate companions";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.fellowshipStore.numberOfCompanions() > 0;
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}
