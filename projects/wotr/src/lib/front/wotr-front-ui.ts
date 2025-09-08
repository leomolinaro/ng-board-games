import { inject, Injectable } from "@angular/core";
import { WotrActionDie } from "../action-die/wotr-action-die-models";
import { WotrGameUi, WotrUiOption } from "../game/wotr-game-ui";
import { WotrElvenRingAction } from "../game/wotr-story-models";
import { WotrFrontHandler } from "./wotr-front-handler";
import { WotrElvenRing, WotrFrontId } from "./wotr-front-models";

@Injectable({ providedIn: "root" })
export class WotrFrontUi {
  private ui = inject(WotrGameUi);
  private frontHandler = inject(WotrFrontHandler);

  async useElvenRing(ring: WotrElvenRing, frontId: WotrFrontId): Promise<WotrElvenRingAction> {
    const fromDie = await this.ui.askActionDie("Choose a die to change", frontId, [], null);
    if (fromDie.type !== "die") throw new Error("Die expected");
    const toDieOptions: WotrUiOption<WotrActionDie>[] = [
      { value: "character", label: "Character die" },
      { value: "army", label: "Army die" },
      { value: "muster", label: "Muster die" },
      { value: "event", label: "Event die" }
    ];
    if (frontId === "shadow") {
      toDieOptions.push({ value: "eye", label: "Eye die" });
    }
    const toDie = await this.ui.askOption<WotrActionDie>("Choose a die to change to", toDieOptions);
    const action: WotrElvenRingAction = {
      ring,
      fromDie: fromDie.die,
      toDie
    };
    this.frontHandler.useElvenRing(action, frontId);
    return action;
  }
}
