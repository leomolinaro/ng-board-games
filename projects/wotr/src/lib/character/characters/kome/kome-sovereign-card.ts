import { WotrActionDie } from "../../../action-die/wotr-action-die-models";
import { WotrAction } from "../../../commons/wotr-action-models";
import { WotrGameQuery } from "../../../game/wotr-game-query";
import { WotrGameUi } from "../../../game/wotr-game-ui";
import { WotrLogWriter } from "../../../log/wotr-log-writer";
import { WotrNationId } from "../../../nation/wotr-nation-models";
import { WotrRegionId } from "../../../region/wotr-region-models";
import { WotrRegionQuery } from "../../../region/wotr-region-query";
import { awakeSovereign, moveCharacters } from "../../wotr-character-actions";
import { WotrCharacterHandler } from "../../wotr-character-handler";
import { KomeSovereignId } from "../../wotr-character-models";

export abstract class KomeSovereignCard {
  public abstract sovereignId: KomeSovereignId;
  protected abstract nation: WotrNationId;
  protected abstract awakeningRegion: WotrRegionId | "any";
  protected abstract corruptionRegion: WotrRegionId;
  protected abstract q: WotrGameQuery;
  protected abstract characterHandler: WotrCharacterHandler;
  protected abstract logger: WotrLogWriter;

  canBeAwakened(die: WotrActionDie): boolean {
    if (die !== "muster") return false; // TODO Ruler die
    if (!this.q.nation(this.nation).isActive()) return false;
    const regions = this.getValidAwakeningRegions();
    return regions.length > 0;
  }

  private getValidAwakeningRegions(): WotrRegionQuery[] {
    const regions =
      this.awakeningRegion === "any"
        ? this.q.regions().filter(r => (r.isCity() || r.isStronghold()) && r.isFreePeoplesRegion())
        : [this.q.region(this.awakeningRegion)];

    const sovereignRegion = this.q.sovereign(this.sovereignId).region();
    if (!sovereignRegion) return [];
    const sovereignLevel = this.q.sovereign(this.sovereignId).level;
    return regions.filter(
      r => r.isUnconquered() && r.isWithinNRegionsOf(sovereignRegion.id, sovereignLevel)
    );
  }

  async awake(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.getValidAwakeningRegions();
    if (validRegions.length === 0)
      throw new Error(
        `Cannot awaken ${this.sovereignId} because there are no valid regions to awaken in.`
      );
    let awakeningRegion: WotrRegionId;
    if (validRegions.length > 1) {
      awakeningRegion = await ui.askRegion(
        `Where do you want to awaken ${this.sovereignId}?`,
        validRegions.map(r => r.id())
      );
    } else {
      awakeningRegion = validRegions[0].id();
    }
    return awakeSovereign(this.sovereignId, awakeningRegion);
  }

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
