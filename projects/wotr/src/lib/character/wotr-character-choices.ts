import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrAction } from "../commons/wotr-action-models";
import { WotrFrontId } from "../front/wotr-front-models";
import { WotrPlayerChoice } from "../game/wotr-game-ui";
import { WotrCharacterRules } from "./wotr-character-rules";
import { WotrCharacterUi } from "./wotr-character-ui";

export class WotrBringCharacterIntoPlayChoice implements WotrPlayerChoice {
  constructor(
    private die: WotrActionDie,
    private characterRules: WotrCharacterRules,
    private characterUi: WotrCharacterUi
  ) {}

  label(): string {
    return "Bring character into play";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.characterRules.canBringCharacterIntoPlay(this.die, frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.characterUi.bringCharacterIntoPlay(this.die, frontId);
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveCompanionsChoice implements WotrPlayerChoice {
  private characterRules = inject(WotrCharacterRules);
  private characterUi = inject(WotrCharacterUi);

  label(): string {
    return "Move companions";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.characterRules.canMoveCompanions();
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.characterUi.moveCompanions();
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveMinionsChoice implements WotrPlayerChoice {
  private characterRules = inject(WotrCharacterRules);
  private characterUi = inject(WotrCharacterUi);
  label(): string {
    return "Move minions";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.characterRules.canMoveNazgulOrMinions();
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    return this.characterUi.moveNazgulAndMinions();
  }
}
