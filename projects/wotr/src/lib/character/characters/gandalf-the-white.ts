import { Injectable, inject } from "@angular/core";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrRegionId } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

@Injectable({ providedIn: "root" })
export class WotrGandalfTheWhite extends WotrCharacterCard {
  protected characterStore = inject(WotrCharacterStore);
  private regionStore = inject(WotrRegionStore);

  protected override characterId: WotrCharacterId = "gandalf-the-white";

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    if (!this.characterStore.isAvailable("gandalf-the-white")) return false;
    if (die !== "will-of-the-west") return false;
    const gandalf = this.characterStore.character("gandalf-the-grey");
    if (gandalf.status !== "inPlay" && gandalf.status !== "eliminated") return false;
    if (
      this.characterStore.minions().every(c => {
        return c.status !== "inPlay" && c.status !== "eliminated";
      })
    ) {
      return false;
    }
    return true;
  }

  async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const gandalf = this.characterStore.character("gandalf-the-grey");
    if (gandalf.status === "inPlay") {
      const gandalfRegion = this.regionStore.characterRegion("gandalf-the-grey")!;
      return playCharacter(gandalfRegion.id, "gandalf-the-white");
    } else if (gandalf.status === "eliminated") {
      const elvenStrongholds: WotrRegionId[] = [
        "rivendell",
        "lorien",
        "woodland-realm",
        "grey-havens"
      ];
      const targetRegions: WotrRegionId[] = ["fangorn"];
      for (const regionId of elvenStrongholds) {
        if (this.regionStore.isUnconquered(regionId)) {
          targetRegions.push(regionId);
        }
      }
      const region = await ui.askRegion(
        "Select a region to bring Gandalf the White into play",
        targetRegions
      );
      return playCharacter(region, "gandalf-the-white");
    }
    throw new Error(
      "Gandalf the Grey is not in a valid state to bring Gandalf the White into play."
    );
  }

  createAbilities(): WotrCardAbility[] {
    return [];
  }
}
