import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrLogWriter } from "../../../log/wotr-log-writer";
import { WotrRegionId } from "../../../region/wotr-region-models";
import { moveCharacters } from "../../wotr-character-actions";
import { WotrCharacterHandler } from "../../wotr-character-handler";
import { KomeSovereignId } from "../../wotr-character-models";

export abstract class KomeSovereignCard {
  public abstract sovereignId: KomeSovereignId;
  protected abstract corruptionRegion: WotrRegionId;
  protected abstract q: WotrGameQuery;
  protected abstract characterHandler: WotrCharacterHandler;
  protected abstract logger: WotrLogWriter;

  abstract canBeAwakened(die: WotrActionDie): boolean;
  abstract awaken(ui: WotrGameUi): Promise<WotrAction>;

  resolveAwakeEffect(): void {}

  resolveCorruptionEffect(): void {
    const fromRegion = this.q.brand.region();
    if (!fromRegion) throw new Error(`${this.sovereignId} is not in play.`);
    if (fromRegion.id !== this.corruptionRegion) {
      this.characterHandler.moveCharacters(
        [this.sovereignId],
        fromRegion.id,
        this.corruptionRegion
      );
      this.logger.logEffect(moveCharacters(fromRegion.id, this.corruptionRegion, this.sovereignId));
    }
  }
}
