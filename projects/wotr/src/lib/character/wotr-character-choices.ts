import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die.models";
import { WotrAction } from "../commons/wotr-action.models";
import { WotrFrontId } from "../front/wotr-front.models";
import { WotrPlayerChoice } from "../game/wotr-game-ui.store";
import { WotrCharacterService } from "./wotr-character.service";

export class WotrBringCharacterIntoPlayChoice implements WotrPlayerChoice {
  constructor(
    private die: WotrActionDie,
    private characterService: WotrCharacterService
  ) {}

  label(): string {
    return "Bring character into play";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.characterService.canrBringCharacterIntoPlay(this.die, frontId);
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveCompanionsChoice implements WotrPlayerChoice {
  private characterService = inject(WotrCharacterService);
  label(): string {
    return "Move companions";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.characterService.canMoveCompanions();
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}

@Injectable({ providedIn: "root" })
export class WotrMoveMinionsChoice implements WotrPlayerChoice {
  private characterService = inject(WotrCharacterService);
  label(): string {
    return "Move minions";
  }

  isAvailable(frontId: WotrFrontId): boolean {
    return this.characterService.canMoveNazgulOrMinions();
  }

  async resolve(frontId: WotrFrontId): Promise<WotrAction[]> {
    throw new Error("Method not implemented.");
  }
}
