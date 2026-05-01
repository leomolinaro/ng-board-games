import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { KomeSovereignId } from "../../wotr-character-models";

export abstract class KomeSovereignCard {
  public abstract sovereignId: KomeSovereignId;

  abstract canBeAwakened(die: WotrActionDie): boolean;
  abstract awaken(ui: WotrGameUi): Promise<WotrAction>;

  resolveAwakenEffect(): void {}
}
