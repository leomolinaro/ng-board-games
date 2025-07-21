import { Injectable } from "@angular/core";
import { WotrAction } from "../commons/wotr-action-models";
import { corruptFellowship } from "../fellowship/wotr-fellowship-actions";
import { WotrPlayerChoice } from "../game/wotr-game-ui";

export interface WotrHuntEffectChoiceParams {
  damage: number;
}

@Injectable({ providedIn: "root" })
export class WotrFellowshipCorruptionChoice
  implements WotrPlayerChoice<WotrHuntEffectChoiceParams>
{
  label(): string {
    return "Use the Ring";
  }
  isAvailable(params: WotrHuntEffectChoiceParams): boolean {
    return true;
  }
  async resolve(params: WotrHuntEffectChoiceParams): Promise<WotrAction[]> {
    return [corruptFellowship(params.damage)];
  }
}
