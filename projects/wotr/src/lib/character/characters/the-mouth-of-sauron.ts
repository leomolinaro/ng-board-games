import { Injectable, inject } from "@angular/core";
import { WotrActionDie } from "../../action-die/wotr-action-die-models";
import { WotrCardAbility } from "../../card/ability/wotr-card-ability";
import { WotrAction } from "../../commons/wotr-action-models";
import { WotrFellowshipStore } from "../../fellowship/wotr-fellowship-store";
import { WotrFrontStore } from "../../front/wotr-front-store";
import { WotrGameUi } from "../../game/wotr-game-ui";
import { WotrRegion } from "../../region/wotr-region-models";
import { WotrRegionStore } from "../../region/wotr-region-store";
import { playCharacter } from "../wotr-character-actions";
import { WotrCharacterId } from "../wotr-character-models";
import { WotrCharacterStore } from "../wotr-character-store";
import { WotrCharacterCard } from "./wotr-character-card";

@Injectable({ providedIn: "root" })
export class WotrMouthOfSauron extends WotrCharacterCard {
  private frontStore = inject(WotrFrontStore);
  protected characterStore = inject(WotrCharacterStore);
  private fellowshipStore = inject(WotrFellowshipStore);
  private regionStore = inject(WotrRegionStore);

  protected override characterId: WotrCharacterId = "the-mouth-of-sauron";

  canBeBroughtIntoPlay(die: WotrActionDie): boolean {
    return (
      die === "muster" &&
      this.characterStore.isAvailable("the-mouth-of-sauron") &&
      (this.fellowshipStore.isOnMordorTrack() ||
        this.frontStore.front("free-peoples").victoryPoints > 0) &&
      this.regionStore.regions().some(r => this.isValidRegion(r))
    );
  }

  async bringIntoPlay(ui: WotrGameUi): Promise<WotrAction> {
    const validRegions = this.regionStore
      .regions()
      .filter(r => this.isValidRegion(r))
      .map(r => r.id);
    const region = await ui.askRegion(
      "Select a region to bring the Mouth of Sauron into play",
      validRegions
    );
    return playCharacter(region, "the-mouth-of-sauron");
  }

  private isValidRegion(r: WotrRegion): boolean {
    return (
      r.nationId === "sauron" &&
      this.regionStore.isUnconquered(r.id) &&
      r.settlement === "stronghold"
    );
  }

  createAbilities(): WotrCardAbility[] {
    return [];
  }
}
