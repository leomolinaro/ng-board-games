import { inject, Injectable } from "@angular/core";
import { randomUtil } from "../../../../commons/utils/src";
import { eliminateCharacter } from "../character/wotr-character-actions";
import { WotrCharacterHandler } from "../character/wotr-character-handler";
import { WotrAction } from "../commons/wotr-action-models";
import { chooseRandomCompanion, corruptFellowship } from "../fellowship/wotr-fellowship-actions";
import { WotrFellowshipStore } from "../fellowship/wotr-fellowship-store";
import { WotrFellowshipUi } from "../fellowship/wotr-fellowship-ui";
import { WotrUiChoice } from "../game/wotr-game-ui";
import { WotrHuntEffectParams } from "./wotr-hunt-models";

@Injectable({ providedIn: "root" })
export class WotrEliminateGuideChoice implements WotrUiChoice<WotrHuntEffectParams> {
  private fellowshipStore = inject(WotrFellowshipStore);
  private fellowshipUi = inject(WotrFellowshipUi);
  private characterHandler = inject(WotrCharacterHandler);

  label(): string {
    return "Eliminate the guide";
  }
  isAvailable(params: WotrHuntEffectParams): boolean {
    return this.fellowshipStore.guide() !== "gollum";
  }
  async actions(params: WotrHuntEffectParams): Promise<WotrAction[]> {
    const actions: WotrAction[] = [];
    const guide = this.fellowshipStore.guide();
    actions.push(eliminateCharacter(guide));
    this.characterHandler.eliminateCharacters([guide]);
    actions.push(await this.fellowshipUi.changeGuide());
    return actions;
  }
}

@Injectable({ providedIn: "root" })
export class WotrRandomCompanionChoice implements WotrUiChoice<WotrHuntEffectParams> {
  private fellowshipStore = inject(WotrFellowshipStore);
  label(): string {
    return "Eliminate a random companion";
  }
  isAvailable(params: WotrHuntEffectParams): boolean {
    return this.fellowshipStore.companions().length > 1;
  }
  async actions(params: WotrHuntEffectParams): Promise<WotrAction[]> {
    const companions = this.fellowshipStore.companions();
    const randomCompanion = randomUtil.getRandomElement(companions);
    return [chooseRandomCompanion(randomCompanion)];
  }
}

@Injectable({ providedIn: "root" })
export class WotrUseRingChoice implements WotrUiChoice<WotrHuntEffectParams> {
  label(): string {
    return "Use the Ring";
  }
  isAvailable(params: WotrHuntEffectParams): boolean {
    return true;
  }
  async actions(params: WotrHuntEffectParams): Promise<WotrAction[]> {
    return [corruptFellowship(params.damage)];
  }
}
