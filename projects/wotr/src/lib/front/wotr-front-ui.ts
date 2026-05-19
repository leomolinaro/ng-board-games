import { inject, Injectable } from "@angular/core";
import { WotrActionDie, WotrActionDieResult } from "../action-die/wotr-action-die-models";
import { WotrGameUi, WotrUiOption } from "../game/wotr-game-ui";
import { WotrElvenRingAction } from "../game/wotr-story-models";
import { WotrFrontHandler } from "./wotr-front-handler";
import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";

@Injectable()
export class WotrFrontUi {
  private ui = inject(WotrGameUi);
  private frontHandler = inject(WotrFrontHandler);

  async useElvenRing(ring: WotrElvenRing, frontId: WotrFrontId): Promise<WotrElvenRingAction> {
    const fromDie = await this.ui.askActionDie("Choose a die to change", {
      frontId,
      specialDice: ["ruler"]
    });
    const toDieOptions: WotrUiOption<WotrActionDieResult>[] = [
      { value: "character", label: "Character die" },
      frontId === "free-peoples"
        ? { value: "muster-army", label: "Muster Army die" }
        : { value: "army", label: "Army die" },
      { value: "muster", label: "Muster die" },
      { value: "event", label: "Event die" }
    ];
    if (frontId === "shadow") toDieOptions.push({ value: "eye", label: "Eye die" });
    const toDieResult = await this.ui.askOption("Choose a die to change to", toDieOptions);
    const toDie: WotrActionDie =
      typeof fromDie === "string" ? toDieResult : { type: fromDie.type, result: toDieResult };
    const action: WotrElvenRingAction = {
      ring,
      fromDie,
      toDie
    };
    this.frontHandler.convertDieWithElvenRing(action, frontId);
    return action;
  }
}
